import { isArray, isMap, isRecord, isSet } from ".";

export function flatMapAsync<I, O>(set: Set<I>, fn: (item: I, index: number) => Promise<O[]>): Promise<O[]>;
export function flatMapAsync<K, V, O>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<O[]>): Promise<O[]>;
export function flatMapAsync<T, O>(arr: T[], fn: (item: T, index: number) => Promise<O[]>): Promise<O[]>;
export function flatMapAsync<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<O[]>): Promise<O[]>;

export async function flatMapAsync(collection: unknown, fn: Function): Promise<unknown> {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      result.push(...await fn(item, index));
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of collection) {
      result.push(...await fn({ key, value }, index));
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      result.push(...await fn({ key, value }, index));
      index++;
    }
    return result;
  }
}