import { purry } from "remeda";
import { type ArrCondFn, type ArrLike, type RecKey, type MapCondFn, type ArrAsyncCondFn, type MapAsyncCondFn, type Collection, type CollectionFn, type CollectionAsyncFn, any, anyAsync } from ".";

export function none<T extends Collection, F extends CollectionFn<T>>(fn: F): (collection: T) => boolean;
export function none<V>(set: Set<V>, fn: ArrCondFn<V>): boolean;
export function none<T>(arr: Array<T>, fn: ArrCondFn<T>): boolean;
export function none<T>(arr: ReadonlyArray<T>, fn: ArrCondFn<T>): boolean;
export function none<K, V>(map: Map<K, V>, fn: MapCondFn<K, V>): boolean;
export function none<K extends RecKey, V>(obj: Record<K, V>, fn: MapCondFn<K, V>): boolean;
export function none() {
  return purry(_none, arguments);
}

function _none<V>(collection: ArrLike<V>, fn: ArrCondFn<V>): boolean {
  return !any(collection, fn);
}



export function noneAsync<T extends Collection, F extends CollectionAsyncFn<T>>(fn: F): (collection: T) => Promise<boolean>;
export function noneAsync<V>(set: Set<V>, fn: ArrAsyncCondFn<V>): Promise<boolean>;
export function noneAsync<T>(arr: Array<T>, fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function noneAsync<T>(arr: ReadonlyArray<T>, fn: ArrAsyncCondFn<T>): Promise<boolean>;
export function noneAsync<K, V>(map: Map<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function noneAsync<K extends RecKey, V>(obj: Record<K, V>, fn: MapAsyncCondFn<K, V>): Promise<boolean>;
export function noneAsync() {
  return purry(_noneAsync, arguments);
}

async function _noneAsync<V>(collection: ArrLike<V>, fn: ArrAsyncCondFn<V>): Promise<boolean> {
  return !(await anyAsync(collection, fn));
}
