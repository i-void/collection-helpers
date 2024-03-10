import { purry } from "remeda";
import { isArray, isSet, type ArrFn, type ArrLike, type InferArrFn, type UnboxArrLike, type ArrAsyncFn } from ".";

export function flatMap<T extends ArrLike<any>, F extends ArrFn<V, any[]>, V extends UnboxArrLike<T>, O extends ReturnType<InferArrFn<F>>>(fn: F): (arrLike: T) => O; 
export function flatMap<V, O>(set: Set<V>, fn: ArrFn<V, O[]>): O[];
export function flatMap<T, O>(arr: Array<T>, fn: ArrFn<T, O[]>): O[];
export function flatMap<T, O>(arr: ReadonlyArray<T>, fn: ArrFn<T, O[]>): O[];
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


export function flatMapAsync<T extends ArrLike<any>, F extends ArrAsyncFn<V, any[]>, V extends UnboxArrLike<T>, O extends ReturnType<InferArrFn<F>>>(fn: F): (arrLike: T) => Promise<O>; 
export function flatMapAsync<V, O>(set: Set<V>, fn: ArrAsyncFn<V, Promise<O[]>>): Promise<O[]>;
export function flatMapAsync<V, O>(arr: Array<V>, fn: ArrAsyncFn<V, Promise<O[]>>): Promise<O[]>;
export function flatMapAsync<T, O>(arr: ReadonlyArray<T>, fn: ArrAsyncFn<T, Promise<O[]>>): Promise<O[]>;
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

