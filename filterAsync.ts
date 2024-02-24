/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function filterAsync<T>(set: Set<T>, fn: (item: T, index: number) => Promise<boolean>): Promise<Set<T>>;
export function filterAsync<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): Promise<Map<K, V>>;
export function filterAsync<T>(arr: T[], fn: (item: T, index: number) => Promise<boolean>): Promise<T[]>;
export function filterAsync<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): Promise<Record<K, V>>;

export async function filterAsync(collection: unknown, fn: (arg0: any, arg1: number) => Promise<boolean>): Promise<unknown> {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      if (await fn(item, index)) {
        result.push(item);
      }
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = new Map();
    for (const [key, value] of collection) {
      if (await fn({ key, value }, index)) {
        result.set(key, value);
      }
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result: any = {};
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (await fn({ key, value }, index)) {
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
export function cFilterAsync<T>(fn: (item: T, index: number) => Promise<boolean>): (set: Set<T>) => Promise<Set<T>>;
export function cFilterAsync<K, V>(fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): (map: Map<K, V>) => Promise<Map<K, V>>;
export function cFilterAsync<T>(fn: (item: T, index: number) => Promise<boolean>): (arr: T[]) => Promise<T[]>;
export function cFilterAsync<K extends string | number | symbol, V>(fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): (obj: Record<K, V>) => Promise<Record<K, V>>;
export function cFilterAsync(fn: any): any {
  return (collection: any) => filterAsync(collection, fn);
}