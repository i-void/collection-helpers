import { isArray, isMap, isRecord, isSet } from '.'

export function sort<T>(set: Set<T>, fn: (a: T, b: T) => number): Set<T>
export function sort<K, V>(map: Map<K, V>, fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number): Map<K, V>
export function sort<T>(array: T[], fn: (a: T, b: T) => number): T[]
export function sort<K extends string | number | symbol, V>(obj: Record<K, V>, fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number): Record<K, V>

export function sort<T>(collection: Set<T> | Map<any, T> | T[] | Record<any, T>, fn: (a: any, b: any) => number): Set<T> | Map<any, T> | T[] | Record<any, T> {
  if (isArray(collection)) {
    return [...collection].sort(fn)
  } else if (isSet(collection)) {
    return new Set([...collection].sort(fn))
  } else if (isMap(collection)) {
    return new Map([...collection].sort(fn))
  } else if (isRecord(collection)) {
    return Object.fromEntries(Object.entries(collection).sort(fn))
  }
  throw new Error('Invalid collection type')
}

// curried version
export function cSort<T>(fn: (a: T, b: T) => number): (set: Set<T>) => Set<T>
export function cSort<K, V>(fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number): (map: Map<K, V>) => Map<K, V>
export function cSort<T>(fn: (a: T, b: T) => number): (array: T[]) => T[]
export function cSort<K extends string | number | symbol, V>(fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number): (obj: Record<K, V>) => Record<K, V>

export function cSort<T>(fn: (a: any, b: any) => number): any {
  return (collection: any) => sort(collection, fn)
}