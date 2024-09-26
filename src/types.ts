
// Array Likes
export type ArrLike<V> = Set<V> | Array<V> | ReadonlyArray<V>;
export type NonNullableArrLike<T> = 
  T extends Set<infer V> ? Set<NonNullable<V>> :
  T extends Array<infer V> ? Array<NonNullable<V>> :
  T extends ReadonlyArray<infer V> ? ReadonlyArray<NonNullable<V>> :
  T extends ReadonlyArray<infer V> ? ReadonlyArray<NonNullable<V>> : 
  never;
export type ArrFn<T, O> = (item: T, index: number) => O;
export type ArrAsyncFn<T, O> = (item: T, index: number) => O | Promise<O>;
export type ArrAccFn<V, O> = (accumulator: O, item: V, index: number) => O;
export type ArrCondFn<V> = (item: V, index: number) => boolean;
export type ArrAsyncCondFn<V> = (item: V, index: number) => boolean | Promise<boolean>; 
export type ArrAsyncAccFn<V, O> = (accumulator: O, item: V, index: number) => O | Promise<O>;
export type SetOrArray<T> = 
  T extends Set<infer V> ? Set<V> : 
  T extends Array<infer V> ? Array<V> :
  T extends ReadonlyArray<infer V> ? ReadonlyArray<V> : 
  never;
export type UnboxArrLike<T> = 
  T extends Set<infer V> ? V : 
  T extends ReadonlyArray<infer V> ? V :
  T extends Array<infer V> ? V :
  never;
export type UnboxArrLikeRecursion<T> =
  T extends Set<infer V> ? UnboxArrLikeRecursion<V> :
  T extends ReadonlyArray<infer V> ? UnboxArrLikeRecursion<V> :
  T extends Array<infer V> ? UnboxArrLikeRecursion<V> :
  T;
export type UnboxArrLikeRecursively<T> = UnboxArrLikeRecursion<UnboxArrLike<T>>;
export type InferArrFn<T> = T extends ArrFn<infer V, infer O> ? ArrFn<V, O>: never
export type ArrFnOfObj<T> =
  T extends Set<infer V> ? SetOrArray<V> :
  T extends Array<infer V> ? SetOrArray<V> :
  T extends ReadonlyArray<infer V> ? SetOrArray<V> :
  never;

// Map Likes
export type RecKey = string | number | symbol;
export type MappedItem<K, V> = { key: K, value: V };
export type MapLike<K, V> = K extends RecKey ? Record<K, V> : Map<K, V>;
export type MapFn<K, V, O> = (record: MappedItem<K, V>, index: number) => O;
export type MapAsyncFn<K, V, O> = (record: MappedItem<K, V>, index: number) => O | Promise<O>;
export type MapAccFn<K, V, O> = (accumulator: O, record: MappedItem<K, V>, index: number) => O;
export type MapCondFn<K, V> = (record: MappedItem<K, V>, index: number) => boolean;
export type MapAsyncCondFn<K, V> = (record: MappedItem<K, V>, index: number) => boolean | Promise<boolean>;
export type MapAsyncAccFn<K, V, O> = (accumulator: O, record: MappedItem<K, V>, index: number) => O | Promise<O>;
export type MapOrRecord<T> = 
  T extends Map<infer K, infer V> ? Map<K, V> : 
  T extends Record<infer K, infer V> ? Record<K, V> :
  never;
export type UnboxMapLike<T> =
  T extends Map<infer K, infer V> ? readonly [K, V] :
  T extends Record<infer K, infer V> ? readonly [K, V] :
  never;
export type UnboxSelfMapLike<T> =
  T extends Map<infer K, infer V> ? Map<K, V> :
  T extends Record<infer K, infer V> ? Partial<Record<K, V>> :
  never;
export type InferMapFn<T> = T extends MapFn<infer K, infer V, infer O> ? MapFn<K, V, O>: never

// Commons
export type Collection = Set<any> | Map<any, any> | ReadonlyArray<any> | Array<any> |  Record<any, any>;
export type InferCollectionType<T> =
  T extends Set<infer K> ? Set<K> :
  T extends Map<infer K, infer V> ? Map<K, V> :
  T extends Array<infer K> ? Array<K> :
  T extends ReadonlyArray<infer K> ? ReadonlyArray<K> :
  T extends Record<infer K, infer V> ? Record<K, V> :
  never;
export type CollectionFnOfObj<T> =
  T extends Set<infer K> ? ArrFn<K, any> :
  T extends Map<infer K, infer V> ? MapFn<K, V, any> :
  T extends Array<infer K> ? ArrFn<K, any> :
  T extends ReadonlyArray<infer K> ? ArrFn<K, any> :
  T extends Record<infer K, infer V> ? MapFn<K, V, any> :
  never; 
export type CollectionCondFnOfObj<T> =
  T extends Set<infer K> ? ArrCondFn<K> :
  T extends Map<infer K, infer V> ? MapCondFn<K, V> :
  T extends Array<infer K> ? ArrCondFn<K> :
  T extends ReadonlyArray<infer K> ? ArrCondFn<K> :
  T extends Record<infer K, infer V> ? MapCondFn<K, V> :
  never;
export type CollectionFn<T> = CollectionFnOfObj<InferCollectionType<T>>;
export type CollectionCondFn<T> = CollectionCondFnOfObj<InferCollectionType<T>>;
export type CollectionAsyncFnOfObj<T> =
  T extends Set<infer K> ? ArrAsyncFn<K, any> :
  T extends Map<infer K, infer V> ? MapAsyncFn<K, V, any> :
  T extends Array<infer K> ? ArrAsyncFn<K, any> :
  T extends ReadonlyArray<infer K> ? ArrAsyncFn<K, any> :
  T extends Record<infer K, infer V> ? MapAsyncFn<K, V, any> :
  never;
export type CollectionAsyncFn<T> = CollectionAsyncFnOfObj<InferCollectionType<T>>;
export type CollectionAsyncCondFnOfObj<T> =
  T extends Set<infer K> ? ArrAsyncCondFn<K> :
  T extends Map<infer K, infer V> ? MapAsyncCondFn<K, V> :
  T extends Array<infer K> ? ArrAsyncCondFn<K> :
  T extends ReadonlyArray<infer K> ? ArrAsyncCondFn<K> :
  T extends Record<infer K, infer V> ? MapAsyncCondFn<K, V> :
  never;
export type CollectionAsyncCondFn<T> = CollectionAsyncCondFnOfObj<InferCollectionType<T>>;
export type CollectionReduceFn<T, R> =
  T extends Set<infer K> ? ArrAccFn<K, R> :
  T extends Map<infer K, infer V> ? MapAccFn<K, V, R> :
  T extends Array<infer K> ? ArrAccFn<K, R> :
  T extends ReadonlyArray<infer K> ? ArrAccFn<K, R> :
  T extends Record<infer K, infer V> ? MapAccFn<K, V, R> :
  never;
export type CollectionAsyncReduceFn<T, R> =
  T extends Set<infer K> ? ArrAsyncAccFn<K, R> :
  T extends Map<infer K, infer V> ? MapAsyncAccFn<K, V, R> :
  T extends Array<infer K> ? ArrAsyncAccFn<K, R> :
  T extends ReadonlyArray<infer K> ? ArrAsyncAccFn<K, R> :
  T extends Record<infer K, infer V> ? MapAsyncAccFn<K, V, R> :
  never;

export type Simplify<T> = { [K in keyof T]: T[K] } & {}





export type Head<T extends ReadonlyArray<any>> =
  ((...t: T) => any) extends ((_: infer A, ...tail: any) => any)
  ? A
  : never;

export type Tail<T extends ReadonlyArray<any>> =
  ((...t: T) => any) extends ((_: any, ...tail: infer TT) => any)
  ? TT
  : never;

export type HasTail<T extends ReadonlyArray<any>> =
  T extends []
  ? false
  : true;

export type ObjectInfer<O> =
  O extends { a: infer A }
  ? A
  : never;

export type MapValueTypes<L, T extends ReadonlyArray<any>, U extends ReadonlyArray<any> = readonly []> =
  HasTail<T> extends true ?
  MapValueTypes<L, Tail<T>, [...U, L[Head<T>]]> :
  U;
