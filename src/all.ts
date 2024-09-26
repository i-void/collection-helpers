import { purry, isArray } from "remeda";
import { type ArrCondFn, isSet, type RecKey, type MapCondFn, isMap, isRecord, type ArrAsyncCondFn, type MapAsyncCondFn, type Collection, type CollectionFn, type CollectionAsyncFn } from ".";

export function all<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => boolean;
export function all<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function all<T>(arr: Array<T>, fn: ArrCondFn<T>): boolean;
export function all<T>(arr: ReadonlyArray<T>, fn: ArrCondFn<T>): boolean;
export function all<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function all<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function all() {
  return purry(_all, arguments);
}

function _all<T extends Collection, F extends CollectionFn<T>>(collection: T, fn: F): boolean {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (!fn(item, i)) return false;
      i++;
    }
    return true;
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      if (!fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      if (!fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function allAsync<T extends Collection, F extends CollectionAsyncFn<T>>(fn: F): (collection: T) => Promise<boolean>;
export function allAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function allAsync<T>(arr: Array<T>, fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function allAsync<T>(arr: ReadonlyArray<T>, fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function allAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function allAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function allAsync() {
  return purry(_allAsync, arguments);
}

async function _allAsync<T extends Collection, F extends CollectionAsyncFn<T>>(collection: T, fn: F): Promise<boolean> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (!await fn(item, i)) return false;
      i++;
    }
    return true;
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      if (!await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      if (!await fn({ key, value }, i)) return false;
      i++;
    }
    return true;
  } else {
    throw new Error('Unsupported collection type');
  }
}