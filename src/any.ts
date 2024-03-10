import { purry, isArray } from "remeda";
import { type ArrCondFn, type ArrLike, isSet, type RecKey, type MapCondFn, isMap, isRecord, type ArrAsyncCondFn, type MapAsyncCondFn, type Collection, type CollectionFn } from ".";

export function any<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => boolean;
export function any<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function any<T>(arr: ArrLike<T>, fn: ArrCondFn<T>): boolean;
export function any<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function any<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function any() {
  return purry(_any, arguments);
}

function _any<T extends Collection, F extends CollectionFn<T>>(collection: T, fn: F): boolean {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (fn(item, i)) return true;
      i++;
    }
    return false;
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      if (fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      if (fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function anyAsync<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => Promise<boolean>;
export function anyAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function anyAsync<T>(arr: ArrLike<T>, fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function anyAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function anyAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function anyAsync() {
  return purry(_anyAsync, arguments);
}

async function _anyAsync<T extends Collection, F extends CollectionFn<T>>(collection: T, fn: F): Promise<boolean> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    for (const item of collection) {
      if (await fn(item, i)) return true;
      i++;
    }
    return false;
  } else if (isMap(collection)) {
    let i = 0;
    for (const [key, value] of collection) {
      if (await fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else if (isRecord(collection)) {
    let i = 0;
    for (const [key, value] of Object.entries(collection)) {
      if (await fn({ key, value }, i)) return true;
      i++;
    }
    return false;
  } else {
    throw new Error('Unsupported collection type');
  }
}