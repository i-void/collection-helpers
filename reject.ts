/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function reject<T>(set: Set<T>, fn: (item: T, index: number) => boolean): Set<T>;
export function reject<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): Map<K, V>;
export function reject<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): Record<K, V>;
export function reject<T>(arr: T[], fn: (item: T, index: number) => boolean): T[];

export function reject(collection: unknown, fn: (arg0: any, arg1: number) => boolean): unknown {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      if (!fn(item, index)) {
        result.push(item);
      }
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = new Map();
    for (const [key, value] of collection) {
      if (!fn({ key, value }, index)) {
        result.set(key, value);
      }
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result: any = {};
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (!fn({ key, value }, index)) {
        result[key] = value;
      }
      index++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}