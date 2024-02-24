/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export async function forEachAsync<T>(set: Set<T>, fn: (item: T, index: number) => Promise<void>): Promise<void>;
export async function forEachAsync<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<void>): Promise<void>;
export async function forEachAsync<T>(arr: T[], fn: (item: T, index: number) => Promise<void>): Promise<void>;
export async function forEachAsync<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<void>): Promise<void>;

export async function forEachAsync(collection: unknown, fn: (arg0: any, arg1: number) => Promise<void>): Promise<void> {
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      await fn(item, index);
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      await fn({ key, value }, index);
      index++;
    }
  } else if (isRecord(collection)) {
    for (const [key, value] of Object.entries(collection as Record<string, unknown>)) {
      await fn({ key, value }, index);
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}