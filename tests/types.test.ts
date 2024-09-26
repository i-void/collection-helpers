import { describe, it, expect } from "bun:test"
import { ensure, pipe } from "../src"

describe("ensure", () => {
  it("should return value if it is not undefined or null", () => {
    expect(ensure(1)).toEqual(1)
    expect(ensure("1")).toEqual("1")
    expect(ensure(true)).toEqual(true)
    expect(ensure(false)).toEqual(false)
    expect(ensure({})).toEqual({})
    expect(ensure([])).toEqual([])
    expect(ensure(new Set())).toEqual(new Set())
    expect(ensure(new Map())).toEqual(new Map())
    expect(ensure(new Date())).toEqual(new Date())
    expect(ensure(BigInt(1))).toEqual(BigInt(1))
    
    expect(pipe(1, ensure())).toEqual(1)
  })

  it("should raise error if it is not undefined or null", () => {
    expect(() => ensure(undefined)).toThrow()
    expect(() => ensure(null)).toThrow()
  })
})