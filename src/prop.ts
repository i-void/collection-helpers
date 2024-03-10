/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MapLike, MapValueTypes } from ".";
import { purry } from "remeda";

type ValueOf<T, K> = T extends Map<infer _, infer V> ? V : T extends Record<any, any> ? T[K] : never;

export function prop<T extends MapLike<any, any>, K>(key: K): (mapLike: T) => ValueOf<T, K>; 
export function prop<T extends Record<any, any>, K extends keyof T>(record: T, key: K): T[K];
export function prop<T extends Map<any, any>, K>(map: T, key: K): ValueOf<T, K>;
export function prop() {
  return purry(_prop, arguments);
}

export function _prop<T extends MapLike<any, any>, K>(mapLike: T, key: K): ValueOf<T, K> { 
  if (mapLike instanceof Map) {
    return mapLike.get(key);
  } else {
    return mapLike[key] as ValueOf<T, K>;
  }
};

type ValuesOf<T, K extends ReadonlyArray<any>> =
  T extends Map<infer _, infer V> ? V[] :
  T extends Record<any, any> ? MapValueTypes<T, K> :
  never;

export function props<T extends MapLike<any, any>, K extends ReadonlyArray<any>>(keys: K): (mapLike: T) => ValuesOf<T, K>;
export function props<T extends Map<any, any>, K extends ReadonlyArray<any>>(map: T, keys: K): ValuesOf<T, K>;
export function props<T, K extends readonly (keyof T)[]>(record: T, keys: K ): MapValueTypes<T, K>; 
export function props() {
  return purry(_props, arguments);
}

export function _props<T extends MapLike<any, any>, K>(mapLike: T, keys: K[]): any {
  const result: any = [];
  for (const key of keys) {
    if (mapLike instanceof Map) {
      result.push(mapLike.get(key));
    } else {
      result.push(mapLike[key]);
    }
  }
  return result;
}