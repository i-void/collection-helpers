import { purry } from 'remeda'
import { isArray, isSet } from '.'

export function sort<T>(fn: (a: T, b: T) => number): (coll: Set<T> | T[]) => Set<T>
export function sort<T>(set: Set<T>, fn: (a: T, b: T) => number): Set<T>
export function sort<T>(array: T[], fn: (a: T, b: T) => number): T[]
export function sort() {
  return purry(_sort, arguments)
}

export function _sort<T>(collection: Set<T> | Map<any, T> | T[] | Record<any, T>, fn: (a: any, b: any) => number): Set<T> | Map<any, T> | T[] | Record<any, T> {
  if (isArray(collection)) {
    return [...collection].sort(fn)
  } else if (isSet(collection)) {
    return new Set([...collection].sort(fn))
  }
  throw new Error('Invalid collection type')
}