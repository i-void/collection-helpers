import { isArray, isSet, type ArrFn, type Collection, type CollectionFn, type RecKey, type MapFn, isMap, isRecord, type CollectionAsyncFn } from ".";
import { purry } from "remeda";

export function foreach<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => void;
export function foreach<V>(set: Set<V>, fn: ArrFn<V, void>): void; 
export function foreach<V>(arr: Array<V>, fn: ArrFn<V, void>): void; 
export function foreach<V>(arr: ReadonlyArray<V>, fn: ArrFn<V, void>): void; 
export function foreach<K, V>(map: Map<K, V>, fn: MapFn<K, V, void>): void; 
export function foreach<K extends RecKey, V>(obj: Record<K, V>, fn: MapFn<K, V, void>): void; 
export function foreach() {
  return purry(_foreach, arguments);
}

function _foreach<T extends Collection, F extends CollectionAsyncFn<T>>(collection: T, fn: F): void {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      fn(item, i);
      i++;
    }
  } 
  else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      fn({ key, value }, i);
      i++;
    }
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      fn({ key, value }, i);
      i++;
    }
  }
  else {
    throw new Error('Unsupported collection type');
  }
}

export function foreachAsync<T extends Collection, F extends CollectionAsyncFn<T>>(fn: F): (collection: T) => Promise<void>;
export function foreachAsync<V>(set: Set<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<V>(arr: Array<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<V>(arr: ReadonlyArray<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<K, V>(map: Map<K, V>, fn: MapFn<K, V, Promise<void>>): Promise<void>;
export function foreachAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapFn<K, V, Promise<void>>): Promise<void>;
export function foreachAsync() {
  return purry(_foreachAsync, arguments);
}

async function _foreachAsync<T extends Collection, F extends CollectionAsyncFn<T>>(collection: T, fn: F): Promise<void> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      await fn(item, i);
      i++;
    }
  }
  else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      await fn({ key, value }, i);
      i++;
    }
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      await fn({ key, value }, i);
      i++;
    }
  }
  else {
    throw new Error('Unsupported collection type');
  }
}