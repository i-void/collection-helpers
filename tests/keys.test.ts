import { describe, it, expect } from "bun:test"
import { keys } from ".."
import { pipe } from "remeda"

describe("keys", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = keys(a)
    expect(resultA).toEqual([0, 1, 2])
    const resultA2 = pipe(
      a,
      keys(),
    )
    expect(resultA2).toEqual([0, 1, 2])
    
    const b = new Set([6, 9, 3])
    const resultB = keys(b)
    expect(resultB).toEqual([0, 1, 2])
    const resultB2 = pipe(
      b,
      keys(),
    )
    expect(resultB2).toEqual([0, 1, 2])
  })
  
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = keys(a)
    expect(resultA).toEqual(['a', 'b', 'c'])
    const resultA2 = pipe(
      a,
      keys(),
    )
    expect(resultA2).toEqual(['a', 'b', 'c'])
    
    const b = { a: 1, b: 2, c: 3 }
    const resultB = keys(b)
    expect(resultB).toEqual(['a', 'b', 'c'])
    const resultB2 = pipe(
      b,
      keys(),
    )
    expect(resultB2).toEqual(['a', 'b', 'c'])
  })
  
})