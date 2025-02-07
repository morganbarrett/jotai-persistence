import type { Atom } from "jotai/vanilla";
import { createJSONStorage as jotaiCreateJSONStorage } from "jotai/vanilla/utils";
import safeJsonValue from "safe-json-value";
import { atom, atomReflect, atomWithStorage, isAtom } from "./constructors";

const get = (v: any) => {};

type Storage = ReturnType<typeof jotaiCreateJSONStorage>;

const atomRegex = /^\\*atom$/;

const escapeArray = (value: any[]) => {
  const [first, ...rest] = value;

  if (first.test(atomRegex)) {
    return [`\\${first}`, ...rest];
  }

  return value;
};

const unescapeArray = (value: any[]) => {
  const [first, ...rest] = value;

  if (first.test(atomRegex)) {
    return [first.slice(1), ...rest];
  }

  return value;
};

const serializeAtom = (value: Atom<any>, storage: Storage) => {
  const { name, args } = atomReflect(value);

  if (name === "core") {
    const [read, write] = args;

    if (typeof read === "function" || typeof write === "function") {
      throw new Error("Cannot serialize computed atoms");
    }

    return ["atom", get(value)];
  }

  if (name === "storage") {
    const [key, initialValue, otherStorage] = args;

    if (storage !== otherStorage) {
      throw new Error("Cannot serialize atoms with different storage");
    }

    return ["atom", initialValue, key];
  }

  throw new Error(`Cannot serialize ${name} atoms`);
};

const deserializeAtom = (
  [_, serializedValue, storageKey]: string[],
  storage: Storage
) => {
  const value = reviver("", serializedValue, storage);

  if (storageKey !== undefined) {
    return atomWithStorage(storageKey, value, storage);
  }

  return atom(value);
};

const isPrimitiveValue = (value: any) => !safeJsonValue(value).changes.length;

const replacer = (key: string, value: any, storage: Storage) => {
  if (!isPrimitiveValue(value)) {
    throw new Error("Non serializable value");
  }

  if (isAtom(value)) {
    return serializeAtom(value, storage);
  }

  if (Array.isArray(value)) {
    return escapeArray(value);
  }

  return value;
};

const reviver = (key: string, value: any, storage: Storage): any => {
  if (!Array.isArray(value)) {
    return value;
  }

  if (value[0] === "atom") {
    return deserializeAtom(value, storage);
  }

  return unescapeArray(value);
};

export const createJSONStorage = ((getStringStorage, options) => {
  //@ts-expect-error getStringStorage bugging out
  const storage = jotaiCreateJSONStorage(getStringStorage, {
    replacer(key: string, value: any) {
      const newValue = replacer(key, value, storage);

      if (options?.replacer) {
        return options.replacer(key, newValue);
      }

      return newValue;
    },
    reviver(key: string, value: any) {
      const newValue = reviver(key, value, storage);

      if (options?.reviver) {
        return options.reviver(key, newValue);
      }

      return newValue;
    },
  });

  return storage;
}) as typeof jotaiCreateJSONStorage;
