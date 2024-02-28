import {
  isArray, isMap, isRecord, isSet, 
  type ArrAccFn, type ArrLike, type RecKey, type MapAccFn, type ArrAsyncAccFn, type MapAsyncAccFn, type ArrCondFn, type MapCondFn
} from "..";
import { purry, reduce as rReduce, reject as rReject } from "remeda";

export function reduce<V, O>(fn: ArrAccFn<V, O>, initialValue: O): (obj: ArrLike<V>) => O;
export function reduce<I, O>(set: Set<I>, fn: ArrAccFn<I, O>, initialValue: O): O;
export function reduce<T, O>(arr: T[], fn: ArrAccFn<T, O>, initialValue: O): O;
export function reduce() {
  return purry(_reduce, arguments);
}

function _reduce<V, O>(collection: ArrLike<V>, fn: ArrAccFn<V, O>, initialValue: O): O {
  if (isArray(collection)) {
    return rReduce.indexed(collection, fn as ArrAccFn<V, O>, initialValue); 
  } else if (isSet(collection)) {
    return rReduce.indexed(Array.from(collection), fn as ArrAccFn<V, O>, initialValue); 
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceObj<K extends RecKey, V, O>(fn: MapAccFn<K, V, O>, initialValue: O): (obj: Record<K, V> | Map<K, V>) => O;
export function reduceObj<K, V, O>(fn: MapAccFn<K, V, O>, initialValue: O): (map: Map<K, V>) => O;
export function reduceObj<K, V, O>(map: Map<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O;
export function reduceObj<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O;
export function reduceObj() {
  return purry(_reduceObj, arguments);
}

function _reduceObj<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O {
  if (isMap(mapLike)) {
    return rReduce.indexed(
      Array.from(mapLike),
      (acc, [key, value], i) => (fn as MapAccFn<K, V, O>)(acc, { key, value }, i),
      initialValue
    );
  } else if (isRecord(mapLike)) {
    return rReduce.indexed(
      Object.entries(mapLike) as [K, V][],
      (acc, [key, value], i) => (fn as MapAccFn<K, V, O>)(acc, { key, value }, i),
      initialValue
    );
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceAsync<V, O>(fn: ArrAsyncAccFn<V, O>, initialValue: O): (obj: ArrLike<V>) => Promise<O>;
export function reduceAsync<I, O>(set: Set<I>, fn: ArrAsyncAccFn<I, O>, initialValue: O): Promise<O>;
export function reduceAsync<T, O>(arr: T[], fn: ArrAsyncAccFn<T, O>, initialValue: O): Promise<O>;
export function reduceAsync() {
  return purry(_reduceAsync, arguments);
}

async function _reduceAsync<V, O>(collection: ArrLike<V>, fn: ArrAsyncAccFn<V, O>, initialValue: O): Promise<O> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O = initialValue 
    for (const item of collection) {
      result = await fn(result, item, i);
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceObjAsync<K extends RecKey, V, O>(fn: MapAsyncAccFn<K, V, O>, initialValue: O): (obj: Record<K, V> | Map<K, V>) => Promise<O>;
export function reduceObjAsync<K, V, O>(fn: MapAsyncAccFn<K, V, O>, initialValue: O): (map: Map<K, V>) => Promise<O>;
export function reduceObjAsync<K, V, O>(map: Map<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O>;
export function reduceObjAsync<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O>;
export function reduceObjAsync() {
  return purry(_reduceObjAsync, arguments);
}

async function _reduceObjAsync<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O> {
  if (isMap(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const [key, value] of mapLike) {
      result = await fn(result, { key, value }, i);
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      result = await fn(result, { key, value }, i);
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceWhen<V, O>(condFn: ArrCondFn<V>, fn: ArrAccFn<V, O>, initialValue: O): (obj: ArrLike<V>) => O;
export function reduceWhen<I, O>(set: Set<I>, condFn: ArrCondFn<I>, fn: ArrAccFn<I, O>, initialValue: O): O;
export function reduceWhen<T, O>(arr: T[], condFn: ArrCondFn<T>, fn: ArrAccFn<T, O>, initialValue: O): O;
export function reduceWhen() {
  return purry(_reduceWhen, arguments);
}

function _reduceWhen<V, O>(collection: ArrLike<V>, condFn: ArrCondFn<V>, fn: ArrAccFn<V, O>, initialValue: O): O {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O = initialValue 
    for (const item of collection) {
      if (condFn(item, i)) {
        result = fn(result, item, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceObjWhen<K extends RecKey, V, O>(condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): (obj: Record<K, V> | Map<K, V>) => O;
export function reduceObjWhen<K, V, O>(condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): (map: Map<K, V>) => O;
export function reduceObjWhen<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O;
export function reduceObjWhen<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O;
export function reduceObjWhen() {
  return purry(_reduceObjWhen, arguments);
}

function _reduceObjWhen<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAccFn<K, V, O>, initialValue: O): O {
  if (isMap(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const [key, value] of mapLike) {
      if (condFn({ key, value }, i)) {
        result = fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (condFn({ key, value }, i)) {
        result = fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceWhenAsync<V, O>(condFn: ArrCondFn<V>, fn: ArrAsyncAccFn<V, O>, initialValue: O): (obj: ArrLike<V>) => Promise<O>;
export function reduceWhenAsync<I, O>(set: Set<I>, condFn: ArrCondFn<I>, fn: ArrAsyncAccFn<I, O>, initialValue: O): Promise<O>;
export function reduceWhenAsync<T, O>(arr: T[], condFn: ArrCondFn<T>, fn: ArrAsyncAccFn<T, O>, initialValue: O): Promise<O>;
export function reduceWhenAsync() {
  return purry(_reduceWhenAsync, arguments);
}

async function _reduceWhenAsync<V, O>(collection: ArrLike<V>, condFn: ArrCondFn<V>, fn: ArrAsyncAccFn<V, O>, initialValue: O): Promise<O> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O = initialValue 
    for (const item of collection) {
      if (condFn(item, i)) {
        result = await fn(result, item, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reduceObjWhenAsync<K extends RecKey, V, O>(condFn: MapCondFn<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): (obj: Record<K, V> | Map<K, V>) => Promise<O>;
export function reduceObjWhenAsync<K, V, O>(condFn: MapCondFn<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): (map: Map<K, V>) => Promise<O>;
export function reduceObjWhenAsync<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O>;
export function reduceObjWhenAsync<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O>;
export function reduceObjWhenAsync() {
  return purry(_reduceObjWhenAsync, arguments);
}

async function _reduceObjWhenAsync<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncAccFn<K, V, O>, initialValue: O): Promise<O> {
  if (isMap(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const [key, value] of mapLike) {
      if (condFn({ key, value }, i)) {
        result = await fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    let i = 0;
    let result: O = initialValue 
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (condFn({ key, value }, i)) {
        result = await fn(result, { key, value }, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

