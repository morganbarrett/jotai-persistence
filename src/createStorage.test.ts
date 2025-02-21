import { describe, expectTypeOf, it } from "vitest";
import { createStorage } from "./createStorage";
import type {
  PersistenceStorage,
  StorageAtomPrimitive,
  StringStorage,
} from "./types";

const syncStorage = {
  getItem: () => "",
  setItem: () => {},
  removeItem: () => {},
} satisfies StringStorage<string | null>;

const asyncStorage = {
  getItem: async () => "",
  setItem: async () => {},
  removeItem: async () => {},
} satisfies StringStorage<Promise<string | null>>;

describe("type", () => {
  it("sync", () => {
    expectTypeOf(createStorage(syncStorage)).toMatchTypeOf<
      PersistenceStorage<StorageAtomPrimitive, string | null>
    >();
  });

  it("async", () => {
    expectTypeOf(createStorage(asyncStorage)).toMatchTypeOf<
      PersistenceStorage<StorageAtomPrimitive, Promise<string | null>>
    >();
  });
});
