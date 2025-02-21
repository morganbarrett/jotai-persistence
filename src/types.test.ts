import { describe, expectTypeOf, it } from "vitest";
import type { PersistenceStorage, StorageAtomPrimitive } from "./types";

//TODO StorageAtom

//TODO StorageAtomPrimitive
//TODO write test to check that storages with extended serializer can have nested atoms with extended types

describe("PersistenceStorage", () => {
  type Primitive = StorageAtomPrimitive;
  type SyncStorage = PersistenceStorage<Primitive, string | null>;
  type AsyncStorage = PersistenceStorage<Primitive, Promise<string | null>>;

  //TODO atom

  //TODO isAtom

  //TODO isAtomWithKey
  // const X: PersistenceStorage<StorageAtomPrimitive> = 2;
  // const Y: PersistenceStorage<Promise<StorageAtomPrimitive>> = 2;
  // X.isAtomWithKey(x, (key) => key === 3);
  // Y.isAtomWithKey(y, (key) => key === 3);

  //TODO schema
  // const X: PersistenceStorage<StorageAtomPrimitive> = 2;
  // const Y: PersistenceStorage<Promise<StorageAtomPrimitive>> = 2;
  // let x = X.schema((key) => key === 3).parse();
  // let y = Y.schema((key) => key === 3).parse();

  it("get", () => {
    expectTypeOf<Parameters<SyncStorage["get"]>>().toMatchTypeOf<[Primitive]>();

    expectTypeOf<Parameters<AsyncStorage["get"]>>().toMatchTypeOf<
      [Primitive]
    >();

    expectTypeOf<ReturnType<SyncStorage["get"]>>().toMatchTypeOf<Primitive>();

    expectTypeOf<ReturnType<AsyncStorage["get"]>>().toMatchTypeOf<Primitive>();
  });

  it("set", () => {
    expectTypeOf<Parameters<SyncStorage["set"]>>().toMatchTypeOf<
      [Primitive, Primitive]
    >();

    expectTypeOf<Parameters<AsyncStorage["set"]>>().toMatchTypeOf<
      [Primitive, Primitive]
    >();
  });
});
