import { purry, isArray } from "remeda";
import { type ArrCondFn, type ArrLike, isSet, type RecKey, type MapCondFn, isMap, isRecord } from "..";

export function select<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => V[];
export function select<V>(set: Set<V>, fn: ArrCondFn<V>): Set<V>;
export function select<T>(arr: T[], fn: ArrCondFn<T>): T[];
export function select() {
  return purry(_select, arguments);
}

function _select<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): V[] | Set<V> {
  if (isArray(collection)) {
    return collection.filter(fn);
  } else if (isSet(collection)) {
    return new Set(Array.from(collection).filter(fn));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function selectObj<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Record<K, V>;
export function selectObj<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Map<K, V>;
export function selectObj<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Record<K, V>;
export function selectObj() {
  return purry(_selectObj, arguments);
}

function _selectObj<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): Record<K, V> | Map<K, V> {
  if (isMap(mapLike)) {
    return new Map(Array.from(mapLike).filter(([key, value], i) => fn({ key, value }, i)));
  } else if (isRecord(mapLike)) {
    const arr = Object.entries(mapLike) as [K, V][];
    const newArr = arr.filter(([key, value], i) => fn({ key, value }, i)) as [K, V][]
    return Object.fromEntries(newArr) as Record<K, V>;
} else {
    throw new Error('Unsupported collection type');
  }
}


export function selectAsync<V>(fn: ArrCondFn<V>): (obj: ArrLike<V>) => Promise<V[]>;
export function selectAsync<I>(set: Set<I>, fn: ArrCondFn<I>): Promise<I[]>;
export function selectAsync<T>(arr: T[], fn: ArrCondFn<T>): Promise<T[]>;
export function selectAsync() {
  return purry(_selectAsync, arguments);
}

async function _selectAsync<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): Promise<V[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    const result = [];
    for (const item of collection) {
      if (fn(item, i)) {
        result.push(item);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function selectObjAsync<K extends RecKey, V>(fn: MapCondFn<K, V>): (obj: Record<K, V> | Map<K, V>) => Promise<Record<K, V>>;
export function selectObjAsync<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): Promise<Map<K, V>>;
export function selectObjAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): Promise<Record<K, V>>;
export function selectObjAsync() {
  return purry(_selectObjAsync, arguments);
}

async function _selectObjAsync<K extends RecKey, V>(mapLike: Record<K, V> | Map<K, V>, fn: MapCondFn<K, V>): Promise<Record<K, V> | Map<K, V>> {
  if (isMap(mapLike)) {
    let i = 0;
    const result = new Map();
    for (const [key, value] of mapLike) {
      if (fn({ key, value }, i)) {
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
      if (fn({ key, value }, i)) {
        result[key] = value;
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

