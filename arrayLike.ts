import { isArray, isSet } from ".";

export function first<T>(set: Set<T>): T | undefined;
export function first<T>(arr: T[]): T | undefined 

export function first(collection: unknown): unknown{
  if (isArray(collection)) {
    return collection[0];
  } else if (isSet(collection)) {
    return collection.values().next().value;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function last<T>(set: Set<T>): T | undefined;
export function last<T>(arr: T[]): T | undefined;

export function last(collection: unknown): unknown {
  if (isArray(collection)) {
    return collection[collection.length - 1];
  } else if (isSet(collection)) {
    let result;
    for (const item of collection) {
      result = item;
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function includes<T>(set: Set<T>, value: T): boolean;
export function includes<T>(arr: T[], value: T): boolean;

export function includes(collection: unknown, value: unknown): boolean {
  if (isArray(collection)) {
    return collection.includes(value);
  } else if (isSet(collection)) {
    return collection.has(value);
  } else {
    throw new Error('Unsupported collection type');
  }
}

// curried version
export function cIncludes<T>(value: T): (set: Set<T>) => boolean;
export function cIncludes<T>(value: T): (arr: T[]) => boolean;

export function cIncludes(value: unknown): (collection: any) => boolean {
  return (collection: any) => includes(collection, value);
}


export function compact<T>(set: Set<T>): Set<T>;
export function compact<T>(arr: T[]): T[];

export function compact(collection: unknown): unknown {
  if (isArray(collection)) {
    return collection.filter(Boolean);
  } else if (isSet(collection)) {
    return new Set(Array.from(collection).filter(Boolean));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function isEmpty<T>(set: Set<T>): boolean;
export function isEmpty<T>(arr: T[]): boolean;

export function isEmpty(collection: unknown): boolean {
  if (isArray(collection)) {
    return collection.length === 0;
  } else if (isSet(collection)) {
    return collection.size === 0;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function size<T>(set: Set<T>): number;
export function size<T>(arr: T[]): number;

export function size(collection: unknown): number {
  if (isArray(collection)) {
    return collection.length;
  } else if (isSet(collection)) {
    return collection.size;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function zip<T>(set1: Set<T>, set2: Set<T>): Set<[T, T]>;
export function zip<T>(set: Set<T>, arr: T[]): Set<[T, T]>;
export function zip<T>(arr: T[], set: Set<T>): [T, T][];
export function zip<T>(arr1: T[], arr2: T[]): [T, T][];

export function zip(collection1: unknown, collection2: unknown): unknown {
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

// curried version
export function cZip<T>(set2: Set<T>): (set1: Set<T>) => Set<[T, T]>;
export function cZip<T>(set: Set<T>): (arr: T[]) => Set<[T, T]>;
export function cZip<T>(arr: T[]): (set: Set<T>) => [T, T][];
export function cZip<T>(arr2: T[]): (arr: T[]) => [T, T][];
export function cZip(collection1: any): any {
  return (collection2: any) => zip(collection2, collection1);
}


export function zip3<T>(set1: Set<T>, set2: Set<T>, set3: Set<T>): Set<[T, T, T]>;
export function zip3<T>(arr1: T[], arr2: T[], arr3: T[]): [T, T, T][];

export function zip3(collection1: unknown, collection2: unknown, collection3: unknown): unknown {
  if (isArray(collection1) && isArray(collection2) && isArray(collection3)) {
    return collection1.map((item, index) => [item, collection2[index], collection3[index]]);
  } else if (isSet(collection1) && isSet(collection2) && isSet(collection3)) {
    const result = new Set();
    const iterator1 = collection1.values();
    const iterator2 = collection2.values();
    const iterator3 = collection3.values();
    for (let i = 0; i < Math.min(collection1.size, collection2.size, collection3.size); i++) {
      result.add([iterator1.next().value, iterator2.next().value, iterator3.next().value]);
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function reverse<T>(set: Set<T>): Set<T>;
export function reverse<T>(arr: T[]): T[];

export function reverse(collection: unknown): unknown {
  if (isArray(collection)) {
    return collection.slice().reverse();
  } else if (isSet(collection)) {
    return new Set(Array.from(collection).reverse());
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function flatten<T>(set: Set<Set<T>>): Set<T>;
export function flatten<T>(set: Set<T[]>): Set<T>;
export function flatten<T>(arr: T[][]): T[];

export function flatten<T>(collection: Set<T[]> | T[][] | Set<Set<T>>): unknown {
  if (isArray(collection)) {
    return collection.flat();
  } else if (isSet(collection)) {
    const result = new Set();
    for (const item of collection) {
      for (const subItem of item) {
        result.add(subItem);
      }
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function range(count: number, start = 0, step = 1): number[] {
  return Array.from({ length: count }, (_, i) => start + i * step);
}

export function sum(set: Set<number>): number;
export function sum(arr: number[]): number;

export function sum(collection: Set<number> | number[]): number {
  if (isArray(collection)) {
    return collection.reduce((acc, item) => acc + item, 0);
  } else if (isSet(collection)) {
    return Array.from(collection).reduce((acc, item) => acc + item, 0);
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function take<T>(set: Set<T>, count: number, from?: number): Set<T>;
export function take<T>(arr: T[], count: number, from?: number): T[];

export function take<T>(collection: Set<T> | T[], count: number, from = 0): unknown {
  if (isArray(collection)) {
    return collection.slice(from, count + from);
  } else if (isSet(collection)) {
    const result = new Set();
    const iterator = collection.values();
    for (let i = from; i < count + from; i++) {
      result.add(iterator.next().value);
    }
    return result;
  } else {
    throw new Error('Unsupported collection type');
  }
}

// curried version
export function cTake<T>(count: number, from?: number): (set: Set<T>) => Set<T>;
export function cTake<T>(count: number, from?: number): (arr: T[]) => T[];

export function cTake(count: number, from = 0): unknown {
  return (collection: any) => take(collection, count, from);
}


export function min(set: Set<number>): number;
export function min(arr: number[]): number;

export function min(collection: Set<number> | number[]): number {
  if (isArray(collection)) {
    return Math.min(...collection);
  } else if (isSet(collection)) {
    return Math.min(...Array.from(collection));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function max(set: Set<number>): number;
export function max(arr: number[]): number;

export function max(collection: Set<number> | number[]): number {
  if (isArray(collection)) {
    return Math.max(...collection);
  } else if (isSet(collection)) {
    return Math.max(...Array.from(collection));
  } else {
    throw new Error('Unsupported collection type');
  }
}