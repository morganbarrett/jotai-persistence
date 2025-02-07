# Jotai Persistence

> :warning: **DRAFT**: Not intended for use yet

## Install

`npm install jotai-persistence`

## About

- Exports everything from "jotai" and "jotai/utils".
- Modifies atom creation to tag atoms for use with `isAtom` and `atomReflect`.
- Modifies `createJSONStorage` to support nested atoms, and also to throw an error if the data is not serializable.

## Example

```ts
const todos = atomWithStorage<Atom<Todo>[]>("todos", [], storage);

const addTodo = (title: string) => {
  const id = createId();
  const todo = { id, title };
  const atom = atomWithStorage<Todo>(`todo-${id}`, todo, storage);

  store.set(todos, (arr) => [...arr, atom]);
};
```
