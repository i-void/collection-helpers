import {
  isArray, isMap, isRecord, isSet, type ArrLike, type RecKey, type ArrCondFn, type MapCondFn
} from ".";
import { purry, reject as rReject } from "remeda";

export function reject<V, O>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => O;
export function reject<I>(set: Set<I>, fn: ArrCondFn<I>): Set<I>;
export function reject<T>(arr: T[], fn: ArrCondFn<T>): T[];
export function reject() {
  return purry(_reject, arguments);
}

function _reject<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): V[] | Set<V> {
  if (isArray(collection)) {
    return rReject.indexed(collection, fn);
  } else if (isSet(collection)) {
    return new Set(rReject.indexed(Array.from(collection), fn));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function rejectObj<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Record<K, V>;
export function rejectObj<K, V>(fn: MapCondFn<K, V>): (map: Map<K, V>) => Map<K, V>;
export function rejectObj<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Map<K, V>;
export function rejectObj<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Record<K, V>;
export function rejectObj() {
  return purry(_rejectObj, arguments);
}

function _rejectObj<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): Record<K, V> | Map<K, V> {
  if (isMap(mapLike)) {
    return new Map(rReject.indexed(Array.from(mapLike), ([key, value], i) => fn({ key, value }, i)));
  } else if (isRecord(mapLike)) {
    const arr = Object.entries(mapLike) as [K, V][];
    const newArr = rReject.indexed(arr, ([key, value], i) => fn({ key, value }, i)) as [K, V][]
    return Object.fromEntries(newArr) as Record<K, V>;
} else {
    throw new Error('Unsupported collection type');
  }
}


export function rejectAsync<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => Promise<V[]>;
export function rejectAsync<I>(set: Set<I>, fn: ArrCondFn<I>): Promise<I[]>;
export function rejectAsync<T>(arr: T[], fn: ArrCondFn<T>): Promise<T[]>;
export function rejectAsync() {
  return purry(_rejectAsync, arguments);
}

async function _rejectAsync<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): Promise<V[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    const result = [];
    for (const item of collection) {
      if (!fn(item, i)) {
        result.push(item);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function rejectObjAsync<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Promise<Record<K, V>>;
export function rejectObjAsync<K, V>(fn: MapCondFn<K, V>): (map: Map<K, V>) => Promise<Map<K, V>>;
export function rejectObjAsync<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Promise<Map<K, V>>;
export function rejectObjAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Promise<Record<K, V>>;
export function rejectObjAsync() {
  return purry(_rejectObjAsync, arguments);
}

async function _rejectObjAsync<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): Promise<Record<K, V> | Map<K, V>> {
  if (isMap(mapLike)) {
    let i = 0;
    const result = new Map();
    for (const [key, value] of mapLike) {
      if (!fn({ key, value }, i)) {
        result.set(key, value);
      }
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    let i = 0;
    const result: any = {};
    for (const ml of Object.entries((mapLike as Record<string, unknown>))) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (!fn({ key, value }, i)) {
        result[key] = value;
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}