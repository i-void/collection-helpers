import { describe, it, expect } from "bun:test"
import { first, last, includes, exclude, compact, isEmpty, size, zip, zip3, reverse, flatten, sum, take, min, max, sortBy } from ".."
import { pipe } from "remeda"

describe("first", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = first(a)
    expect(resultA).toEqual(1)
    const resultA2 = pipe(
      a,
      first,
    )
    expect(resultA2).toEqual(1)
    
    const b = new Set([1, 2, 3])
    const resultB = first(b)
    expect(resultB).toEqual(1)
    const resultB2 = pipe(
      b,
      first,
    )
    expect(resultB2).toEqual(1)
  })
})

describe("last", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = last(a)
    expect(resultA).toEqual(3)
    const resultA2 = pipe(
      a,
      last,
    )
    expect(resultA2).toEqual(3)
    
    const b = new Set([1, 2, 3])
    const resultB = last(b)
    expect(resultB).toEqual(3)
    const resultB2 = pipe(
      b,
      last,
    )
    expect(resultB2).toEqual(3)
  })
})

describe("includes", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = pipe(a, includes(2)) 
    expect(resultA).toEqual(true)
    const resultA2 = includes(a, 2)
    expect(resultA2).toEqual(true)
    
    const b = new Set([1, 2, 3])
    const resultB = pipe(b, includes(2)) 
    expect(resultB).toEqual(true)
    const resultB2 = includes(b, 4)
    expect(resultB2).toEqual(false)
  })
})

describe("exclude", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = pipe(a, exclude([2])) 
    expect(resultA).toEqual([1, 3])
    const resultA2 = exclude(a, [2])
    expect(resultA2).toEqual([1, 3])
    
    const b = new Set([1, 2, 3])
    const resultB = pipe(b, exclude([2])) 
    expect(resultB).toEqual(new Set([1, 3]))
    const resultB2 = exclude(b, [2])
    expect(resultB2).toEqual(new Set([1, 3]))
  })
})


describe("compact", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3, null, undefined]
    const resultA = compact(a)
    expect(resultA).toEqual([1, 2, 3])
    const resultA2 = pipe( a, compact)
    expect(resultA2).toEqual([1, 2, 3])
    
    const b = new Set([1, 2, 3, null, undefined])
    const resultB = compact(b)
    expect(resultB).toEqual(new Set([1, 2, 3]))
  })
})

describe("isEmpty", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = isEmpty(a)
    expect(resultA).toEqual(false)
    const resultA2 = pipe( a, isEmpty)
    expect(resultA2).toEqual(false)
    
    const b = new Set([1, 2, 3])
    const resultB = isEmpty(b)
    expect(resultB).toEqual(false)
  })
})

describe("size", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = size(a)
    expect(resultA).toEqual(3)
    const resultA2 = pipe( a, size)
    expect(resultA2).toEqual(3)
    
    const b = new Set([1, 2, 3])
    const resultB = size(b)
    expect(resultB).toEqual(3)
  })
})

describe("zip", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = zip(a, [4, 5, 6])
    expect(resultA).toEqual([[1, 4], [2, 5], [3, 6]])
    const resultA2 = pipe( a, zip([4, 5, 6]))
    expect(resultA2).toEqual([[1, 4], [2, 5], [3, 6]])
    
    const b = new Set([1, 2, 3])
    const resultB = pipe(b, zip([4, 5, 6]))
    expect(resultB).toEqual(new Set([[1, 4], [2, 5], [3, 6]]))
  })
})

describe("zip3", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = zip3(a, [4, 5, 6], [7, 8, 9])
    expect(resultA).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]])
    const resultA2 = pipe( a, zip3([4, 5, 6], [7, 8, 9]))
    expect(resultA2).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]])
    
    const b = new Set([1, 2, 3])
    const resultB = pipe(b, zip3([4, 5, 6], [7, 8, 9]))
    expect(resultB).toEqual(new Set([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))
  })
})


describe("reverse", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = reverse(a)
    expect(resultA).toEqual([3, 2, 1])
    const resultA2 = pipe( a, reverse)
    expect(resultA2).toEqual([3, 2, 1])
    
    const b = new Set([1, 2, 3])
    const resultB = reverse(b)
    expect(resultB).toEqual(new Set([3, 2, 1]))
  })
})

describe("flatten", () => {
  it("should map arrLike", () => {
    const a = [[1, 2], [3, [4]]]
    const resultA = flatten(a)
    expect(resultA).toEqual([1, 2, 3, 4])
    const resultA2 = pipe( a, flatten)
    expect(resultA2).toEqual([1, 2, 3, 4])
    
    const b = new Set([new Set([1, 2]), [3], 4])
    const resultB = flatten(b)
    expect(resultB).toEqual(new Set([1, 2, 3, 4]))
  })
})

describe("sum", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = sum(a)
    expect(resultA).toEqual(6)
    const resultA2 = pipe( a, sum)
    expect(resultA2).toEqual(6)
    
    const b = new Set([1, 2, 3])
    const resultB = sum(b)
    expect(resultB).toEqual(6)
  })
})

describe("take", () => {
  it("should map arrLike", () => {
    const a = [1, 2, 3]
    const resultA = take(a, 2)
    expect(resultA).toEqual([1, 2])
    const resultA2 = pipe( a, take(2))
    expect(resultA2).toEqual([1, 2])
    
    const b = new Set([1, 2, 3])
    const resultB = take(b, 2)
    expect(resultB).toEqual(new Set([1, 2]))
    const resultB2 = pipe(b, take(2))
    expect(resultB2).toEqual(new Set([1, 2]))

    const c = ['a', 'b', 'c'] as const
    const resultC = take(c, 2)
    expect(resultC).toEqual(['a', 'b'])
  })
})

describe("min", () => {
  it("should map arrLike", () => {
    const a = [2, 3, 1, 4]
    const resultA = min(a)
    expect(resultA).toEqual(1)
    const resultA2 = pipe(a, min)
    expect(resultA2).toEqual(1)
    
    const b = new Set([1, 2, 3])
    const resultB = min(b)
    expect(resultB).toEqual(1)
  })
})

describe("max", () => {
  it("should map arrLike", () => {
    const a = [2, 3, 4, 1]
    const resultA = max(a)
    expect(resultA).toEqual(4)
    const resultA2 = pipe(a, max)
    expect(resultA2).toEqual(4)
    
    const b = new Set([1, 2, 3])
    const resultB = max(b)
    expect(resultB).toEqual(3)
  })
})

describe("sort", () => {
  it("should map arrLike", () => {
    const a = [2, 3, 1, 4]
    const resultA = sortBy(a, (a, b) => a - b)
    expect(resultA).toEqual([1, 2, 3, 4])
    const resultA2 = pipe(a, sortBy((a, b) => a - b))
    expect(resultA2).toEqual([1, 2, 3, 4])
    
    const b = new Set([1, 2, 3])
    const resultB = sortBy(b, (a, b) => a - b)
    expect(resultB).toEqual(new Set([1, 2, 3]))
  })
})