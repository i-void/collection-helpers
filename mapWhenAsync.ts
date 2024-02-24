/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function mapWhenAsync<T>(set: Set<T>, cond: (item: T, index: number) => Promise<boolean>, mapper: (item: T, index: number) => Promise<T>): Promise<Set<T>>;
export function mapWhenAsync<K, V>(map: Map<K, V>, cond: (entry: { key: K, value: V }, index: number) => Promise<boolean>, mapper: (entry: { key: K, value: V }, index: number) => Promise<{ key: K, value: V }>): Promise<Map<K, V>>;
export function mapWhenAsync<K extends string | number | symbol, V>(obj: Record<K, V>, cond: (entry: { key: K, value: V }, index: number) => Promise<boolean>, mapper: (entry: { key: K, value: V }, index: number) => Promise<{ key: K, value: V }>): Record<K, V>;
export function mapWhenAsync<T>(arr: T[], cond: (item: T, index: number) => Promise<boolean>, mapper: (item: T, index: number) => Promise<T>): Promise<T[]>;

export async function mapWhenAsync(collection: unknown, cond: (arg0: any, arg1: number) => Promise<boolean>, mapper: (arg0: any, arg1: number) => Promise<any>): Promise<unknown> {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      if (await cond(item, index)) {
        result.push(await mapper(item, index));
      } else {
        result.push(item);
      }
      index++;
    }
    return result;
  } else if (isMap(collection)) {
    let index = 0;
    const result = new Map();
    for (const [key, value] of collection) {
      if (await cond({ key, value }, index)) {
        result.set(key, value);
      } else {
        result.set(key, value);
      }
      index++;
    }
    return result;
  } else if (isRecord(collection)) {
    let index = 0;
    const result: any = {};
    for (const [key, value] of Object.entries((collection as Record<string, unknown>))) {
      if (await cond({ key, value }, index)) {
        result[key] = value;
      } else {
        result[key] = value;
      }
      index++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}