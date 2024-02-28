import { purry } from "remeda";
import { isArray, isSet, type ArrFn, type ArrLike } from "..";

export function foreach<V>(fn: ArrFn<V, void>): (obj: ArrLike<V>) => void;
export function foreach<V>(set: Set<V>, fn: ArrFn<V, void>): void;
export function foreach<T>(arr: T[], fn: ArrFn<T, void>): void;
export function foreach() {
  return purry(_foreach, arguments);
}

function _foreach<V>(collection: ArrLike<V>, fn: ArrFn<V, void>): void {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      fn(item, i);
      i++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function foreachAsync<V>(fn: ArrFn<V, Promise<void>>): (obj: ArrLike<V>) => Promise<void>;
export function foreachAsync<V>(set: Set<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<T>(arr: T[], fn: ArrFn<T, Promise<void>>): Promise<void>;
export function foreachAsync() {
  return purry(_foreachAsync, arguments);
}

async function _foreachAsync<V>(collection: ArrLike<V>, fn: ArrFn<V, Promise<void>>): Promise<void> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      await fn(item, i);
      i++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}