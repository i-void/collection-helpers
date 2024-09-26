import { purry, find as rFind } from "remeda";
import {
  isArray, isMap, isRecord, isSet,
  isUndefined,
  type ArrAsyncCondFn,
  type ArrCondFn,
  type ArrLike,
  type Collection,
  type CollectionAsyncCondFn,
  type CollectionCondFn,
  type MapAsyncCondFn,
  type MapCondFn, type RecKey
} from ".";

type InferReturnType<T> =
  T extends Map<infer K, infer V> ? Map<K, V> :
  T extends Set<infer K> ? K :
  T extends ReadonlyArray<infer K> ? K : 
  T extends Record<infer K, infer V> ? Partial<Record<K, V>> :
  T;

export function find<T extends Collection, F extends CollectionCondFn<T>>(fn: F): (collection: T) => InferReturnType<T> | undefined;
export function find<V, O>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => O;
export function find<I>(set: Set<I>, fn: ArrCondFn<I>): I | undefined;
export function find<T>(arr: T[], fn: ArrCondFn<T>): T | undefined;
export function find<T>(arr: readonly T[], fn: ArrCondFn<T>): T | undefined;
export function find<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Map<K, V> | undefined;
export function find<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Partial<Record<K, V>> | undefined;
export function find() {
  return purry(_find, arguments);
}

function _find<T extends Collection, F extends CollectionCondFn<T>>(collection: T, fn: F): T | undefined {
  if (isArray(collection)) {
    return rFind.indexed(collection, fn); 
  } else if (isSet(collection)) {
    return rFind.indexed(Array.from(collection), fn);
  } else if (isMap(collection)) {
    const found = rFind.indexed(Array.from(collection), ([key, value], i) => fn({ key, value }, i));
    if (isUndefined(found)) {
      return undefined;
    }
    return (found.length > 0 ? new Map([found]) : undefined) as T | undefined;
  } else if (isRecord(collection)) {
    const entries = Object.entries(collection);
    let i = 0;
    for (const [key, value] of entries) {
      if (fn({ key, value }, i)) {
        return { [key]: value } as T;
      }
      i++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function findAsync<T extends Collection, F extends CollectionAsyncCondFn<T>>(fn: F): (collection: T) => Promise<InferReturnType<T>>;
export function findAsync<I>(set: Set<I>, fn: ArrAsyncCondFn<I>): Promise<I | undefined>;
export function findAsync<T>(arr: T[], fn: ArrAsyncCondFn<T>): Promise<T | undefined>;
export function findAsync<T>(arr: readonly T[], fn: ArrAsyncCondFn<T>): Promise<T | undefined>;
export function findAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<Map<K, V> | undefined>;
export function findAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<Partial<Record<K, V>> | undefined>;
export function findAsync() {
  return purry(_findAsync, arguments);
}
async function _findAsync<T extends Collection, F extends CollectionAsyncCondFn<T>>(collection: T, fn: F): Promise<T | undefined> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const value of collection) {
      if ((await fn(value, i))) {
        return value;
      }
      i++;
    }
  } else if (isMap(collection)) {
    const entries = Array.from(collection);
    let i = 0;
    for (const [key, value] of entries) {
      if ((await fn({ key, value }, i))) {
        return new Map([[key, value]]) as T;
      }
      i++;
    }
  } else if (isRecord(collection)) {
    const entries = Object.entries(collection);
    let i = 0;
    for (const [key, value] of entries) {
      if ((await fn({ key, value }, i))) {
        return { [key]: value } as T;
      }
      i++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}