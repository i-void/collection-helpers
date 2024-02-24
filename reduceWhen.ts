/* eslint-disable @typescript-eslint/no-explicit-any */

import { isArray, isMap, isRecord, isSet } from ".";

export function reduceWhen<I, O>(set: Set<I>, cond: (item: I, index: number) => boolean, fn: (accumulator: O, item: I, index: number) => O, initialValue: O): O;
export function reduceWhen<K, V, O>(map: Map<K, V>, cond: (entry: { key: K, value: V }, index: number) => boolean, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O, initialValue: O): O;
export function reduceWhen<I, O>(arr: I[], cond: (item: I, index: number) => boolean, fn: (accumulator: O, item: I, index: number) => O, initialValue: O): O;
export function reduceWhen<K extends string | number | symbol, V, O>(obj: Record<K, V>, cond: (entry: { key: K, value: V }, index: number) => boolean, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O, initialValue: O): O;

export function reduceWhen(collection: unknown, cond: (arg0: any, arg1: number) => boolean, fn: Function, initialValue: unknown): unknown {
  let accumulator = initialValue;
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      if (cond(item, index)) {
        accumulator = fn(accumulator, item, index);
      }
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      if (cond({ key, value }, index)) {
        accumulator = fn(accumulator, { key, value }, index);
      }
      index++;
    }
  } else if (isRecord(collection)) {
    for (const [key, value] of Object.entries(collection as Record<string, unknown>)) {
      if (cond({ key, value }, index)) {
        accumulator = fn(accumulator, { key, value }, index);
      }
      index++;
    }
  } else {
    console.log({ err: collection })
    throw new Error('Unsupported collection type');
  }

  return accumulator;
}