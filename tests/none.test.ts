import { describe, it, expect } from "bun:test"
import { none, noneAsync } from ".."
import { pipe } from "remeda"

describe("none", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = none(a, v => v > 3)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      none(v => v > 3),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = none(a, (_, i) => i > 3)
    expect(resultA3).toEqual(true)
    
    const b = new Set([1, 2, 3])
    const resultB = none(b, v => v > 3)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      none(v => v > 3),
    )
    expect(resultB2).toEqual(true)
    
    const c = ['onur', 38] as const
    const resultC = none(c, v => v === 38)
    expect(resultC).toEqual(false)
    const resultC2 = pipe(
      c,
      none(v => v === 38),
    )
    expect(resultC2).toEqual(false)
  })
  
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = none(a,({ value: v }) => v > 3)
    expect(resultA).toEqual(true)
    const resultA2 = pipe(
      a,
      none(({ value: v }) => v > 3),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = none(b, ({ key }) => key.length > 3)
    expect(resultB).toEqual(true)
    const resultB2 = pipe(
      b,
      none(({ key }) => key.length > 3),
    )
    expect(resultB2).toEqual(true)
  })
})

describe("noneAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await noneAsync(a, async v => v > 3)
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      noneAsync(async v => v > 3),
    )
    expect(resultA2).toEqual(true)
    const resultA3 = await noneAsync(a, async (_, i) => i > 3)
    expect(resultA3).toEqual(true)
  })

  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = await noneAsync(a, async ({ value: v }) => v > 3)
    expect(resultA).toEqual(true)
    const resultA2 = await pipe(
      a,
      noneAsync(async ({ value: v }) => v > 3),
    )
    expect(resultA2).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = await noneAsync(b, async ({ key }) => key.length > 3)
    expect(resultB).toEqual(true)
    const resultB2 = await pipe(
      b,
      noneAsync(async ({ key }) => key.length > 3),
    )
    expect(resultB2).toEqual(true)
  })
})