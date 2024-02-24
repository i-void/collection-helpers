/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function filter<T>(set: Set<T>, fn: (item: T, index: number) => boolean): Set<T>;
export function filter<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): Map<K, V>;
export function filter<T>(arr: T[], fn: (item: T, index: number) => boolean): T[];
export function filter<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): Record<K, V>;


export function filter(collection: unknown, fn: (arg0: any, arg1: number) => boolean): unknown {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      if (fn(item, index)) {
        result.push(item);
      }
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = new Map();
    for (const [key, value] of collection) {
      if (fn({ key, value }, index)) {
        result.set(key, value);
      }
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result: any = {};
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (fn({ key, value }, index)) {
        result[key] = value;
      }
      index++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

// curried version
export function cFilter<T>(fn: (item: T, index: number) => boolean): (set: Set<T>) => Set<T>;
export function cFilter<K, V>(fn: (entry: { key: K, value: V }, index: number) => boolean): (map: Map<K, V>) => Map<K, V>;
export function cFilter<T>(fn: (item: T, index: number) => boolean): (arr: T[]) => T[];
export function cFilter<K extends string | number | symbol, V>(fn: (entry: { key: K, value: V }, index: number) => boolean): (obj: Record<K, V>) => Record<K, V>;

export function cFilter(fn: any): any {
  return (collection: any) => filter(collection, fn);
}