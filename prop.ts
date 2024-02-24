/* eslint-disable @typescript-eslint/no-explicit-any */
export const prop = <K extends string | number | symbol, V>(key: K) => (collection: Record<K, V> | Map<K, V>): V | undefined => {
  if (collection instanceof Map) {
    return collection.get(key);
  } else {
    return collection[key];
  }
};
export const props = <K extends string | number | symbol, V>(keys: K[]) => (obj: Record<K, V>) => keys.map(key => obj[key]);