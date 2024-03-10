import {
  isArray, isMap, isRecord, isSet,
  type ArrAccFn, type RecKey, type MapAccFn,
  type ArrAsyncAccFn, type MapAsyncAccFn, type ArrCondFn, type MapCondFn, type Collection, type CollectionReduceFn, type CollectionAsyncReduceFn, type CollectionCondFn, type CollectionAsyncCondFn, type ArrAsyncCondFn, type MapAsyncCondFn
} from ".";
import { purry, reduce as rReduce } from "remeda";

export function reduce<T extends Collection, R, F extends CollectionReduceFn<T, R>>(fn: F, initial: R): (collection: T) => R;
export function reduce<V, R>(set: Set<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduce<V, R>(arr: Array<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduce<V, R>(arr: ReadonlyArray<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduce<K, V, R>(map: Map<K, V>, fn: MapAccFn<K, V, R>, initial: R): R;
export function reduce<K extends RecKey, V, R>(obj: Record<K, V>, fn: MapAccFn<K, V, R>, initial: R): R;
export function reduce() {
  return purry(_reduce, arguments);
}

function _reduce<T extends Collection, R, F extends CollectionReduceFn<T, R>>(collection: T, fn: F, initial: R): R {
  let accumulator: R = initial;
  if (isArray(collection)) {
    return rReduce.indexed(collection, fn, accumulator);
  } else if (isSet(collection)) {
    return Array.from(collection).reduce(fn, accumulator);
  } else if (isMap(collection)) {
    return Array.from(collection).reduce((acc, [key, value], i) => fn(acc, { key, value }, i), accumulator);
  } else if (isRecord(collection)) {
    return Object.entries(collection).reduce((acc, [key, value], i) => fn(acc, { key, value }, i), accumulator);
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function reduceAsync<T extends Collection, R, F extends CollectionAsyncReduceFn<T, R>>(fn: F, initial: R): (collection: T) => Promise<R>;
export function reduceAsync<V, R>(set: Set<V>, fn: ArrAsyncAccFn<V, R>, initial: R): Promise<R>;
export function reduceAsync<V, R>(arr: Array<V>, fn: ArrAsyncAccFn<V, R>, initial: R): Promise<R>;
export function reduceAsync<V, R>(arr: ReadonlyArray<V>, fn: ArrAsyncAccFn<V, R>, initial: R): Promise<R>;
export function reduceAsync<K, V, R>(map: Map<K, V>, fn: MapAsyncAccFn<K, V, R>, initial: R): Promise<R>;
export function reduceAsync<K extends RecKey, V, R>(obj: Record<K, V>, fn: MapAsyncAccFn<K, V, R>, initial: R): Promise<R>;
export function reduceAsync() {
  return purry(_reduceAsync, arguments);
}

async function _reduceAsync<T extends Collection, R, F extends CollectionAsyncReduceFn<T, R>>(collection: T, fn: F, initial: R): Promise<R> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: R = initial
    for (const item of collection) {
      result = await fn(result, item, i);
      i++;
    }
    return result;
  } else if (isRecord(collection)) {
    let i = 0;
    let result: R = initial
    for (const [key, value] of Object.entries(collection)) {
      result = await fn(result, { key, value }, i);
      i++;
    }
    return result;
  } else if (isMap(collection)) {
    let i = 0;
    let result: R = initial
    for (const [key, value] of collection) {
      result = await fn(result, { key, value }, i);
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceWhen<T extends Collection, R, C extends CollectionCondFn<T>, F extends CollectionReduceFn<T, R>>(condFn: C, fn: F, initial: R): (collection: T) => R;
export function reduceWhen<V, R>(set: Set<V>, condFn: ArrCondFn<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduceWhen<V, R>(arr: Array<V>, condFn: ArrCondFn<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduceWhen<V, R>(arr: ReadonlyArray<V>, condFn: ArrCondFn<V>, fn: ArrAccFn<V, R>, initial: R): R;
export function reduceWhen<K, V, R>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, R>, initial: R): R;
export function reduceWhen<K extends RecKey, V, R>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, R>, initial: R): R;
export function reduceWhen() {
  return purry(_reduceWhen, arguments);
}

function _reduceWhen<T extends Collection, R, C extends CollectionCondFn<T>, F extends CollectionReduceFn<T, R>>(collection: T, condFn: C, fn: F, initial: R): R {
  let accumulator: R = initial;
  if (isArray(collection)) {
    return rReduce.indexed(collection, (acc, value, i) => condFn(value, i) ? fn(acc, value, i) : acc, accumulator);
  } else if (isSet(collection)) {
    return Array.from(collection).reduce((acc, value, i) => condFn(value, i) ? fn(acc, value, i) : acc, accumulator);
  } else if (isMap(collection)) {
    return Array.from(collection).reduce((acc, [key, value], i) => condFn({ key, value }, i) ? fn(acc, { key, value }, i) : acc, accumulator);
  } else if (isRecord(collection)) {
    return Object.entries(collection).reduce((acc, [key, value], i) => condFn({ key, value }, i) ? fn(acc, { key, value }, i) : acc, accumulator);
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceWhenAsync<T extends Collection, R, C extends CollectionAsyncCondFn<T>, F extends CollectionAsyncReduceFn<T, R>>(condFn: C, fn: F, initial: R): (collection: T) => Promise<R>;
export function reduceWhenAsync<V, R>(set: Set<V>, condFn: ArrAsyncCondFn<V>, fn: ArrAsyncAccFn<V, R>, initial: R): Promise<R>;
export function reduceWhenAsync<V, R>(arr: V[], condFn: ArrAsyncCondFn<V>, fn: ArrAsyncAccFn<V, R>, initial: R): Promise<R>;
export function reduceWhenAsync<K, V, R>(map: Map<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapAsyncAccFn<K, V, R>, initial: R): Promise<R>;
export function reduceWhenAsync<K extends RecKey, V, R>(obj: Record<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapAsyncAccFn<K, V, R>, initial: R): Promise<R>;
export function reduceWhenAsync() {
  return purry(_reduceWhenAsync, arguments);
}

async function _reduceWhenAsync<T extends Collection, R, C extends CollectionAsyncCondFn<T>, F extends CollectionAsyncReduceFn<T, R>>(collection: T, condFn: C, fn: F, initial: R): Promise<R> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: R = initial
    for (const item of collection) {
      if (await condFn(item, i)) {
        result = await fn(result, item, i);
      }
      i++;
    }
    return result;
  } else if (isRecord(collection)) {
    let i = 0;
    let result: R = initial
    for (const [key, value] of Object.entries(collection)) {
      if (await condFn({ key, value }, i)) {
        result = await fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else if (isMap(collection)) {
    let i = 0;
    let result: R = initial
    for (const [key, value] of collection) {
      if (await condFn({ key, value }, i)) {
        result = await fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}