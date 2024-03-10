import { describe, it, expect } from "bun:test"
import { foreach, foreachAsync } from ".."
import { pipe } from "remeda"


describe("foreach", () => {
  it("should iterate arrLike", () => {
    const a = [1, 2, 3]
    const resultA: number[] = []
    foreach(a, v => resultA.push(v))
    expect(resultA).toEqual([1, 2, 3])
    const resultA2: number[] = []
    pipe(
      a,
      foreach(v => resultA2.push(v)),
    )
    expect(resultA2).toEqual([1, 2, 3])
    const resultA3: number[] = []
    foreach(a, (_, i) => resultA3.push(i))
    expect(resultA3).toEqual([0, 1, 2])
    
    const b = new Set([1, 2, 3])
    const resultB: number[] = []
    foreach(b, v => resultB.push(v))
    expect(resultB).toEqual([1, 2, 3])
    const resultB2: number[] = []
    pipe(
      b,
      foreach(v => resultB2.push(v)),
    )
    expect(resultB2).toEqual([1, 2, 3])
    
    const c = ['onur', 38] as const
    const resultC: (string | number)[] = []
    foreach(c, v => resultC.push(v))
    expect(resultC).toEqual(['onur', 38])
    const resultC2: (string | number)[] = []
    pipe(
      c,
      foreach(v => resultC2.push(v)),
    )
    expect(resultC2).toEqual(['onur', 38])
  })
})

describe("foreachAsync", () => {
  it("should iterate arrLike", async () => {
    const a = [1, 2, 3]
    const resultA: number[] = []
    await foreachAsync(a, async v => { resultA.push(await Promise.resolve(v)) })
    expect(resultA).toEqual([1, 2, 3])
    const resultA2: number[] = []
    await pipe(
      a,
      foreachAsync(async v => resultA2.push(v)),
    )
    expect(resultA2).toEqual([1, 2, 3])
    const resultA3: number[] = []
    await foreachAsync(a, async (_, i) => { resultA3.push(i) })
    expect(resultA3).toEqual([0, 1, 2])
    
    const b = new Set([1, 2, 3])
    const resultB: number[] = []
    await foreachAsync(b, async v => { resultB.push(v) })
    expect(resultB).toEqual([1, 2, 3])
    const resultB2: number[] = []
    await pipe(
      b,
      foreachAsync(async v => resultB2.push(v)),
    )
    expect(resultB2).toEqual([1, 2, 3])
  })
})