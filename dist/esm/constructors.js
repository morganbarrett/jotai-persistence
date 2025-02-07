import { atom as jotaiAtom } from "jotai/vanilla";
import { atomFamily as jotaiAtomFamily, atomWithDefault as jotaiAtomWithDefault, atomWithLazy as jotaiAtomWithLazy, atomWithObservable as jotaiAtomWithObservable, atomWithReducer as jotaiAtomWithReducer, atomWithRefresh as jotaiAtomWithRefresh, atomWithStorage as jotaiAtomWithStorage, } from "jotai/vanilla/utils";
const atomSymbol = Symbol("atom");
const tag = (name, fn) => ((...args) => {
    const atom = fn(...args);
    atom[atomSymbol] = { name, args };
    return atom;
});
export const isAtom = (value) => atomSymbol in value;
export const atomReflect = (value) => 
//@ts-expect-error Atom doesn't know about atomSymbol
value[atomSymbol] ?? { name: "foreign", args: [] };
export const atom = tag("core", jotaiAtom);
export const atomFamily = tag("family", jotaiAtomFamily);
export const atomWithDefault = tag("default", jotaiAtomWithDefault);
export const atomWithLazy = tag("lazy", jotaiAtomWithLazy);
export const atomWithObservable = tag("observable", jotaiAtomWithObservable);
export const atomWithReducer = tag("reducer", jotaiAtomWithReducer);
export const atomWithRefresh = tag("refresh", jotaiAtomWithRefresh);
export const atomWithStorage = tag("storage", jotaiAtomWithStorage);
