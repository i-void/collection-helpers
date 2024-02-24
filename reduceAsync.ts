import { isArray, isMap, isRecord, isSet } from ".";

export function reduceAsync<I, O>(set: Set<I>, fn: (accumulator: O, item: I, index: number) => O | Promise<O>, initialValue: O): Promise<O>;
export function reduceAsync<K, V, O>(map: Map<K, V>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O | Promise<O>, initialValue: O): Promise<O>;
export function reduceAsync<I, O>(arr: I[], fn: (accumulator: O, item: I, index: number) => O | Promise<O>, initialValue: O): Promise<O>;
export function reduceAsync<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (accumulator: O, entry: { key: K, value: V }, index: number) => O | Promise<O>, initialValue: O): Promise<O>;

export async function reduceAsync(collection: unknown, fn: Function, initialValue: unknown): Promise<unknown> {
  let accumulator = initialValue;
  let index = 0;

  if (isSet(collection) || isArray(collection)) {
    for (const item of collection) {
      accumulator = await fn(accumulator, item, index);
      index++;
    }
  } else if (isMap(collection)) {
    for (const [key, value] of collection) {
      accumulator = await fn(accumulator, { key, value }, index);
      index++;
    }
  } else if (isRecord(collection)) {
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      accumulator = await fn(accumulator, { key, value }, index);
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }

  return accumulator;
}