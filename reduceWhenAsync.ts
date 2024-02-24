/* eslint-disable @typescript-eslint/no-explicit-any */

import { isArray, isMap, isRecord, isSet } from ".";

export async function reduceWhenAsync<I, O>(set: Set<I>, cond: (item: I, index: number) => Promise<boolean>, fn: (accumulator: O, item: I, index: number) => Promise<O>, initialValue: O): Promise<O>;
export async function reduceWhenAsync<K, V, O>(map: Map<K, V>, cond: (entry: { key: K, value: V }, index: number) => Promise<boolean>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => Promise<O>, initialValue: O): Promise<O>;
export async function reduceWhenAsync<K extends string | number | symbol, V, O>(obj: Record<K, V>, cond: (entry: { key: K, value: V }, index: number) => Promise<boolean>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => Promise<O>, initialValue: O): Promise<O>;
export async function reduceWhenAsync<I, O>(arr: I[], cond: (item: I, index: number) => Promise<boolean>, fn: (accumulator: O, item: I, index: number) => Promise<O>, initialValue: O): Promise<O>;

export async function reduceWhenAsync(collection: unknown, cond: (arg0: any, arg1: number) => Promise<boolean>, fn: Function, initialValue: unknown): Promise<unknown> {
  let accumulator = initialValue;
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      if (await cond(item, index)) {
        accumulator = await fn(accumulator, item, index);
      }
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      if (await cond({ key, value }, index)) {
        accumulator = await fn(accumulator, { key, value }, index);
      }
      index++;
    }
  } else if (isRecord(collection)) {
    for (const [key, value] of Object.entries(collection as Record<string, unknown>)) {
      if (await cond({ key, value }, index)) {
        accumulator = await fn(accumulator, { key, value }, index);
      }
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }

  return accumulator;
}