import { purry } from "remeda";
import { isArray, isSet, type ArrFn, type ArrLike, type Collection, type CollectionFn, type RecKey, type MapFn } from ".";

export function foreach<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => void;
export function foreach<V>(set: Set<V>, fn: ArrFn<V, void>): void; 
export function foreach<V>(arr: Array<V>, fn: ArrFn<V, void>): void; 
export function foreach<V>(arr: ReadonlyArray<V>, fn: ArrFn<V, void>): void; 
export function foreach<K, V>(map: Map<K, V>, fn: MapFn<K, V, void>): void; 
export function foreach<K extends RecKey, V>(obj: Record<K, V>, fn: MapFn<K, V, void>): void; 
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

export function foreachAsync<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => Promise<void>;
export function foreachAsync<V>(set: Set<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<V>(arr: Array<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<V>(arr: ReadonlyArray<V>, fn: ArrFn<V, Promise<void>>): Promise<void>;
export function foreachAsync<K, V>(map: Map<K, V>, fn: MapFn<K, V, Promise<void>>): Promise<void>;
export function foreachAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapFn<K, V, Promise<void>>): Promise<void>;
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