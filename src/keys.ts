import { purry } from "remeda";
import { isArray, isMap, isRecord, isSet } from "./typeChecks";
import type { Collection } from "./types";

type KeysColl<T> =
  T extends Set<any> ? number :
  T extends Array<any> ? number :
  T extends ReadonlyArray<any> ? number :
  T extends Map<infer K, any> ? K :
  T extends Record<infer K, any> ? K :
  never;

export function keys(): <T extends Collection, U extends KeysColl<T>>(arrLike: T) => U[]
export function keys<T extends Collection, U extends KeysColl<T>>(arrLike: T): U[]
export function keys() {
  return purry(_keys, arguments)
}
function _keys(mapLike: any) {
  if (isMap(mapLike)) {
    return [...mapLike.keys()];
  } else if (isRecord(mapLike)) {
    return Object.keys(mapLike);
  } else if (isArray(mapLike)) {
    return Array.from({ length: mapLike.length }, (_, index) => index);
  } else if (isSet(mapLike)) {
    return Array.from({ length: mapLike.size }, (_, index) => index);
  } else {
    throw new Error("Unsupported collection");
  }
}