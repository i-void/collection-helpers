import { isMap, isRecord } from ".";

export function merge<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V>;
export function merge<K extends string | number | symbol, V>(map: Map<K, V>, obj: Record<K, V>): Map<K, V>;
export function merge<K extends string | number | symbol, V>(obj: Record<K, V>, map: Map<K, V>): Map<K, V>;
export function merge<K extends string | number | symbol, V>(obj1: Record<K, V>, obj2: Record<K, V>): Record<K, V>;

export function merge(collection1: unknown, collection2: unknown): unknown {
  if (isMap(collection1) && isMap(collection2)) {
    return new Map([...collection1, ...collection2]);
  } else if (isMap(collection1) && isRecord(collection2)) {
    return new Map([...collection1, ...Object.entries(collection2)]);
  } else if (isRecord(collection1) && isMap(collection2)) {
    return { ...collection1, ...Object.fromEntries(collection2) };
  } else if (isRecord(collection1) && isRecord(collection2)) {
    return { ...collection1, ...collection2 };
  } else {
    throw new Error('Unsupported collection type');
  }
}

export function omit<K, V>(map: Map<K, V>, keys: K[]): Map<K, V>;
export function omit<K extends string | number | symbol, V>(obj: Record<K, V>, keys: K[]): Record<K, V>

export function omit(collection: unknown, keys: unknown[]): unknown {
  if (isMap(collection)) {
    return new Map([...collection].filter(([key]) => !keys.includes(key)));
  } else if (isRecord(collection)) {
    return Object.fromEntries(Object.entries(collection).filter(([key]) => !keys.includes(key)));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function pick<K, V>(map: Map<K, V>, keys: K[]): Map<K, V>;
export function pick<K extends string | number | symbol, V>(obj: Record<K, V>, keys: K[]): Record<K, V>;

export function pick(collection: unknown, keys: unknown[]): unknown {
  if (isMap(collection)) {
    return new Map([...collection].filter(([key]) => keys.includes(key)));
  } else if (isRecord(collection)) {
    return Object.fromEntries(Object.entries(collection).filter(([key]) => keys.includes(key)));
  } else {
    throw new Error('Unsupported collection type');
  }
}


export function toRecord<K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V>
export function toRecord<K extends string | number | symbol, V>(arr: [K, V][]): Record<K, V>

export function toRecord(collection: unknown): unknown {
  if (isMap(collection)) {
    return Object.fromEntries(collection);
  } else if (Array.isArray(collection)) {
    return Object.fromEntries(collection);
  } else {
    throw new Error('Unsupported collection type');
  }
}