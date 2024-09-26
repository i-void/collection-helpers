import { describe, it, expect } from "bun:test"
import { find, findAsync } from ".."
import { pipe } from "remeda"

describe("find", () => {
  it("should find arrLike", () => {
    const a = [1, 2, 3]
    const result = find(a, v => v === 2)
    const resultA = pipe(
      a,
      find(v => v === 2),
    )
    expect(result).toEqual(2)
    expect(resultA).toEqual(2)
    
    const b = new Set([1, 2, 3])
    const result2 = find(b, v => v === 2)
    const result2B = pipe(
      b,
      find(v => v === 2),
    )
    expect(result2).toEqual(2)
    expect(result2B).toEqual(2)
    
    const c = ['onur', 38] as const
    const result3 = find(c, v => v === 'onur')
    const result3C = pipe(
      c,
      find(v => v === 'onur'),
    )
    expect(result3).toEqual('onur')
    expect(result3C).toEqual('onur')
  })
  
  it("should find mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = find(a,({ value: v }) => v === 2)
    const resultA = pipe(
      a,
      find(({ value: v }) => v === 2),
    )
    const resultB = find(a,({ key }) => key === 'd')
    expect(result).toEqual(new Map([['b', 2]]))
    expect(resultA).toEqual(new Map([['b', 2]]))
    expect(resultB === undefined).toEqual(true)
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = find(b, ({ key }) => key === 'b')
    expect(result2).toEqual({ 'b': 2 })
    const result3 = find(b, ({ value }) => value === 2)
    expect(result3).toEqual({ 'b': 2 })
    const result2B = pipe(
      b,
      find(({ key }) => key === 'b'),
    )
    expect(result2B).toEqual({ 'b': 2 })
    const result3B = pipe(
      b,
      find(({ value }) => value === 2),
    )
    expect(result3B).toEqual({ 'b': 2 })
  })
})


describe("findAsync", () => {
  it("should find arrLike", async () => {
    const a = [1, 2, 3]
    const result = await findAsync(a, async v => v === 2)
    const resultA = await pipe(
      a,
      findAsync(async v => v === 2),
    )
    expect(result).toEqual(2)
    expect(resultA).toEqual(2)
    
    const b = new Set([1, 2, 3])
    const result2 = await findAsync(b, async v => v === 2)
    const result2B = await pipe(
      b,
      findAsync(async v => v === 2),
    )
    expect(result2).toEqual(2)
    expect(result2B).toEqual(2)
    
    const c = ['onur', 38] as const
    const result3 = await findAsync(c, async v => v === 'onur')
    const result3C = await pipe(
      c,
      findAsync(async v => v === 'onur'),
    )
    const result4 = await findAsync(c, async (_, i) => i === 0)
    const result5 = await findAsync(c, async (v) => v === 'unknown' as string)
    expect(result3).toEqual('onur')
    expect(result3C).toEqual('onur')
    expect(result4).toEqual('onur')
    expect(result5 === undefined).toEqual(true)
  })
  
  it("should find mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await findAsync(a, async({ value: v }) => v === 2)
    const resultA = await pipe(
      a,
      findAsync(async({ value: v }) => v === 2),
    )
    expect(result).toEqual(new Map([['b', 2]]))
    expect(resultA).toEqual(new Map([['b', 2]]))
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = await findAsync(b, async({ key }) => Promise.resolve(key === 'b'))
    expect(result2).toEqual({ b: 2 })
    const result3 = await findAsync(b, async({ value }) => value === 2)
    expect(result3).toEqual({ b: 2 })
    const result2B = await pipe(
      b,
      findAsync(async({ key }) => key === 'b')
    )
    expect(result2B).toEqual({ b: 2 })
    const result3B = await pipe(
      b,
      findAsync(async ({ value }) => value === 2),
    )
    expect(result3B).toEqual({ b: 2 })
  })
})