import { isArray, isMap, isRecord, isSet } from ".";

export function flatMap<I, O>(set: Set<I>, fn: (item: I, index: number) => O[]): O[];
export function flatMap<K, V, O>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => O[]): O[];
export function flatMap<T, O>(arr: T[], fn: (item: T, index: number) => O[]): O[];
export function flatMap<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => O[]): O[];

export function flatMap(collection: unknown, fn: Function): unknown {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      result.push(...fn(item, index));
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of collection) {
      result.push(...fn({ key, value }, index));
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      result.push(...fn({ key, value }, index));
      index++;
    }
    return result;
  }
}