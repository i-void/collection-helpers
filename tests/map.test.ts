import { describe, it, expect } from "bun:test"
import { map, mapAsync, mapWhen, mapWhenAsync, mapWhenAsyncAll } from ".."
import { pipe } from "remeda"

describe("map", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const result = map(a, v => v + 1)
    const resultA = pipe(
      a,
      map(v => v + 1),
    )
    expect(result).toEqual([2, 3, 4])
    expect(resultA).toEqual([2, 3, 4])
    
    const b = new Set([1, 2, 3])
    const result2 = map(b, v => v + 1)
    const result2B = pipe(
      b,
      map(v => v + 1),
    )
    expect(result2).toEqual([2, 3, 4])
    expect(result2B).toEqual([2, 3, 4])
    
    const c = ['onur', 38] as const
    const result3 = map(c, v => v + '1')
    const result3C = pipe(
      c,
      map(v => v + '1'),
    )
    expect(result3).toEqual(['onur1', '381'])
    expect(result3C).toEqual(['onur1', '381'])
  })
  
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = map(a,({ value: v }) => v + 1)
    const resultA = pipe(
      a,
      map(({ value: v }) => v + 1),
    )
    expect(result).toEqual([2, 3, 4])
    expect(resultA).toEqual([2, 3, 4])
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = map(b, ({ key }) => key + '1')
    const result3 = map(b, ({ value }) => value + 1)
    const result2B = pipe(
      b,
      map(({ key }) => key + '1'),
    )
    const result3B = pipe(
      b,
      map(({ value }) => value + 1),
    )
    expect(result2).toEqual(['a1', 'b1', 'c1'])
    expect(result3).toEqual([2, 3, 4])
    expect(result2B).toEqual(['a1', 'b1', 'c1'])
    expect(result3B).toEqual([2, 3, 4])
  })
})

describe("mapAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const result = await mapAsync(a, async v => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapAsync(async v => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([2, 3, 4])
    expect(resultA).toEqual([2, 3, 4])

    const b = new Set([1, 2, 3])
    const result2 = await mapAsync(b, async v => Promise.resolve(v + 1))
    const result2B = await pipe(
      b,
      mapAsync(async v => Promise.resolve(v + 1)),
    )
    expect(result2).toEqual([2, 3, 4])
    expect(result2B).toEqual([2, 3, 4])

    const c = ['onur', 38] as const
    const result3 = await mapAsync(c, async v => Promise.resolve(v + '1'))
    const result3C = await pipe(
      c,
      mapAsync(async v => Promise.resolve(v + '1')),
    )
    expect(result3).toEqual(['onur1', '381'])
    expect(result3C).toEqual(['onur1', '381'])
  })
  
  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await mapAsync(a, async ({ value: v }) => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapAsync(async ({ value: v }) => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([2, 3, 4])
    expect(resultA).toEqual([2, 3, 4])
    
    const b = { a: 1, b: 2, c: 3 }
    const result2 = await mapAsync(b, async ({ key }) => Promise.resolve(key + '1'))
    const result3 = await mapAsync(b, async ({ value }) => Promise.resolve(value + 1))
    const result2B = await pipe(
      b,
      mapAsync(async ({ key }) => Promise.resolve(key + '1')),
    )
    const result3B = await pipe(
      b,
      mapAsync(async ({ value }) => Promise.resolve(value + 1)),
    )
    expect(result2).toEqual(['a1', 'b1', 'c1'])
    expect(result3).toEqual([2, 3, 4])
    expect(result2B).toEqual(['a1', 'b1', 'c1'])
    expect(result3B).toEqual([2, 3, 4])
  })
})

describe("mapWhen", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const result = mapWhen(a, v => v > 2, v => v + 1)
    const resultA = pipe(
      a,
      mapWhen(v => v > 2, v => v + 1),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = new Set([1, 2, 3])
    const result2 = mapWhen(b, v => v > 2, v => v + 1)
    const result2B = pipe(
      b,
      mapWhen(v => v > 2, v => v + 1),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])

    const c = ['onur', 38] as const
    const result3 = mapWhen(c, v => typeof v === 'string', v => v + '1')
    const result3C = pipe(
      c,
      mapWhen(v => typeof v === 'string', v => v + '1'),
    )

    expect(result3).toEqual(['onur1'])
    expect(result3C).toEqual(['onur1'])
  })

  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = mapWhen(a, ({ value: v }) => v > 2, ({ value: v }) => v + 1)
    const resultA = pipe(
      a,
      mapWhen(({ value: v }) => v > 2, ({ value: v }) => v + 1),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = { a: 1, b: 2, c: 3 }
    const result2 = mapWhen(b, ({ value }) => value > 2, ({ value }) => value + 1)
    const result2B = pipe(
      b,
      mapWhen(({ value }) => value > 2, ({ value }) => value + 1),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])
  })
})

describe("mapWhenAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const result = await mapWhenAsync(a, async v => Promise.resolve(v > 2), async v => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapWhenAsync(v => v > 2, async v => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = new Set([1, 2, 3])
    const result2 = await mapWhenAsync(b, v => v > 2, async v => Promise.resolve(v + 1))
    const result2B = await pipe(
      b,
      mapWhenAsync(v => v > 2, async v => Promise.resolve(v + 1)),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])

    const c = ['onur', 38] as const
    const result3 = await mapWhenAsync(c, v => typeof v === 'string', async v => Promise.resolve(v + '1'))
    const result3C = await pipe(
      c,
      mapWhenAsync(v => typeof v === 'string', async v => Promise.resolve(v + '1')),
    )

    expect(result3).toEqual(['onur1'])
    expect(result3C).toEqual(['onur1'])
  })

  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await mapWhenAsync(a, ({ value: v }) => v > 2, async ({ value: v }) => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapWhenAsync(({ value: v }) => v > 2, async ({ value: v }) => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = { a: 1, b: 2, c: 3 }
    const result2 = await mapWhenAsync(b, ({ value }) => value > 2, async ({ value }) => Promise.resolve(value + 1))
    const result2B = await pipe(
      b,
      mapWhenAsync(({ value }) => value > 2, async ({ value }) => Promise.resolve(value + 1)),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])
  })
})


describe("mapWhenAsyncAll", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const result = await mapWhenAsyncAll(a, v => v > 2, async v => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapWhenAsyncAll(v => v > 2, async v => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = new Set([1, 2, 3])
    const result2 = await mapWhenAsyncAll(b, v => v > 2, async v => Promise.resolve(v + 1))
    const result2B = await pipe(
      b,
      mapWhenAsyncAll(v => v > 2, async v => Promise.resolve(v + 1)),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])

    const c = ['onur', 38] as const
    const result3 = await mapWhenAsyncAll(c, v => typeof v === 'string', async v => Promise.resolve(v + '1'))
    const result3C = await pipe(
      c,
      mapWhenAsyncAll(v => typeof v === 'string', async v => Promise.resolve(v + '1')),
    )

    expect(result3).toEqual(['onur1'])
    expect(result3C).toEqual(['onur1'])
  })

  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const result = await mapWhenAsyncAll(a, ({ value: v }) => Promise.resolve(v > 2), async ({ value: v }) => Promise.resolve(v + 1))
    const resultA = await pipe(
      a,
      mapWhenAsyncAll(({ value: v }) => v > 2, async ({ value: v }) => Promise.resolve(v + 1)),
    )
    expect(result).toEqual([4])
    expect(resultA).toEqual([4])

    const b = { a: 1, b: 2, c: 3 }
    const result2 = await mapWhenAsyncAll(b, ({ value }) => value > 2, async ({ value }) => Promise.resolve(value + 1))
    const result2B = await pipe(
      b,
      mapWhenAsyncAll(({ value }) => value > 2, async ({ value }) => Promise.resolve(value + 1)),
    )
    expect(result2).toEqual([4])
    expect(result2B).toEqual([4])
  })
})


