import { purry, isArray } from "remeda";
import { type ArrCondFn, type ArrLike, isSet, type RecKey, type MapCondFn, isMap, isRecord, type ArrAsyncCondFn, type MapAsyncCondFn } from "..";

export function all<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => boolean;
export function all<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function all<T>(arr: T[], fn: ArrCondFn<T>): boolean;
export function all() {
  return purry(_all, arguments);
}

function _all<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): boolean {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (!fn(item, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function allObj<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => boolean;
export function allObj<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function allObj<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function allObj() {
  return purry(_allObj, arguments);
}

function _allObj<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): boolean {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (!fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (!fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function allAsync<V>(fn: ArrAsyncCondFn<V>): (obj: ArrLike<V>) => Promise<boolean>;
export function allAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function allAsync<T>(arr: T[], fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function allAsync() {
  return purry(_allAsync, arguments);
}

async function _allAsync<V>(collection: ArrLike<V>, fn: ArrAsyncCondFn<V>): Promise<boolean> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (!await fn(item, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function allObjAsync<K extends RecKey, V>(fn: MapAsyncCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Promise<boolean>;
export function allObjAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function allObjAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function allObjAsync() {
  return purry(_allObjAsync, arguments);
}

async function _allObjAsync<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean> {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (!await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (!await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}

