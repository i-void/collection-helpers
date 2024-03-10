import { isArray, isMap, isRecord, isSet, type ArrFn, type RecKey, type MapFn, type CollectionFn, type Collection, type CollectionAsyncFn, type ArrCondFn, type MapCondFn, type CollectionCondFn, type CollectionAsyncCondFn, type ArrAsyncCondFn, type MapAsyncCondFn } from ".";
import { purry, map as rMap } from "remeda";

export function map<T extends Collection, F extends CollectionFn<T>, O = ReturnType<F>>(fn: F): (collection: T) => O[];
export function map<V, O>(set: Set<V>, fn: ArrFn<V, O>): O[];
export function map<V, O>(arr: Array<V>, fn: ArrFn<V, O>): O[];
export function map<V, O>(arr: ReadonlyArray<V>, fn: ArrFn<V, O>): O[];
export function map<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, O>): O[];
export function map<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapFn<K, V, O>): O[];
export function map() {
  return purry(_map, arguments);
}
function _map<T extends Collection, F extends CollectionFn<T>, O = ReturnType<F>>(collection: T, fn: F): O[] {
  if (isArray(collection)) {
    return rMap.indexed(collection, fn)
  } else if (isSet(collection)) {
    return rMap.indexed(Array.from(collection), fn)
  } else if (isMap(collection)) {
    return rMap.indexed(
      Array.from(collection),
      ([key, value], i) => fn({ key, value }, i)
    )
  } else if (isRecord(collection)) {
    return rMap.indexed(
      Object.entries(collection),
      ([key, value], i) => fn({ key, value }, i)
    )
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function mapAsyncAll<T extends Collection, F extends CollectionAsyncFn<T>, O = Awaited<ReturnType<F>>>(fn: F): (collection: T) => Promise<O[]>;
export function mapAsyncAll<V, O>(set: Set<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsyncAll<V, O>(arr: Array<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsyncAll<V, O>(arr: ReadonlyArray<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsyncAll<K, V, O>(fn: MapFn<K, V, Promise<O>>): (map: Map<K, V>) => Promise<O[]>;
export function mapAsyncAll<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapAsyncAll() {
  return purry(_mapAsyncAll, arguments);
}
async function _mapAsyncAll<T extends Collection, F extends CollectionAsyncFn<T>, O = Awaited<ReturnType<F>>>(collection: T, fn: F): Promise<O[]> {
  return Promise.all(_map(collection, fn));
}


export function mapAsync<T extends Collection, F extends CollectionAsyncFn<T>, O = Awaited<ReturnType<F>>>(fn: F): (collection: T) => Promise<O[]>;
export function mapAsync<V, O>(set: Set<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsync<V, O>(arr: Array<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsync<V, O>(arr: ReadonlyArray<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapAsync<K, V, O>(map: Map<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapAsync<K extends RecKey, V, O>(obj: Record<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapAsync() {
  return purry(_mapAsync, arguments);
}
async function _mapAsync<T extends Collection, F extends CollectionAsyncFn<T>, O = Awaited<ReturnType<F>>>(collection: T, fn: F): Promise<O[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const item of collection) {
      result[i] = await fn(item, i);
      i++;
    }
    return result;
  } else if (isRecord(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const [key, value] of Object.entries(collection)) {
      result[i] = await fn({ key, value }, i);
      i++;
    }
    return result;
  } else if (isMap(collection)) {
    let i = 0;
    let result: O[] = [];
    for (const [key, value] of collection) {
      result[i] = await fn({ key, value }, i);
      i++;
    }
    return result;
  }
  else {
    throw new Error('Unsupported collection type');
  }
}

export function mapWhen<T extends Collection, C extends CollectionCondFn<T>, F extends CollectionFn<T>>(condFn: C, fn: F): (collection: T) => ReturnType<F>[];
export function mapWhen<V, O>(set: Set<V>, condFn: ArrCondFn<V>, fn: ArrFn<V, O>): O[];
export function mapWhen<V, O>(arr: Array<V>, condFn: ArrCondFn<V>, fn: ArrFn<V, O>): O[];
export function mapWhen<V, O>(arr: ReadonlyArray<V>, condFn: ArrCondFn<V>, fn: ArrFn<V, O>): O[];
export function mapWhen<K, V, O>(map: Map<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): O[];
export function mapWhen<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapCondFn<K, V>, fn: MapFn<K, V, O>): O[];
export function mapWhen() {
  return purry(_mapWhen, arguments);
}

function _mapWhen<T extends Collection, C extends CollectionCondFn<T>, F extends CollectionFn<T>>(collection: T, condFn: C, fn: F): ReturnType<F>[] { 
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result = [];
    for (const item of collection) {
      if (condFn(item, i)) {
        result[i] = fn(item, i);
        i++;
      }
    }
    return result;
  } else if (isRecord(collection)) {
    let i = 0;
    let result = [];
    for (const [key, value] of Object.entries(collection)) {
      if (condFn({ key, value }, i)) {
        result[i] = fn({ key, value }, i);
        i++;
      }
    }
    return result;
  } else if (isMap(collection)) {
    let i = 0;
    let result = [];
    for (const [key, value] of collection) {
      if (condFn({ key, value }, i)) {
        result[i] = fn({ key, value }, i);
        i++;
      }
    }
    return result;
  }
  
  else {
    throw new Error('Unsupported collection type');
  }
}

export function mapWhenAsync<T extends Collection, C extends CollectionCondFn<T>, F extends CollectionAsyncFn<T>>(condFn: C, fn: F): (collection: T) => Promise<Awaited<ReturnType<F>>[]>;
export function mapWhenAsync<V, O>(set: Set<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsync<V, O>(arr: Array<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsync<V, O>(arr: ReadonlyArray<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsync<K, V, O>(map: Map<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapWhenAsync<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapWhenAsync() {
  return purry(_mapWhenAsync, arguments);
}

async function _mapWhenAsync<T extends Collection, C extends CollectionAsyncCondFn<T>, F extends CollectionAsyncFn<T>>(collection: T, condFn: C, fn: F): Promise<Awaited<ReturnType<F>>[]> {
  if (isArray(collection) || isSet(collection)) {
    let i = 0;
    let result = [];
    for (const item of collection) {
      if (await condFn(item, i)) {
        result[i] = await fn(item, i);
        i++;
      }
    }
    return result;
  } else if (isRecord(collection)) {
    let i = 0;
    let result = [];
    for (const [key, value] of Object.entries(collection)) {
      if (await condFn({ key, value }, i)) {
        result[i] = await fn({ key, value }, i);
        i++;
      }
    }
    return result;
  } else if (isMap(collection)) {
    let i = 0;
    let result = [];
    for (const [key, value] of collection) {
      if (await condFn({ key, value }, i)) {
        result[i] = await fn({ key, value }, i);
        i++;
      }
    }
    return result;
  }
  else {
    throw new Error('Unsupported collection type');
  }
}


export function mapWhenAsyncAll<T extends Collection, C extends CollectionAsyncCondFn<T>, F extends CollectionAsyncFn<T>>(condFn: C, fn: F): (collection: T) => Promise<Awaited<ReturnType<F>>[]>;
export function mapWhenAsyncAll<V, O>(set: Set<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsyncAll<V, O>(arr: Array<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsyncAll<V, O>(arr: ReadonlyArray<V>, condFn: ArrAsyncCondFn<V>, fn: ArrFn<V, Promise<O>>): Promise<O[]>;
export function mapWhenAsyncAll<K, V, O>(map: Map<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapWhenAsyncAll<K extends RecKey, V, O>(obj: Record<K, V>, condFn: MapAsyncCondFn<K, V>, fn: MapFn<K, V, Promise<O>>): Promise<O[]>;
export function mapWhenAsyncAll() {
  return purry(_mapWhenAsyncAll, arguments);
}

async function _mapWhenAsyncAll<T extends Collection, C extends CollectionAsyncCondFn<T>, F extends CollectionAsyncFn<T>>(collection: T, condFn: C, fn: F): Promise<Awaited<ReturnType<F>[]>> {
  const condResults = await _mapAsyncAll(collection as any[], async (c, i) => [c, await condFn(c, i)] as const);
  return Promise.all(_mapWhen(condResults, (item) => item[1], async (item, i) => await fn(item[0], i)));
}