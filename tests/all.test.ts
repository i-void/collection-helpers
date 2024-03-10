import { describe, it, expect } from "bun:test"
import { all, allAsync, isString } from ".."
import { pipe } from "remeda"

describe("all", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = all(a, v => v > 0)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      all(v => v > 0),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = all(a, (_, i) => i < 3)
    expect(resultA3).toEqual(true)
    
    const b = new Set([1, 2, 3])
    const resultB = all(b, v => v > 0)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      all(v => v > 0),
    )
    expect(resultB2).toEqual(true)
    
    const c = ['onur', 38] as const
    const resultC = all(c, v => isString(v))
    expect(resultC).toEqual(false)
    const resultC2 = pipe(
      c,
      all(v => isString(v)),
    )
    expect(resultC2).toEqual(false)
  })
  
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = all(a,({ value: v }) => v > 0)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      all(({ value: v }) => v > 0),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = all(b, ({ key }) => key.length > 0)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      all(({ key }) => key.length > 0),
    )
    expect(resultB2).toEqual(true)
  })
})

describe("allAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await allAsync(a, v => Promise.resolve(v > 0))
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      allAsync(v => Promise.resolve(v > 0)),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = await allAsync(a, (_, i) => Promise.resolve(i < 3))
    expect(resultA3).toEqual(true)
    
    const b = new Set([1, 2, 3])
    const resultB = await allAsync(b, v => Promise.resolve(v > 0))
    expect(resultB).toEqual(true)
    const resultB2 = await pipe(
      b,
      allAsync(v => Promise.resolve(v > 0)),
    )
    expect(resultB2).toEqual(true)
    
    const c = ['onur', 38] as const
    const resultC = await allAsync(c, v => Promise.resolve(isString(v)))
    expect(resultC).toEqual(false)
    const resultC2 = await pipe(
      c,
      allAsync(v => Promise.resolve(isString(v))),
    )
    expect(resultC2).toEqual(false)
  })
  
  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = await allAsync(a,({ value: v }) => Promise.resolve(v > 0))
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      allAsync(({ value: v }) => Promise.resolve(v > 0)),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = await allAsync(b, ({ key }) => Promise.resolve(key.length > 0))
    expect(resultB).toEqual(true)
    const resultB2 = await pipe(
      b,
      allAsync(({ key }) => Promise.resolve(key.length > 0)),
    )
    expect(resultB2).toEqual(true)
  })
})