import { isArray, isMap, isRecord, isSet, type ArrFn, type ArrLike, type RecKey, type MapFn, type ArrCondFn, type MapCondFn, type ArrAsyncFn, type MapAsyncFn } from "..";
import { purry, map as rMap } from "remeda";

export function map<V, O>(fn: ArrFn<V, O>): (obj: ArrLike<V>) => O[];
export function map<I, O>(set: Set<I>, fn: ArrFn<I, O>): O[];
export function map<T, O>(arr: T[], fn: ArrFn<T, O>): O[];
export function map() {
  return purry(_map, arguments);
}
function _map<V, O>(collection: ArrLike<V>, fn: ArrFn<V, O>): O[] {
  if (isArray(collection)) {
    return rMap.indexed(collection, fn as ArrFn<V, O>)
  } else if (isSet(collection)) {
    return rMap.indexed(Array.from(collection), fn as ArrFn<V, O>)
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapObj<K extends RecKey, V, O>(fn: MapFn<K, V, O>): (obj: Record<K, V> | Map<K, V>) => O[];
export function mapObj<K, V, O>(fn: MapFn<K, V, O>): (map: Map<K, V>) => O[];
export function mapObj<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, O>): O[];
export function mapObj<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapFn<K, V, O>): O[];
export function mapObj() {
  return purry(_mapObj, arguments);
}
function _mapObj<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, fn: MapFn<K, V, O>): O[] {
  if (isMap(mapLike)) {
    return rMap.indexed(
      Array.from(mapLike),
      ([key, value], i) => (fn as MapFn<K, V, O>)({ key, value }, i)
    )
  } else if (isRecord(mapLike)) {
    return rMap.indexed(
      Object.entries(mapLike) as [K, V][],
      ([key, value], i) => (fn as MapFn<K, V, O>)({ key, value }, i)
    )
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function mapAsyncAll<V, O>(fn: ArrFn<V, Promise<O>>): (obj: ArrLike<V>) => Promise<O[]>;
export function mapAsyncAll<I, O>(set: Set<I>, fn: ArrFn<I, Promise<O>>): Promise<O[]>;
export function mapAsyncAll<T, O>(arr: T[], fn: ArrFn<T, Promise<O>>): Promise<O[]>;
export function mapAsyncAll() {
  return purry(_mapAsyncAll, arguments);
}
async function _mapAsyncAll<V, O>(collection: ArrLike<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]> {
  return Promise.all(_map(collection, fn));
}


export function mapObjAsyncAll<K extends RecKey, V, O>(fn: MapFn<K, V, Promise<O>>): (obj: Record<K, V> | Map<K, V>) => Promise<O[]>;
export function mapObjAsyncAll<K, V, O>(fn: MapFn<K, V, Promise<O>>): (map: Map<K, V>) => Promise<O[]>;
export function mapObjAsyncAll<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjAsyncAll<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjAsyncAll() {
  return purry(_mapObjAsyncAll, arguments);
}
async function _mapObjAsyncAll<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]> {
  return Promise.all(_mapObj(mapLike, fn));
}


export function mapAsync<V, O>(fn: ArrFn<V, Promise<O>>): (obj: ArrLike<V>) => Promise<O[]>;
export function mapAsync<I, O>(set: Set<I>, fn: ArrFn<I, Promise<O>>): Promise<O[]>;
export function mapAsync<T, O>(arr: T[], fn: ArrFn<T, Promise<O>>): Promise<O[]>;
export function mapAsync() {
  return purry(_mapAsync, arguments);
}
async function _mapAsync<V, O>(collection: ArrLike<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const item of collection) {
      result[i] = await fn(item, i);
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapObjAsync<K extends RecKey, V, O>(fn: MapFn<K, V, Promise<O>>): (obj: Record<K, V> | Map<K, V>) => Promise<O[]>;
export function mapObjAsync<K, V, O>(fn: MapFn<K, V, Promise<O>>): (map: Map<K, V>) => Promise<O[]>;
export function mapObjAsync<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjAsync<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjAsync() {
  return purry(_mapObjAsync, arguments);
}

async function _mapObjAsync<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]> {
  let i = 0;
  let result: O[] = [];
  if (isMap(mapLike)) {
    for (const [key, value] of mapLike) {
      result[i] = await (fn as MapFn<K, V, Promise<O>>)({ key, value }, i);
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      result[i] = await (fn as MapFn<K, V, Promise<O>>)({ key, value }, i);
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}



export function mapWhen<V, O>(condFn: ArrCondFn<V>, fn: ArrFn<V, O>): (obj: ArrLike<V>) => O;
export function mapWhen<I, O>(set: Set<I>, condFn: ArrCondFn<I>, fn: ArrFn<I, O>): O;
export function mapWhen<T, O>(arr: T[], condFn: ArrCondFn<T>, fn: ArrFn<T, O>): O;
export function mapWhen() {
  return purry(_mapWhen, arguments);
}

function _mapWhen<V, O>(collection: ArrLike<V>, condFn: ArrCondFn<V>, fn: ArrFn<V, O>): O[] {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const item of collection) {
      if (condFn(item, i)) {
        result[i] = fn(item, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapObjWhen<K extends RecKey, V, O>(condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): (obj: Record<K, V> | Map<K, V>) => O[];
export function mapObjWhen<K, V, O>(condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): (map: Map<K, V>) => O[];
export function mapObjWhen<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): O[];
export function mapObjWhen<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): O[];
export function mapObjWhen() {
  return purry(_mapObjWhen, arguments);
}

function _mapObjWhen<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): O[] {
  if (isMap(mapLike)) {
    let i = 0;
    let result: O[] = [];
    for (const [key, value] of mapLike) {
      if (condFn({ key, value }, i)) {
        result[i] = fn({ key, value }, i);
      }
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    let i = 0;
    let result: O[] = [];
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (condFn({ key, value }, i)) {
        result[i] = fn({ key, value }, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapWhenAsync<V, O>(condFn: ArrCondFn<V>, fn: ArrFn<V, Promise<O>>): (obj: ArrLike<V>) => Promise<O[]>;
export function mapWhenAsync<I, O>(set: Set<I>, condFn: ArrCondFn<I>, fn: ArrFn<I, Promise<O>>): Promise<O[]>;
export function mapWhenAsync<T, O>(arr: T[], condFn: ArrCondFn<T>, fn: ArrFn<T, Promise<O>>): Promise<O[]>;
export function mapWhenAsync() {
  return purry(_mapWhenAsync, arguments);
}

async function _mapWhenAsync<V, O>(collection: ArrLike<V>, condFn: ArrCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const item of collection) {
      if (condFn(item, i)) {
        result[i] = await fn(item, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapObjWhenAsync<K extends RecKey, V, O>(condFn: MapCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): (obj: Record<K, V> | Map<K, V>) => Promise<O[]>;
export function mapObjWhenAsync<K, V, O>(condFn: MapCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): (map: Map<K, V>) => Promise<O[]>;
export function mapObjWhenAsync<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjWhenAsync<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapObjWhenAsync() {
  return purry(_mapObjWhenAsync, arguments);
}

async function _mapObjWhenAsync<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]> {
  let i = 0;
  let result: O[] = [];
  if (isMap(mapLike)) {
    for (const [key, value] of mapLike) {
      if (condFn({ key, value }, i)) {
        result[i] = await fn({ key, value }, i);
      }
      i++;
    }
    return result;
  } else if (isRecord(mapLike)) {
    for (const ml of Object.entries(mapLike)) {
      const key = ml[0] as K;
      const value = ml[1] as V;
      if (condFn({ key, value }, i)) {
        result[i] = await fn({ key, value }, i);
      }
      i++;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function mapWhenAsyncAll<V, O>(condFn: ArrCondFn<V>, fn: ArrAsyncFn<V, O>): (obj: ArrLike<V>) => Promise<O[]>;
export function mapWhenAsyncAll<I, O>(set: Set<I>, condFn: ArrCondFn<I>, fn: ArrAsyncFn<I, O>): Promise<O[]>;
export function mapWhenAsyncAll<T, O>(arr: T[], condFn: ArrCondFn<T>, fn: ArrAsyncFn<T, O>): Promise<O[]>;
export function mapWhenAsyncAll() {
  return purry(_mapWhenAsyncAll, arguments);
}

async function _mapWhenAsyncAll<V, O>(collection: ArrLike<V>, condFn: ArrCondFn<V>, fn: ArrAsyncFn<V, O>): Promise<O[]> {
  if (isArray(collection) || isSet(collection)) {
    return Promise.all(_mapWhen(collection, condFn, fn));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapObjWhenAsyncAll<K extends RecKey, V, O>(condFn: MapCondFn<K, V>, fn: MapAsyncFn<K, V, O>): (obj: Record<K, V> | Map<K, V>) => Promise<O[]>;
export function mapObjWhenAsyncAll<K, V, O>(condFn: MapCondFn<K, V>, fn: MapAsyncFn<K, V, O>): (map: Map<K, V>) => Promise<O[]>;
export function mapObjWhenAsyncAll<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncFn<K, V, O>): Promise<O[]>;
export function mapObjWhenAsyncAll<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncFn<K, V, O>): Promise<O[]>;
export function mapObjWhenAsyncAll() {
  return purry(_mapObjWhenAsyncAll, arguments);
}

async function _mapObjWhenAsyncAll<K extends RecKey, V, O>(mapLike: Record<K, V> | Map<K, V>, condFn: MapCondFn<K, V>, fn: MapAsyncFn<K, V, O>): Promise<O[]> {
  return Promise.all(_mapObjWhen(mapLike, condFn, fn));
}