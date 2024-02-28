import { purry } from "remeda";
import { isArray, isSet, type ArrFn, type ArrLike } from "..";

export function flatMap<V, O>(fn: ArrFn<V, O[]>): (obj: ArrLike<V>) => O[];
export function flatMap<V, O>(set: Set<V>, fn: ArrFn<V, O[]>): O[];
export function flatMap<T, O>(arr: T[], fn: ArrFn<T, O[]>): O[];
export function flatMap() {
  return purry(_flatMap, arguments);
}

function _flatMap<V, O>(collection: ArrLike<V>, fn: ArrFn<V, O[]>): O[] {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    const result = [];
    for (const item of collection) {
      result.push(...fn(item, i));
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function flatMapAsync<V, O>(fn: ArrFn<V, Promise<O[]>>): (obj: ArrLike<V>) => Promise<O[]>;
export function flatMapAsync<V, O>(set: Set<V>, fn: ArrFn<V, Promise<O[]>>): Promise<O[]>;
export function flatMapAsync<T, O>(arr: T[], fn: ArrFn<T, Promise<O[]>>): Promise<O[]>;
export function flatMapAsync() {
  return purry(_flatMapAsync, arguments);
}

async function _flatMapAsync<V, O>(collection: ArrLike<V>, fn: ArrFn<V, Promise<O[]>>): Promise<O[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    const result = [];
    for (const item of collection) {
      result.push(...await fn(item, i));
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

