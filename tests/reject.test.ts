import { describe, it, expect } from "bun:test"
import { reject, rejectAsync } from ".."
import { pipe } from "remeda"

describe("reject", () => {
  it("should reject arrLike", () => {
    const a = [1, 2, 3]
    const result = reject(a, v => v === 2)
    const resultA = pipe(
      a,
      reject(v => v === 2),
    )
    expect(result).toEqual([1, 3])
    expect(resultA).toEqual([1, 3])
    
    const b = new Set([1, 2, 3])
    const result2 = reject(b, v => v === 2)
    const result2B = pipe(
      b,
      reject(v => v === 2),
    )
    expect(result2).toEqual(new Set([1, 3]))
    expect(result2B).toEqual(new Set([1, 3]))
    
    const c = ['onur', 38] as const
    const result3 = reject(c, v => v === 'onur')
    const result3C = pipe(
      c,
      reject(v => v === 'onur'),
    )
    expect(result3).toEqual([38])
    expect(result3C).toEqual([38])
  })
  
  it("should reject mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = reject(a,({ value: v }) => v === 2)
    const resultA = pipe(
      a,
      reject(({ value: v }) => v === 2),
    )
    expect(result).toEqual(new Map([['a', 1], ['c', 3]]))
    expect(resultA).toEqual(new Map([['a', 1], ['c', 3]]))
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = reject(b, ({ key }) => key === 'b')
    expect(result2).toEqual({ a: 1, c: 3 })
    const result3 = reject(b, ({ value }) => value === 2)
    expect(result3).toEqual({ a: 1, c: 3 })
    const result2B = pipe(
      b,
      reject(({ key }) => key === 'b'),
    )
    expect(result2B).toEqual({ a: 1, c: 3 })
    const result3B = pipe(
      b,
      reject(({ value }) => value === 2),
    )
    expect(result3B).toEqual({ a: 1, c: 3 })
  })
})

describe("rejectAsync", () => {
  it("should reject arrLike", async () => {
    const a = [1, 2, 3]
    const result = await rejectAsync(a, v => Promise.resolve(v === 2))
    const resultA = await pipe(
      a,
      rejectAsync(v => Promise.resolve(v === 2)),
    )
    expect(result).toEqual([1, 3])
    expect(resultA).toEqual([1, 3])
    
    const b = new Set([1, 2, 3])
    const result2 = await rejectAsync(b, v => Promise.resolve(v === 2))
    const result2B = await pipe(
      b,
      rejectAsync(v => Promise.resolve(v === 2)),
    )
    expect(result2).toEqual(new Set([1, 3]))
    expect(result2B).toEqual(new Set([1, 3]))
  })
  
  it("should reject mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await rejectAsync(a,({ value: v }) => Promise.resolve(v === 2))
    const resultA = await pipe(
      a,
      rejectAsync(({ value: v }) => Promise.resolve(v === 2)),
    )
    expect(result).toEqual(new Map([['a', 1], ['c', 3]]))
    expect(resultA).toEqual(new Map([['a', 1], ['c', 3]]))
  })
})