import type { Simplify } from "./types";

export function withDefaults<T extends Record<any, any>, D extends Partial<T>>(org: T, defaults: D) {
  return { ...org, ...defaults } as Simplify<T & D>
}