import { isArray, isMap, isRecord, isSet } from ".";

export function all<T>(set: Set<T>, fn: (item: T, index: number) => boolean): boolean;
export function all<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): boolean;
export function all<T>(arr: T[], fn: (item: T, index: number) => boolean): boolean;
export function all<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => boolean): boolean;

export function all(collection: unknown, fn: Function): boolean {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    for (const item of collection) {
      if (!fn(item, index)) return false;
      index++;
    }
    return true;
  } else if (isMap(collection)) {
    let index = 0;
    for (const [key, value] of collection) {
      if (!fn({ key, value }, index)) return false;
      index++;
    }
    return true;
  } else if (isRecord(collection)) {
    let index = 0;
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (!fn({ key, value }, index)) return false;
      index++;
    }
    return true;
  } else {
    throw new Error('Invalid collection');
  }
}

// curried version
export function cAll<T>(fn: (item: T, index: number) => boolean): (set: Set<T>) => boolean;
export function cAll<K, V>(fn: (entry: { key: K, value: V }, index: number) => boolean): (map: Map<K, V>) => boolean;
export function cAll<T>(fn: (item: T, index: number) => boolean): (arr: T[]) => boolean;
export function cAll<K extends string | number | symbol, V>(fn: (entry: { key: K, value: V }, index: number) => boolean): (obj: Record<K, V>) => boolean;

export function cAll(fn: any) {
  return (collection: any) => all(collection, fn);
}