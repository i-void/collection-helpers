import { purry, isArray } from "remeda";
import { type ArrCondFn, type ArrLike, isSet, type RecKey, type MapCondFn, isMap, isRecord, type ArrAsyncCondFn, type MapAsyncCondFn } from "..";

export function any<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => boolean;
export function any<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function any<T>(arr: T[], fn: ArrCondFn<T>): boolean;
export function any() {
  return purry(_any, arguments);
}

function _any<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): boolean {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (fn(item, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function anyObj<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => boolean;
export function anyObj<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function anyObj<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function anyObj() {
  return purry(_anyObj, arguments);
}

function _anyObj<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): boolean {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function anyAsync<V>(fn: ArrAsyncCondFn<V>): (obj: ArrLike<V>) => Promise<boolean>;
export function anyAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function anyAsync<T>(arr: T[], fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function anyAsync() {
  return purry(_anyAsync, arguments);
}

async function _anyAsync<V>(collection: ArrLike<V>, fn: ArrAsyncCondFn<V>): Promise<boolean> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (await fn(item, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function anyObjAsync<K extends RecKey, V>(fn: MapAsyncCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Promise<boolean>;
export function anyObjAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function anyObjAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function anyObjAsync() {
  return purry(_anyObjAsync, arguments);
}

async function _anyObjAsync<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean> {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (await fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (await fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}

