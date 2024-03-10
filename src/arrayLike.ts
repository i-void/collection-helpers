import { purry } from "remeda";
import { isArray, isSet, type NonNullableArrLike, type ArrLike, type UnboxArrLike, type UnboxArrLikeRecursively } from ".";
import type { CompareFunction } from "remeda/dist/commonjs/_types";

export function first<T extends ArrLike<any>, U = UnboxArrLike<T>>(arrLike: T): U | undefined {
  if (isArray(arrLike)) {
    return arrLike[0];
  } else if (isSet(arrLike)) {
    return arrLike.values().next().value;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function last<T extends ArrLike<any>, U = UnboxArrLike<T>>(arrLike: T): U | undefined {
  if (isArray(arrLike)) {
    return arrLike[arrLike.length - 1];
  } else if (isSet(arrLike)) {
    let result;
    for (const item of arrLike) {
      result = item;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function includes<T>(value: T): (collection: ArrLike<T>) => boolean;
export function includes<T>(set: Set<T>, value: T): boolean;
export function includes<T>(arr: T[], value: T): boolean;
export function includes<T>(arr: ReadonlyArray<T>, value: T): boolean;
export function includes() {
  return purry(_includes, arguments);
}

export function _includes<T>(collection: ArrLike<T>, value: T): boolean {
  if (isArray(collection)) {
    return collection.includes(value);
  } else if (isSet(collection)) {
    return collection.has(value);
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function exclude<T, C extends ArrLike<T>>(values: T[]): (arrLike: C) => C;
export function exclude<T>(set: Set<T>, values: T[]): Set<T>;
export function exclude<T>(arr: T[], values: T[]): T[];
export function exclude() {
  return purry(_exclude, arguments);
}

export function _exclude<T, C extends ArrLike<T>>(arrLike: C, values: T[]): C {
  if (isArray(arrLike)) {
    return arrLike.filter(item => !values.includes(item)) as C;
  } else if (isSet(arrLike)) {
    return new Set([...arrLike].filter(item => !values.includes(item))) as C;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function compact<T extends ArrLike<any>>(arrLike: T): NonNullableArrLike<T> {
  if (isArray(arrLike)) {
    return (arrLike).filter(Boolean) as any;
  } else if (isSet(arrLike)) {
    return new Set(Array.from(arrLike).filter(Boolean)) as any;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function isEmpty<C extends ArrLike<any>>(arrLike: C): boolean {
  if (isArray(arrLike)) {
    return arrLike.length === 0;
  } else if (isSet(arrLike)) {
    return arrLike.size === 0;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function size<C extends ArrLike<any>>(arrLike: C): number {
  if (isArray(arrLike)) {
    return arrLike.length;
  } else if (isSet(arrLike)) {
    return arrLike.size;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function zip<
  T extends ArrLike<any>,
  U extends ArrLike<any>,
  R = U extends Set<infer K> ? Set<[K, K]> : T extends Array<infer K> ? [K, K][] : never
>(arrLike2: T): (arrLike: U) => R;
export function zip<T>(set: Set<T>, set2: Set<T>): Set<[T, T]>;
export function zip<T>(set: Set<T>, arr: T[]): Set<[T, T]>;
export function zip<T>(arr: T[], set: Set<T>): [T, T][];
export function zip<T>(arr: T[], arr2: T[]): [T, T][];
export function zip() {
  return purry(_zip, arguments);
}

export function _zip(collection1: unknown, collection2: unknown): unknown {
  if (isArray(collection1) && isArray(collection2)) {
    return collection1.map((item, index) => [item, collection2[index]]);
  } else if (isSet(collection1) && isSet(collection2)) {
    const result = new Set();
    const iterator1 = collection1.values();
    const iterator2 = collection2.values();
    for (let i = 0; i < Math.min(collection1.size, collection2.size); i++) {
      result.add([iterator1.next().value, iterator2.next().value]);
    }
    return result;
  } else if (isArray(collection1) && isSet(collection2)) {
    const result = [];
    const iterator = collection2.values();
    for (const item of collection1) {
      result.push([item, iterator.next().value]);
    }
    return result;
  } else if (isSet(collection1) && isArray(collection2)) {
    const result = new Set();
    const iterator = collection1.values();
    for (const item of collection2) {
      result.add([iterator.next().value, item]);
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function nth<T>(set: ArrLike<T>, n: number): T | undefined {
  if (isArray(set)) {
    return set[n];
  } else if (isSet(set)) {
    if (n < 0 || n >= set.size) {
      return undefined;
    }
    let index = 0;
    for (let item of set) {
      if (index === n) {
        return item;
      }
      index++;
    }
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function zip3<
  T extends ArrLike<any>,
  U extends ArrLike<any>,
  V extends ArrLike<any>,
  R = U extends Set<infer K> ? Set<[K, K, K]> : T extends Array<infer K> ? [K, K, K][] : never
>(arrLike2: T, arrLike3: V): (arrLike: U) => R;
export function zip3<
  T extends ArrLike<any>,
  U extends ArrLike<any>,
  V extends ArrLike<any>,
  R = U extends Set<infer K> ? Set<[K, K, K]> : T extends Array<infer K> ? [K, K, K][] : never
>(arrLike: U, arrLike2: T, arrLike3: V): R;
export function zip3() {
  return purry(_zip3, arguments);
}
function _zip3(arrLike: any, arrLike2: any, arrLike3: any): any {
  const result: any[] = []
  const leastLength = Math.min(size(arrLike), size(arrLike2), size(arrLike3))
  for (let i = 0; i < leastLength; i++) {
    result.push([nth(arrLike, i), nth(arrLike2, i), nth(arrLike3, i)])
  }
  if (isSet(arrLike)) {
    return new Set(result)
  } else {
    return result
  }
}


export function reverse<C extends ArrLike<T>, T>(collection: C): C {
  if (isArray(collection)) {
    return collection.slice().reverse() as C;
  } else if (isSet(collection)) {
    return new Set(Array.from(collection).reverse()) as C;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function flatten<T extends ArrLike<any>, U = UnboxArrLikeRecursively<T>>(arrLike: T): T extends Set<any> ? Set<U> : U[] {
  let result: any[] = [];
  if (isArray(arrLike) || isSet(arrLike)) {
    for (const item of arrLike) {
      if (isArray(item) || isSet(item)) {
        result.push(...flatten(item));
      } else {
        result.push(item);
      }
    }
    return isArray(arrLike) ? result : new Set(result) as any;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function range(count: number, start = 0, step = 1): number[] {
  return Array.from({ length: count }, (_, i) => start + i * step);
}

export function sum<T extends ArrLike<number>>(arrLike: T): number {
  let result = 0;
  if (isArray(arrLike) || isSet(arrLike)) {
    for (const item of arrLike) result += item
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function take<T extends ArrLike<any>>(count: number): (arrLike: T) => T;
export function take<T>(set: Set<T>, count: number, from?: number): Set<T>;
export function take<T>(arr: Array<T>, count: number, from?: number): T[];
export function take<T>(arr: ReadonlyArray<T>, count: number, from?: number): T[];
export function take() {
  return purry(_take, arguments);
}

function _take<T extends ArrLike<any>>(arrLike: T, count: number, from = 0): unknown {
  if (isArray(arrLike)) {
    return arrLike.slice(from, count + from);
  } else if (isSet(arrLike)) {
    const result = new Set();
    const iterator = arrLike.values();
    for (let i = from; i < count + from; i++) {
      result.add(iterator.next().value);
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function min<T extends ArrLike<number>>(arrLike: T): number {
  if (isArray(arrLike) || isSet(arrLike)) {
    return Math.min(...arrLike);
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function max<T extends ArrLike<number>>(arrLike: T): number {
  if (isArray(arrLike) || isSet(arrLike)) {
    return Math.max(...arrLike);
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function sortBy<T extends ArrLike<any>, F extends CompareFunction<U>, U = UnboxArrLike<T>>(sorter: F): (arrLike: T) => T;
export function sortBy<T>(set: Set<T>, sorter: CompareFunction<T>): Set<T>;
export function sortBy<T>(arr: T[], sorter: CompareFunction<T>): T[];
export function sortBy<T>(arr: ReadonlyArray<T>, sorter: CompareFunction<T>): T[];
export function sortBy() {
  return purry(_sortBy, arguments);
}

function _sortBy<T extends ArrLike<any>>(arrLike: T, sorter: CompareFunction<UnboxArrLike<T>>): T {
  if (isArray(arrLike)) {
    return arrLike.slice().sort(sorter) as T;
  } else if (isSet(arrLike)) {
    const result = new Set(Array.from(arrLike).sort(sorter));
    return result as T;
  } else {
    throw new Error('Unsupported collection type');
  }
}