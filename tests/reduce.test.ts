import { describe, it, expect } from 'bun:test'
import { reduce, reduceAsync, reduceWhen, reduceWhenAsync } from '..'
import { pipe } from 'remeda'

describe("reduce", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = reduce(a, (acc, v) => acc + v, 0)
    expect(resultA).toEqual(6)
    const resultA2 = pipe(
      a,
      reduce((acc, v) => acc + v, 0),
    )
    expect(resultA2).toEqual(6)
    const resultA3 = reduce(a, (acc, _, i) => acc + i, 0)
    expect(resultA3).toEqual(3)
    
    const b = new Set([1, 2, 3])
    const resultB = reduce(b, (acc, v) => `${acc} + ${v}`, '')
    expect(resultB).toEqual(' + 1 + 2 + 3')
    const resultB2 = pipe(
      b,
      reduce((acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultB2).toEqual(' + 1 + 2 + 3')
    
    const c = ['onur', 38] as const
    const resultC = reduce(c, (acc, v) => `${acc} + ${v}`, '')
    expect(resultC).toEqual(' + onur + 38')
    const resultC2 = pipe(
      c,
      reduce((acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultC2).toEqual(' + onur + 38')
  })

  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = reduce(a, (acc, { value: v }) => acc + v, 0)
    expect(resultA).toEqual(6)
    const resultA2 = pipe(
      a,
      reduce((acc, { value: v }) => acc + v, 0),
    )
    expect(resultA2).toEqual(6)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = reduce(b, (acc, { key }) => `${acc} + ${key}`, '')
    expect(resultB).toEqual(' + a + b + c')
    const resultB2 = pipe(
      b,
      reduce((acc, { key }) => `${acc} + ${key}`, ''),
    )
    expect(resultB2).toEqual(' + a + b + c')
  })
})


describe("reduceAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await reduceAsync(a, async (acc, v) => acc + v, 0)
    expect(resultA).toEqual(6)
    const resultA2 = await pipe(
      a,
      reduceAsync(async (acc, v) => acc + v, 0),
    )
    expect(resultA2).toEqual(6)
    const resultA3 = await reduceAsync(a, async (acc, _, i) => acc + i, 0)
    expect(resultA3).toEqual(3)
    
    const b = new Set([1, 2, 3])
    const resultB = await reduceAsync(b, async (acc, v) => `${acc} + ${v}`, '')
    expect(resultB).toEqual(' + 1 + 2 + 3')
    const resultB2 = await pipe(
      b,
      reduceAsync(async (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultB2).toEqual(' + 1 + 2 + 3')
    
    const c = ['onur', 38] as const
    const resultC = await reduceAsync(c, async (acc, v) => `${acc} + ${v}`, '')
    expect(resultC).toEqual(' + onur + 38')
    const resultC2 = await pipe(
      c,
      reduceAsync(async (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultC2).toEqual(' + onur + 38')
  })

  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = await reduceAsync(a, async (acc, { value: v }) => acc + v, 0)
    expect(resultA).toEqual(6)
    const resultA2 = await pipe(
      a,
      reduceAsync(async (acc, { value: v }) => acc + v, 0),
    )
    expect(resultA2).toEqual(6)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = await reduceAsync(b, async (acc, { key }) => `${acc} + ${key}`, '')
    expect(resultB).toEqual(' + a + b + c')
    const resultB2 = await pipe(
      b,
      reduceAsync(async (acc, { key }) => `${acc} + ${key}`, ''),
    )
    expect(resultB2).toEqual(' + a + b + c')
  })
})

describe("reduceWhen", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = reduceWhen(a, v => v > 1, (acc, v) => acc + v, 0)
    expect(resultA).toEqual(5)
    const resultA2 = pipe(
      a,
      reduceWhen(v => v > 1, (acc, v) => acc + v, 0),
    )
    expect(resultA2).toEqual(5)
    const resultA3 = reduceWhen(a, (_, i) => i > 1, (acc, _, i) => acc + i, 0)
    expect(resultA3).toEqual(2)

    const b = new Set([1, 2, 3])
    const resultB = reduceWhen(b, v => v > 1, (acc, v) => `${acc} + ${v}`, '')
    expect(resultB).toEqual(' + 2 + 3')
    const resultB2 = pipe(
      b,
      reduceWhen(v => v > 1, (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultB2).toEqual(' + 2 + 3')

    const c = ['onur', 38] as const
    const resultC = reduceWhen(c, v => typeof v === 'string', (acc, v) => `${acc} + ${v}`, '')
    expect(resultC).toEqual(' + onur')
    const resultC2 = pipe(
      c,
      reduceWhen(v => typeof v === 'string', (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultC2).toEqual(' + onur')
  })
  
  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = reduceWhen(a, ({ value: v }) => v > 1, (acc, { value: v }) => acc + v, 0)
    expect(resultA).toEqual(5)
    const resultA2 = pipe(
      a,
      reduceWhen(({ value: v }) => v > 1, (acc, { value: v }) => acc + v, 0),
    )
    expect(resultA2).toEqual(5)
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = reduceWhen(b, ({ value }) => value > 1, (acc, { key }) => `${acc} + ${key}`, '')
    expect(resultB).toEqual(' + b + c')
    const resultB2 = pipe(
      b,
      reduceWhen(({ value }) => value > 1, (acc, { key }) => `${acc} + ${key}`, ''),
    )
    expect(resultB2).toEqual(' + b + c')
  })
})

describe("reduceWhenAsync", () => {
  it("should map arrLike", async () => {
    const a = [1, 2, 3]
    const resultA = await reduceWhenAsync(a, async v => v > 1, async (acc, v) => acc + v, 0)
    expect(resultA).toEqual(5)
    const resultA2 = await pipe(
      a,
      reduceWhenAsync(async v => v > 1, async (acc, v) => acc + v, 0),
    )
    expect(resultA2).toEqual(5)
    const resultA3 = await reduceWhenAsync(a, async (_, i) => i > 1, async (acc, _, i) => acc + i, 0)
    expect(resultA3).toEqual(2)

    const b = new Set([1, 2, 3])
    const resultB = await reduceWhenAsync(b, async v => v > 1, async (acc, v) => `${acc} + ${v}`, '')
    expect(resultB).toEqual(' + 2 + 3')
    const resultB2 = await pipe(
      b,
      reduceWhenAsync(async v => v > 1, async (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultB2).toEqual(' + 2 + 3')

    const c = ['onur', 38] as const
    const resultC = await reduceWhenAsync(c, async v => typeof v === 'string', async (acc, v) => `${acc} + ${v}`, '')
    expect(resultC).toEqual(' + onur')
    const resultC2 = await pipe(
      c,
      reduceWhenAsync(async v => typeof v === 'string', async (acc, v) => `${acc} + ${v}`, ''),
    )
    expect(resultC2).toEqual(' + onur')
  })
  
  it("should map mapLike", async () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = await reduceWhenAsync(a, async ({ value: v }) => v > 1, async (acc, { value: v }) => acc + v, 0)
    expect(resultA).toEqual(5)
    const resultA2 = await pipe(
      a,
      reduceWhenAsync(async ({ value: v }) => v > 1, async (acc, { value: v }) => acc + v, 0),
    )
    expect(resultA2).toEqual(5)

    const b = { a: 1, b: 2, c: 3 }
    const resultB = await reduceWhenAsync(b, async ({ value }) => value > 1, async (acc, { key }) => `${acc} + ${key}`, '')
    expect(resultB).toEqual(' + b + c')
    const resultB2 = await pipe(
      b,
      reduceWhenAsync(async ({ value }) => value > 1, async (acc, { key }) => `${acc} + ${key}`, ''),
    )

    expect(resultB2).toEqual(' + b + c')
  })
})
