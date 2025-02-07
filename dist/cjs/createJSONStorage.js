import { createJSONStorage as jotaiCreateJSONStorage } from "jotai/vanilla/utils";
import safeJsonValue from "safe-json-value";
import { atom, atomReflect, atomWithStorage, isAtom } from "./constructors";
const get = (v) => { };
const atomRegex = /^\\*atom$/;
const escapeArray = (value) => {
    const [first, ...rest] = value;
    if (first.test(atomRegex)) {
        return [`\\${first}`, ...rest];
    }
    return value;
};
const unescapeArray = (value) => {
    const [first, ...rest] = value;
    if (first.test(atomRegex)) {
        return [first.slice(1), ...rest];
    }
    return value;
};
const serializeAtom = (value, storage) => {
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
const deserializeAtom = ([_, serializedValue, storageKey], storage) => {
    const value = reviver("", serializedValue, storage);
    if (storageKey !== undefined) {
        return atomWithStorage(storageKey, value, storage);
    }
    return atom(value);
};
const isPrimitiveValue = (value) => !safeJsonValue(value).changes.length;
const replacer = (key, value, storage) => {
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
const reviver = (key, value, storage) => {
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
        replacer(key, value) {
            const newValue = replacer(key, value, storage);
            if (options?.replacer) {
                return options.replacer(key, newValue);
            }
            return newValue;
        },
        reviver(key, value) {
            const newValue = reviver(key, value, storage);
            if (options?.reviver) {
                return options.reviver(key, newValue);
            }
            return newValue;
        },
    });
    return storage;
});
