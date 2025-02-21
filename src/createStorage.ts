import {
  stringify,
  transforms,
  isPureObject,
  makeTransform,
  type Transform,
  parse,
} from "extended-serializer";
import { atomWithStorage } from "jotai/vanilla/utils";
import { z } from "zod";
import {
  type StorageAtomPrimitive,
  type PersistenceStorage,
  type StorageAtom,
  type StorageAtomOptions,
  type StringStorage,
  atomSymbol,
  type Subscriptions,
  type Meta,
  type JotaiStorage,
} from "./types";

export const createSerializer =
  <Type>(customTransforms: Transform<any, any>[]) =>
  <S extends string | null | Promise<string | null>>(
    stringStorage: StringStorage<S>
  ): PersistenceStorage<Type, S> => {
    const id = Symbol();
    const subscriptionsMap = new Map<string, Subscriptions>();
    const store = new Map();

    const get = (key: Type): Type => store.get(key);

    const set = (key: Type, value: Type) => {
      const keyStr = stringify(key, { transforms });
      const callbacks = subscriptionsMap.get(keyStr) ?? [];

      for (const callback of callbacks) {
        callback(value);
      }
    };

    const isAtom = <Value extends Type = Type>(
      value: unknown
    ): value is StorageAtom<Value, S> =>
      isPureObject(value) &&
      atomSymbol in value &&
      (value[atomSymbol] as Meta).id === id;

    const isAtomWithKey = <Value extends Type = Type>(
      value: unknown,
      keyValidator: (key: Type) => boolean
    ): value is StorageAtom<Value, S> =>
      isAtom<Value>(value) && keyValidator(value[atomSymbol].key);

    const schema = <Value extends Type>(keyValidator: (key: Type) => boolean) =>
      z.custom<StorageAtom<Value, S>>((value) =>
        isAtomWithKey(value, keyValidator)
      );

    const atom = <Value extends Type>(
      options: StorageAtomOptions<Type, Value>
    ): StorageAtom<Value, S> => {
      const atomTransform = makeTransform({
        key: "atom",
        test: isAtom,
        decode: () => atom(options),
      });
      const serializeOptions = {
        transforms: [...transforms, atomTransform, ...customTransforms],
      };
      const key = stringify(options.key, { transforms });
      const jotaiOptions = { getOnInit: true };

      if (!store.has(key)) {
        store.set(key, options.initialValue);
      }

      const subscriptions: Subscriptions = new Set();

      const parseValue = (str: string | undefined | null): Value => {
        try {
          return options.validator.parse(parse(str ?? "", serializeOptions));
        } catch {
          return options.initialValue;
        }
      };

      const storage = {
        getItem(key: string) {
          const ret = stringStorage.getItem(key);
          return ret && "then" in ret ? ret.then(parseValue) : parseValue(ret);
        },
        setItem(key: string, value: Value) {
          const str = stringify(value, serializeOptions);

          store.set(options.key, str);

          return stringStorage.setItem(key, str);
        },
        removeItem(key: string) {
          return stringStorage.removeItem(key);
        },
        subscribe(key: string, callback: (value: Value) => void) {
          subscriptions.add(callback);

          const unsubscribe = stringStorage.subscribe
            ? stringStorage.subscribe(key, (value) =>
                callback(parseValue(value))
              )
            : () => {};

          return () => {
            subscriptions.delete(callback);
            unsubscribe();
          };
        },
      } satisfies JotaiStorage<Value, S>;

      subscriptionsMap.set(key, subscriptions);

      return {
        ...atomWithStorage(key, options.initialValue, storage, jotaiOptions),
        [atomSymbol]: { id, key },
      };
    };

    return { get, set, isAtom, isAtomWithKey, schema, atom };
  };

export const createStorage = createSerializer<StorageAtomPrimitive>([]);
