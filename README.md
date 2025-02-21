# Jotai Persistence

> :warning: **DRAFT**: Not intended for use yet

## Install

`npm install jotai-persistence`

## About

Proivides an improved version of [atomWithStorage](https://jotai.org/docs/utilities/storage) that utilizes [extended-serializer](https://github.com/morganbarrett/extended-serializer) to serialize complex data, including nested atoms, and adds validators to validate serialized data.

## Examples

```ts
import { createStorage } from "jotai-persistence";

const storage = createStorage(window.localStorage);

window.addEventListener("storage", (event: StorageEvent) => {
  if (event.storageArea === window.localStorage) {
    storage.set(event.key, storage.parse(event.newValue));
  }
});

const todos = storage.atom({
  key: "todos",
  initialValue: new Map<string, PersistentAtom<Todo>>(),
  validator: z.map(
    z.string(),
    atomSchema((key) => key[0] === "todo")
  ),
});

const addTodo = (title: string) => {
  const id = createId();
  const atom = storage.atom(["todo", id], title, storage);
  store.set(todos, (arr) => new Map([...arr, [id, atom]]));
};
```

Async storage with custom serialization transform:

```ts
import { createSerializer } from "jotai-persistence";
import { makeClassTransform } from "extended-serializer";
import { z } from "zod";

class Custom {
  constructor(
    public a: number,
    public b: number
  ) {}
}

const serializer = createSerializer([
  makeClassTransform({
    class: Custom,
    encode: (value) => [value.a, value.b],
  }),
]);

const storage = serializer.createStorage(AsyncStorage);

const atom = storage.atom<Custom[]>({
  key: "custom",
  initialValue: [],
  validator: z.array(z.instanceof<Custom>()),
});
```
