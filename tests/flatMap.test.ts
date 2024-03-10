import { describe, it, expect } from "bun:test"
import { flatMap, flatMapAsync } from ".."
import { pipe } from "remeda"


describe("flatMap", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = flatMap(a, v => [v, v])
    expect(resultA).toEqual([1, 1, 2, 2, 3, 3])
    const resultA2 = pipe(
      a,
      flatMap(v => [v, v]),
    )
    expect(resultA2).toEqual([1, 1, 2, 2, 3, 3])
    const resultA3 = flatMap(a, (_, i) => [i, i])
    expect(resultA3).toEqual([0, 0, 1, 1, 2, 2])
    
    const b = new Set([1, 2, 3])
    const resultB = flatMap(b, v => [v, v])
    expect(resultB).toEqual([1, 1, 2, 2, 3, 3])
    const resultB2 = pipe(
      b,
      flatMap(v => [v, v]),
    )
    expect(resultB2).toEqual([1, 1, 2, 2, 3, 3])
    
    const c = ['onur', 38] as const
    const resultC = flatMap(c, v => [v, v])
    expect(resultC).toEqual(['onur', 'onur', 38, 38])
    const resultC2 = pipe(
      c,
      flatMap(v => [v, v]),
    )
    expect(resultC2).toEqual(['onur', 'onur', 38, 38])
  })
}) 

describe("flatMapAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await flatMapAsync(a, async v => [v, v])
    expect(resultA).toEqual([1, 1, 2, 2, 3, 3])
    const resultA2 = await pipe(
      a,
      flatMapAsync(async v => [v, v]),
    )
    expect(resultA2).toEqual([1, 1, 2, 2, 3, 3])
    const resultA3 = await flatMapAsync(a, async (_, i) => [i, i])
    expect(resultA3).toEqual([0, 0, 1, 1, 2, 2])
    
    const b = new Set([1, 2, 3])
    const resultB = await flatMapAsync(b, async v => [v, v])
    expect(resultB).toEqual([1, 1, 2, 2, 3, 3])
    const resultB2 = await pipe(
      b,
      flatMapAsync(async v => [v, v]),
    )
    expect(resultB2).toEqual([1, 1, 2, 2, 3, 3])
    
    const c = ['onur', 38] as const
    const resultC = await flatMapAsync(c, async v => [v, v])
    expect(resultC).toEqual(['onur', 'onur', 38, 38])
    const resultC2 = await pipe(
      c,
      flatMapAsync(async v => [v, v]),
    )
    expect(resultC2).toEqual(['onur', 'onur', 38, 38])
  })
})