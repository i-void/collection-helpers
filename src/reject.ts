import {
  isArray, isMap, isRecord, isSet, type ArrLike, type ArrCondFn, type Collection, type CollectionCondFn, type CollectionAsyncCondFn, type ArrAsyncCondFn, type MapCondFn, type RecKey, type MapAsyncCondFn
} from ".";
import { purry, reject as rReject } from "remeda";

type InferReturnType<T> =
  T extends Map<infer K, infer V> ? Map<K, V> :
  T extends Set<infer K> ? Set<K> :
  T extends ReadonlyArray<infer K> ? Array<K> : 
  T extends Record<infer K, infer V> ? Partial<Record<K, V>> :
  T;

export function reject<T extends Collection, F extends CollectionCondFn<T>>(fn: F): (collection: T) => InferReturnType<T>;
export function reject<V, O>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => O;
export function reject<I>(set: Set<I>, fn: ArrCondFn<I>): Set<I>;
export function reject<T>(arr: T[], fn: ArrCondFn<T>): T[];
export function reject<T>(arr: readonly T[], fn: ArrCondFn<T>): readonly T[];
export function reject<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Map<K, V>;
export function reject<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Partial<Record<K, V>>;
export function reject() {
  return purry(_reject, arguments);
}

function _reject<T extends Collection, F extends CollectionCondFn<T>>(collection: T, fn: F): T {
  if (isArray(collection)) {
    return rReject.indexed(collection, fn) as T;
  } else if (isSet(collection)) {
    return new Set(rReject.indexed(Array.from(collection), fn)) as T;
  } else if (isMap(collection)) {
    return new Map(rReject.indexed(Array.from(collection), ([key, value], i) => fn({ key, value }, i))) as T;
  } else if (isRecord(collection)) {
    const entries = Object.entries(collection);
    const result = []
    let i = 0;
    for (const [key, value] of entries) {
      if (!fn({ key, value }, i)) {
        result.push([key, value]);
      }
      i++;
    }
    return Object.fromEntries(result);
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function rejectAsync<T extends Collection, F extends CollectionAsyncCondFn<T>>(fn: F): (collection: T) => Promise<InferReturnType<T>>
export function rejectAsync<V, O>(fn: ArrAsyncCondFn<V>): (obj: ArrLike<V>) => Promise<O>;
export function rejectAsync<I>(set: Set<I>, fn: ArrAsyncCondFn<I>): Promise<Set<I>>;
export function rejectAsync<T>(arr: T[], fn: ArrAsyncCondFn<T>): Promise<T[]>;
export function rejectAsync<T>(arr: readonly T[], fn: ArrAsyncCondFn<T>): Promise<T[]>;
export function rejectAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<Map<K, V>>;
export function rejectAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<Partial<Record<K, V>>>;
export function rejectAsync() {
  return purry(_rejectAsync, arguments);
}

async function _rejectAsync<T extends Collection, F extends CollectionAsyncCondFn<T>>(collection: T, fn: F): Promise<T> {
  if (isArray(collection) || isSet(collection)) {
    const result = []
    let i = 0;
    for (const value of collection) {
      if (!(await fn(value, i))) {
        result.push(value);
      }
      i++;
    }
    if (isSet(collection)) {
      return new Set(result) as T;
    }
    return result as T;
  } else if (isMap(collection)) {
    const entries = Array.from(collection);
    const result: Array<[any, any]> = []
    let i = 0;
    for (const [key, value] of entries) {
      if (!(await fn({ key, value }, i))) {
        result.push([key, value]);
      }
      i++;
    }
    return new Map(result) as T;
  } else if (isRecord(collection)) {
    const entries = Object.entries(collection);
    const result = []
    let i = 0;
    for (const [key, value] of entries) {
      if (!(await fn({ key, value }, i))) {
        result.push([key, value]);
      }
      i++;
    }
    return Object.fromEntries(result);
  } else {
    throw new Error('Unsupported collection type');
  }
}