import { describe, it, expect } from "bun:test"
import { select, selectAsync } from ".."
import { pipe } from "remeda"


describe("select", () => {
  it("should select arrLike", () => {
    const a = [1, 2, 3]
    const result = select(a, v => v === 2)
    const resultA = pipe(
      a,
      select(v => v === 2),
    )
    expect(result).toEqual([2])
    expect(resultA).toEqual([2])
    
    const b = new Set([1, 2, 3])
    const result2 = select(b, v => v === 2)
    const result2B = pipe(
      b,
      select(v => v === 2),
    )
    expect(result2).toEqual(new Set([2]))
    expect(result2B).toEqual(new Set([2]))
    
    const c = ['onur', 38] as const
    const result3 = select(c, v => v === 'onur')
    const result3C = pipe(
      c,
      select(v => v === 'onur'),
    )
    expect(result3).toEqual(['onur'])
    expect(result3C).toEqual(['onur'])
  })
  
  it("should select mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = select(a,({ value: v }) => v === 2)
    const resultA = pipe(
      a,
      select(({ value: v }) => v === 2),
    )
    expect(result).toEqual(new Map([['b', 2]]))
    expect(resultA).toEqual(new Map([['b', 2]]))
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = select(b, ({ key }) => key === 'b')
    expect(result2).toEqual({ b: 2 })
    const result3 = select(b, ({ value }) => value === 2)
    expect(result3).toEqual({ b: 2 })
    const result2B = pipe(
      b,
      select(({ key }) => key === 'b'),
    )
    expect(result2B).toEqual({ b: 2 })
    const result3B = pipe(
      b,
      select(({ value }) => value === 2),
    )
    expect(result3B).toEqual({ b: 2 })
  })
})


describe("selectAsync", () => {
  it("should select arrLike", async () => {
    const a = [1, 2, 3]
    const result = await selectAsync(a, async v => v === 2)
    const resultA = await pipe(
      a,
      selectAsync(async v => v === 2),
    )
    expect(result).toEqual([2])
    expect(resultA).toEqual([2])
    
    const b = new Set([1, 2, 3])
    const result2 = await selectAsync(b, async v => v === 2)
    const result2B = await pipe(
      b,
      selectAsync(async v => v === 2),
    )
    expect(result2).toEqual(new Set([2]))
    expect(result2B).toEqual(new Set([2]))
    
    const c = ['onur', 38] as const
    const result3 = await selectAsync(c, async v => v === 'onur')
    const result3C = await pipe(
      c,
      selectAsync(async v => v === 'onur'),
    )
    expect(result3).toEqual(['onur'])
    expect(result3C).toEqual(['onur'])
  })
  
  it("should select mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await selectAsync(a, async({ value: v }) => v === 2)
    const resultA = await pipe(
      a,
      selectAsync(async({ value: v }) => v === 2),
    )
    expect(result).toEqual(new Map([['b', 2]]))
    expect(resultA).toEqual(new Map([['b', 2]]))
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = await selectAsync(b, async({ key }) => Promise.resolve(key === 'b'))
    expect(result2).toEqual({ b: 2 })
    const result3 = await selectAsync(b, async({ value }) => value === 2)
    expect(result3).toEqual({ b: 2 })
    const result2B = await pipe(
      b,
      selectAsync(async({ key }) => key === 'b'),
    )
    expect(result2B).toEqual({ b: 2 })
    const result3B = await pipe(
      b,
      selectAsync(async({ value }) => value === 2),
    )
    expect(result3B).toEqual({ b: 2 })
  })
})