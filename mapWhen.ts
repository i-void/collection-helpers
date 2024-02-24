/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isMap, isRecord, isSet } from ".";

export function mapWhen<T>(set: Set<T>, cond: (item: T, index: number) => boolean, mapper: (item: T, index: number) => T): Set<T>;
export function mapWhen<K, V>(map: Map<K, V>, cond: (entry: { key: K, value: V }, index: number) => boolean, mapper: (entry: { key: K, value: V }, index: number) => { key: K, value: V }): Map<K, V>;
export function mapWhen<K extends string | number | symbol, V>(obj: Record<K, V>, cond: (entry: { key: K, value: V }, index: number) => boolean, mapper: (entry: { key: K, value: V }, index: number) => { key: K, value: V }): Record<K, V>;
export function mapWhen<T>(arr: T[], cond: (item: T, index: number) => boolean, mapper: (item: T, index: number) => T): T[];

export function mapWhen(collection: unknown, cond: (arg0: any, arg1: number) => boolean, mapper: (arg0: any, arg1: number) => any): unknown {
  if (isSet(collection) || isArray(collection)) {
    let index = 0;
    const result = [];
    for (const item of collection) {
      if (cond(item, index)) {
        result.push(mapper(item, index));
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
      if (cond({ key, value }, index)) {
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
      if (cond({ key, value }, index)) {
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