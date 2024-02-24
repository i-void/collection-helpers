import { isArray, isMap, isRecord, isSet } from ".";

export function mapAsync<I, O>(set: Set<I>, fn: (item: I, index: number) => O | Promise<O>): Promise<O[]>;
export function mapAsync<K, V, O>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => O | Promise<O>): Promise<O[]>;
export function mapAsync<T, O>(arr: T[], fn: (item: T, index: number) => O | Promise<O>): Promise<O[]>;
export function mapAsync<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => O | Promise<O>): Promise<O[]>;

export async function mapAsync(collection: unknown, fn: Function): Promise<unknown> {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      result.push(await fn(item, index));
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of collection) {
      result.push(await fn({ key, value }, index));
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      result.push(await fn({ key, value }, index));
      index++;
    }
    return result;
  }
}

// curried version
export function cMapAsync<I, O>(fn: (item: I, index: number) => O | Promise<O>): (set: Set<I>) => Promise<O[]>;
export function cMapAsync<K, V, O>(fn: (entry: { key: K, value: V }, index: number) => O | Promise<O>): (map: Map<K, V>) => Promise<O[]>;
export function cMapAsync<T, O>(fn: (item: T, index: number) => O | Promise<O>): (arr: T[]) => Promise<O[]>;
export function cMapAsync<K extends string | number | symbol, V, O>(fn: (entry: { key: K, value: V }, index: number) => O | Promise<O>): (obj: Record<K, V>) => Promise<O[]>;

export function cMapAsync(fn: any) {
  return (collection: any) => mapAsync(collection, fn);
}