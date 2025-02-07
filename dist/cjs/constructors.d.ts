import { type Atom, atom as jotaiAtom } from "jotai/vanilla";
import { atomFamily as jotaiAtomFamily, atomWithDefault as jotaiAtomWithDefault, atomWithLazy as jotaiAtomWithLazy, atomWithObservable as jotaiAtomWithObservable, atomWithReducer as jotaiAtomWithReducer, atomWithRefresh as jotaiAtomWithRefresh, atomWithStorage as jotaiAtomWithStorage } from "jotai/vanilla/utils";
type Meta = {
    name: string;
    args: any[];
};
export declare const isAtom: (value: any) => boolean;
export declare const atomReflect: (value: Atom<any>) => Meta;
export declare const atom: typeof jotaiAtom;
export declare const atomFamily: typeof jotaiAtomFamily;
export declare const atomWithDefault: typeof jotaiAtomWithDefault;
export declare const atomWithLazy: typeof jotaiAtomWithLazy;
export declare const atomWithObservable: typeof jotaiAtomWithObservable;
export declare const atomWithReducer: typeof jotaiAtomWithReducer;
export declare const atomWithRefresh: typeof jotaiAtomWithRefresh;
export declare const atomWithStorage: typeof jotaiAtomWithStorage;
export {};
