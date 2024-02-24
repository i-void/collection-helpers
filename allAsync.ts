import { isArray, isMap, isRecord, isSet } from ".";

export function allAsync<T>(set: Set<T>, fn: (item: T, index: number) => Promise<boolean>): Promise<boolean>;
export function allAsync<K, V>(map: Map<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): Promise<boolean>;
export function allAsync<T>(arr: T[], fn: (item: T, index: number) => Promise<boolean>): Promise<boolean>;
export function allAsync<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): Promise<boolean>;

export async function allAsync(collection: unknown, fn: Function): Promise<boolean> {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    for (const item of collection) {
      if (!await fn(item, index)) return false;
      index++;
    }
    return true;
  } else if (isMap(collection)) {
    let index = 0;
    for (const [key, value] of collection) {
      if (!await fn({ key, value }, index)) return false;
      index++;
    }
    return true;
  } else if (isRecord(collection)) {
    let index = 0;
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (!await fn({ key, value }, index)) return false;
      index++;
    }
    return true;
  } else {
    throw new Error('Invalid collection');
  }
}

// curried version
export function cAllAsync<T>(fn: (item: T, index: number) => Promise<boolean>): (set: Set<T>) => Promise<boolean>;
export function cAllAsync<K, V>(fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): (map: Map<K, V>) => Promise<boolean>;
export function cAllAsync<T>(fn: (item: T, index: number) => Promise<boolean>): (arr: T[]) => Promise<boolean>;
export function cAllAsync<K extends string | number | symbol, V>(fn: (entry: { key: K, value: V }, index: number) => Promise<boolean>): (obj: Record<K, V>) => Promise<boolean>;

export function cAllAsync(fn: any) {
  return (collection: any) => allAsync(collection, fn);
}