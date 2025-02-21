import type { TransformedPrimitive, Transform } from "extended-serializer";
import type { WritableAtom } from "jotai";
import type { RESET } from "jotai/utils";
import type { z } from "zod";

type SetState<Value> =
  | Value
  | typeof RESET
  | ((prev: Value) => Value | typeof RESET);

type Unsubscribe = () => void;

type Subscribe<Value> = (
  key: string,
  callback: (value: Value) => void,
  initialValue: Value
) => Unsubscribe;

type StringSubscribe = (
  key: string,
  callback: (value: string | null) => void
) => Unsubscribe;

type Ret<Value> = Value extends Promise<any> ? Promise<void> : void;

type SS<S, Value> = S extends Promise<any> ? Promise<Value> : Value;

export type Meta = {
  id: symbol;
  key: any;
};

export type Subscriptions = Set<(value: any) => void>;

export type StringStorage<Value> = {
  getItem: (key: string) => Value;
  setItem: (key: string, newValue: string) => Ret<Value>;
  removeItem: (key: string) => Ret<Value>;
  subscribe?: StringSubscribe;
};

export const atomSymbol = Symbol();

export type StorageAtomOptions<Type, Value extends Type> = {
  key: Type;
  initialValue: Value;
  validator: z.ZodSchema<Value>;
};

export type StorageAtom<Value, S> = Record<typeof atomSymbol, Meta> &
  WritableAtom<SS<S, Value>, [SetState<SS<S, Value>>], void>;

export type StorageAtomPrimitive = TransformedPrimitive<StorageAtom<any, any>>;

export type PersistenceStorage<Type, S> = {
  atom: <Value extends Type>(
    options: StorageAtomOptions<Type, Value>
  ) => StorageAtom<Value, S>;
  isAtom: <Value extends Type>(
    value: unknown
  ) => value is StorageAtom<Value, S>;
  isAtomWithKey: <Value extends Type>(
    value: unknown,
    keyValidator: (key: Type) => boolean
  ) => value is StorageAtom<Value, S>;
  schema: <Value extends Type>(
    keyValidator: (key: Type) => boolean
  ) => z.ZodType<StorageAtom<Value, S>, z.ZodTypeDef, StorageAtom<Value, S>>;
  get: (key: Type) => Type;
  set: (key: Type, value: Type) => void;
};

export interface JotaiStorage<Value, S> {
  getItem: (key: string, initialValue: Value) => SS<S, Value>;
  setItem: (key: string, newValue: Value) => Ret<S>;
  removeItem: (key: string) => Ret<S>;
  subscribe?: Subscribe<Value>;
}
