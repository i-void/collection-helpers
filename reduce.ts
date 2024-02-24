import { isArray, isMap, isRecord, isSet } from ".";

export function reduce<I, O>(set: Set<I>, fn: (accumulator: O, item: I, index: number) => O, initialValue: O): O;
export function reduce<K, V, O>(map: Map<K, V>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O, initialValue: O): O;
export function reduce<I, O>(arr: I[], fn: (accumulator: O, item: I, index: number) => O, initialValue: O): O;
export function reduce<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O, initialValue: O): O;

export function reduce(collection: unknown, fn: Function, initialValue: unknown): unknown {
  let accumulator = initialValue;
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      accumulator = fn(accumulator, item, index);
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      accumulator = fn(accumulator, { key, value }, index);
      index++;
    }
  } else if (isRecord(collection)) {
    for (const entry of Object.entries((collection as Record<string, unknown>))) {
      accumulator = fn(accumulator, { key: entry[0], value: entry[1] }, index);
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }

  return accumulator;
}