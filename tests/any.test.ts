import { describe, it, expect } from "bun:test"
import { any, anyAsync, isString } from ".."
import { pipe } from "remeda"

describe("any", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = any(a, v => v > 0)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      any(v => v > 0),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = any(a, (_, i) => i < 3)
    expect(resultA3).toEqual(true)
    
    const b = new Set([1, 2, 3])
    const resultB = any(b, v => v > 0)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      any(v => v > 0),
    )
    expect(resultB2).toEqual(true)
    
    const c = ['onur', 38] as const
    const resultC = any(c, v => isString(v))
    expect(resultC).toEqual(true)
    const resultC2 = pipe(
      c,
      any(v => isString(v)),
    )
    expect(resultC2).toEqual(true)
  })
  
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = any(a,({ value: v }) => v > 0)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      any(({ value: v }) => v > 0),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = any(b, ({ key }) => key.length > 0)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      any(({ key }) => key.length > 0),
    )
    expect(resultB2).toEqual(true)
  })
})

describe("anyAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await anyAsync(a, v => v > 2)
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      anyAsync(v => v > 0),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = await anyAsync(a, (v) => v < 1)
    expect(resultA3).toEqual(false)
    
    const b = new Set([1, 2, 3])
    const resultB = await anyAsync(b, v => v > 2)
    expect(resultB).toEqual(true)
    const resultB2 = await pipe(
      b,
      anyAsync(v => v > 0),
    )
    expect(resultB2).toEqual(true)
    
    const c = ['onur', 38] as const
    const resultC = await anyAsync(c, v => isString(v))
    expect(resultC).toEqual(true)
    const resultC2 = await pipe(
      c,
      anyAsync(v => isString(v)),
    )
    expect(resultC2).toEqual(true)
  })
  
  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = await anyAsync(a,({ value: v }) => v > 0)
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      anyAsync(({ value: v }) => v > 0),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = await anyAsync(b, ({ key }) => key.length > 0)
    expect(resultB).toEqual(true)
    const resultB2 = await pipe(
      b,
      anyAsync(({ key }) => key.length > 0),
    )
    expect(resultB2).toEqual(true)
  })
})