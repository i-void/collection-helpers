import { describe, it, expect } from "bun:test"
import { prop, props } from ".."
import { pipe } from "remeda"

describe("prop", () => {
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = prop(a, 'a')
    expect(resultA).toEqual(1)
    const resultA2 = pipe(
      a,
      prop('a'),
    )
    expect(resultA2).toEqual(1)
    
    const b = { a: 1, b: '2', c: 3 }
    const resultB = prop(b, 'b')
    expect(resultB).toEqual('2')
    const resultB2 = pipe(
      b,
      prop('b'),
    )
    expect(resultB2).toEqual('2')
  })
})

describe("props", () => {
  it("should map mapLike", () => {
    const a = new Map([['a', 1], ['b', 2], ['c', 3]])
    const resultA = props(a, ['a', 'b'])
    expect(resultA).toEqual([ 1, 2 ])
    const resultA2 = pipe(
      a,
      props(['a', 'b']),
    )
    expect(resultA2).toEqual([ 1, 2 ])
    
    const b = { a: 1, b: '2', c: 3 }
    const resultB = props(b, ['a', 'b'] as const)
    expect(resultB).toEqual([ 1, '2' ])
    const resultB2 = pipe(
      b,
      props(['a', 'b'] as const),
    )
    expect(resultB2).toEqual([ 1, '2' ])
  })
})