import { isArray, isMap, isRecord, isSet } from ".";

export function map<I, O>(set: Set<I>, fn: (item: I, index: number) => O): O[];
export function map<K, V, O>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => O): O[];
export function map<T, O>(arr: T[], fn: (item: T, index: number) => O): O[];
export function map<K extends string | number | symbol, V, O>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => O): O[];

export function map(collection: unknown, fn: Function): unknown {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      result.push(fn(item, index));
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of collection) {
      result.push(fn({ key, value }, index));
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result = [];
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      result.push(fn({ key, value }, index));
      index++;
    }
    return result;
  }
}

// curried version
export function cMap<I, O>(fn: (item: I, index: number) => O): (set: Set<I>) => O[];
export function cMap<K, V, O>(fn: (entry: { key: K, value: V }, index: number) => O): (map: Map<K, V>) => O[];
export function cMap<T, O>(fn: (item: T, index: number) => O): (arr: T[]) => O[];
export function cMap<K extends string | number | symbol, V, O>(fn: (entry: { key: K, value: V }, index: number) => O): (obj: Record<K, V>) => O[];

export function cMap(fn: any) {
  return (collection: any) => map(collection, fn);
}