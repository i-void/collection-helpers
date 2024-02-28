import { purry, isArray } from "remeda";
import { type ArrCondFn, type ArrLike, isSet, type RecKey, type MapCondFn, isMap, isRecord, type ArrAsyncCondFn, type MapAsyncCondFn } from "..";

export function none<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => boolean;
export function none<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function none<T>(arr: T[], fn: ArrCondFn<T>): boolean;
export function none() {
  return purry(_none, arguments);
}

function _none<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): boolean {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (fn(item, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function noneObj<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => boolean;
export function noneObj<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function noneObj<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function noneObj() {
  return purry(_noneObj, arguments);
}

function _noneObj<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): boolean {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function noneAsync<V>(fn: ArrAsyncCondFn<V>): (obj: ArrLike<V>) => Promise<boolean>;
export function noneAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function noneAsync<T>(arr: T[], fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function noneAsync() {
  return purry(_noneAsync, arguments);
}

async function _noneAsync<V>(collection: ArrLike<V>, fn: ArrAsyncCondFn<V>): Promise<boolean> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (await fn(item, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function noneObjAsync<K extends RecKey, V>(fn: MapAsyncCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Promise<boolean>;
export function noneObjAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function noneObjAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function noneObjAsync() {
  return purry(_noneObjAsync, arguments);
}

async function _noneObjAsync<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean> {
  if (isMap(mapLike)) {
    let i = 0;
    for (const [key, value] of mapLike) {
      if (await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(mapLike)) {
    let i = 0;
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}

