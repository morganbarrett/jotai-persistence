import { type Atom, atom as jotaiAtom } from "jotai/vanilla";
import {
  atomFamily as jotaiAtomFamily,
  atomWithDefault as jotaiAtomWithDefault,
  atomWithLazy as jotaiAtomWithLazy,
  atomWithObservable as jotaiAtomWithObservable,
  atomWithReducer as jotaiAtomWithReducer,
  atomWithRefresh as jotaiAtomWithRefresh,
  atomWithStorage as jotaiAtomWithStorage,
} from "jotai/vanilla/utils";

type Meta = {
  name: string;
  args: any[];
};

const atomSymbol = Symbol("atom");

const tag = <Fn extends (...args: any[]) => any>(name: string, fn: Fn) =>
  ((...args) => {
    const atom = fn(...args);
    atom[atomSymbol] = { name, args } satisfies Meta;
    return atom;
  }) as Fn;

export const isAtom = (value: any) => atomSymbol in value;

export const atomReflect = (value: Atom<any>): Meta =>
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
