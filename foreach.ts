/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function forEach<T>(set: Set<T>, fn: (item: T, index: number) => void): void;
export function forEach<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => void): void;
export function forEach<T>(arr: T[], fn: (item: T, index: number) => void): void;
export function forEach<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => void): void;

export function forEach(collection: unknown, fn: (arg0: any, arg1: number) => void): void {
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      fn(item, index);
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      fn({ key, value }, index);
      index++;
    }
  } else if (isRecord(collection)) {
    for (const [key, value] of Object.entries(collection as Record<string, unknown>)) {
      fn({ key, value }, index);
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}
