import { describe, it, expect } from "bun:test"
import { List } from "../src/List"

describe("List", () => {
  describe("creation and conversion", () => {
    it("should create List from array", () => {
      const list = List.new([1, 2, 3])
      expect(list.items).toEqual([1, 2, 3])
    })

    it("should create List from array using fromArray", () => {
      const list = List.fromArray([1, 2, 3])
      expect(list.items).toEqual([1, 2, 3])
    })

    it("should create List from Set", () => {
      const set = new Set([1, 2, 3])
      const list = List.fromSet(set)
      expect(list.items).toEqual([1, 2, 3])
    })

    it("should create range", () => {
      const list = List.range(1, 5)
      expect(list.items).toEqual([1, 2, 3, 4])
    })

    it("should create range inclusive", () => {
      const list = List.rangeInclusive(1, 5)
      expect(list.items).toEqual([1, 2, 3, 4, 5])
    })

    it("should create range with step", () => {
      const list = List.range(0, 10, 2)
      expect(list.items).toEqual([0, 2, 4, 6, 8])
    })

    it("should repeat item", () => {
      const list = List.repeat('a', 3)
      expect(list.items).toEqual(['a', 'a', 'a'])
    })

    it("should convert to array", () => {
      const list = List.new([1, 2, 3])
      expect(list.toArray()).toEqual([1, 2, 3])
    })

    it("should convert to Set", () => {
      const list = List.new([1, 2, 3, 2])
      const set = list.toSet()
      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(true)
      expect(set.has(3)).toBe(true)
      expect(set.size).toBe(3)
    })

    it("should convert to JSON", () => {
      const list = List.new([1, 2, 3])
      expect(list.toJson()).toBe('[1,2,3]')
      expect(list.toJson(2)).toBe('[\n  1,\n  2,\n  3\n]')
    })
  })

  describe("map operations", () => {
    it("should map to new List", () => {
      const list = List.new([1, 2, 3])
      const result = list.map(x => x * 2)
      expect(result.items).toEqual([2, 4, 6])
    })

    it("should map to array", () => {
      const list = List.new([1, 2, 3])
      const result = list.toArrayMap(x => x * 2)
      expect(result).toEqual([2, 4, 6])
    })

    it("should map async", async () => {
      const list = List.new([1, 2, 3])
      const result = await list.mapAwait(async x => x * 2)
      expect(result.items).toEqual([2, 4, 6])
    })

    it("should map async all", async () => {
      const list = List.new([1, 2, 3])
      const result = await list.mapAwaitAll(async x => x * 2)
      expect(result.items).toEqual([2, 4, 6])
    })

    it("should map to array async", async () => {
      const list = List.new([1, 2, 3])
      const result = await list.toArrayMapAwait(async x => x * 2)
      expect(result).toEqual([2, 4, 6])
    })
  })

  describe("filtering operations", () => {
    it("should select items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.select(x => x > 3)
      expect(result.items).toEqual([4, 5])
    })

    it("should reject items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.reject(x => x > 3)
      expect(result.items).toEqual([1, 2, 3])
    })

    it("should find item", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.find(x => x > 3)
      expect(result).toBe(4)
    })

    it("should select items async", async () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = await list.selectAwait(async x => x > 3)
      expect(result.items).toEqual([4, 5])
    })

    it("should find item async", async () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = await list.findAwait(async x => x > 3)
      expect(result).toBe(4)
    })

    it("should compact null/undefined values", () => {
      const list = List.new([1, null, 3, undefined, 5])
      const result = list.compact()
      expect(result.items).toEqual([1, 3, 5])
    })
  })

  describe("reduce operations", () => {
    it("should reduce items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.reduce(0, (acc, item) => acc + item)
      expect(result).toBe(15)
    })

    it("should reduce async", async () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = await list.reduceAwait(0, async (acc, item) => acc + item)
      expect(result).toBe(15)
    })
  })

  describe("utility operations", () => {
    it("should get first and last", () => {
      const list = List.new([1, 2, 3])
      expect(list.first()).toBe(1)
      expect(list.last()).toBe(3)
    })

    it("should check if empty", () => {
      const emptyList = List.new([])
      const nonEmptyList = List.new([1])
      expect(emptyList.isEmpty()).toBe(true)
      expect(nonEmptyList.isEmpty()).toBe(false)
    })

    it("should get length", () => {
      const list = List.new([1, 2, 3])
      expect(list.length()).toBe(3)
    })

    it("should sort items", () => {
      const list = List.new([3, 1, 4, 1, 5])
      const result = list.sort()
      expect(result.items).toEqual([1, 1, 3, 4, 5])
    })

    it("should sort items desc", () => {
      const list = List.new([3, 1, 4, 1, 5])
      const result = list.sort({ desc: true })
      expect(result.items).toEqual([5, 4, 3, 1, 1])
    })

    it("should sort by function", () => {
      const list = List.new(['apple', 'pie', 'washington'])
      const result = list.sortBy((a, b) => a.length - b.length)
      expect(result.items).toEqual(['pie', 'apple', 'washington'])
    })
  })

  describe("boolean operations", () => {
    it("should check any condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.any(x => x > 4)).toBe(true)
      expect(list.any(x => x > 10)).toBe(false)
    })

    it("should check all condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.all(x => x > 0)).toBe(true)
      expect(list.all(x => x > 3)).toBe(false)
    })

    it("should check none condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.none(x => x > 10)).toBe(true)
      expect(list.none(x => x > 4)).toBe(false)
    })

    it("should check any async", async () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = await list.anyAwait(async x => x > 4)
      expect(result).toBe(true)
    })
  })

  describe("item operations", () => {
    it("should check if has item", () => {
      const list = List.new([1, 2, 3])
      expect(list.has(2)).toBe(true)
      expect(list.has(5)).toBe(false)
    })

    it("should check if has all items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.hasAll(1, 3, 5)).toBe(true)
      expect(list.hasAll(1, 6)).toBe(false)
    })

    it("should get item by index", () => {
      const list = List.new([1, 2, 3])
      expect(list.get(1)).toBe(2)
      expect(list.get(5)).toBeUndefined()
    })

    it("should get item with default", () => {
      const list = List.new([1, 2, 3])
      expect(list.getOr(1, 0)).toBe(2)
      expect(list.getOr(5, 0)).toBe(0)
    })

    it("should set item at index", () => {
      const list = List.new([1, 2, 3])
      const result = list.set(1, 5)
      expect(result.items).toEqual([1, 5, 3])
    })

    it("should add item", () => {
      const list = List.new([1, 2, 3])
      const result = list.add(4)
      expect(result.items).toEqual([1, 2, 3, 4])
    })

    it("should add multiple items", () => {
      const list = List.new([1, 2, 3])
      const result = list.addAll(4, 5, 6)
      expect(result.items).toEqual([1, 2, 3, 4, 5, 6])
    })

    it("should prepend item", () => {
      const list = List.new([2, 3, 4])
      const result = list.prepend(1)
      expect(result.items).toEqual([1, 2, 3, 4])
    })

    it("should insert item at index", () => {
      const list = List.new([1, 3, 4])
      const result = list.insert(1, 2)
      expect(result.items).toEqual([1, 2, 3, 4])
    })

    it("should remove item at index", () => {
      const list = List.new([1, 2, 3, 4])
      const result = list.removeAt(1)
      expect(result.items).toEqual([1, 3, 4])
    })

    it("should omit items", () => {
      const list = List.new([1, 2, 3, 2, 4])
      const result = list.omit(2)
      expect(result.items).toEqual([1, 3, 4])
    })

    it("should omit multiple items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.omitAll(2, 4)
      expect(result.items).toEqual([1, 3, 5])
    })
  })

  describe("mathematical operations", () => {
    it("should sum numeric values", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.sum()).toBe(15)
    })

    it("should calculate average", () => {
      const list = List.new([2, 4, 6])
      expect(list.average()).toBe(4)
    })

    it("should find min and max", () => {
      const list = List.new([3, 1, 5, 2])
      expect(list.min()).toBe(1)
      expect(list.max()).toBe(5)
    })

    it("should find min and max by function", () => {
      const list = List.new(['apple', 'pie', 'washington'])
      expect(list.minBy(x => x.length)).toBe(3)
      expect(list.maxBy(x => x.length)).toBe(10)
    })
  })

  describe("advanced operations", () => {
    it("should get unique items", () => {
      const list = List.new([1, 2, 2, 3, 3, 3])
      const result = list.unique()
      expect(result.items).toEqual([1, 2, 3])
    })

    it("should reverse items", () => {
      const list = List.new([1, 2, 3])
      const result = list.reverse()
      expect(result.items).toEqual([3, 2, 1])
    })

    it("should slice items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.slice(1, 4)
      expect(result.items).toEqual([2, 3, 4])
    })

    it("should take items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.take(3)
      expect(result.items).toEqual([1, 2, 3])
    })

    it("should drop items", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.drop(2)
      expect(result.items).toEqual([3, 4, 5])
    })

    it("should take while condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.takeWhile(x => x < 4)
      expect(result.items).toEqual([1, 2, 3])
    })

    it("should drop while condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.dropWhile(x => x < 3)
      expect(result.items).toEqual([3, 4, 5])
    })

    it("should find index", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.indexOf(3)).toBe(2)
      expect(list.indexOf(6)).toBe(-1)
    })

    it("should find index by condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      expect(list.findIndex(x => x > 3)).toBe(3)
      expect(list.findIndex(x => x > 10)).toBe(-1)
    })

    it("should join items", () => {
      const list = List.new(['a', 'b', 'c'])
      expect(list.join()).toBe('a,b,c')
      expect(list.join('-')).toBe('a-b-c')
    })

    it("should group by function", () => {
      const list = List.new(['apple', 'pie', 'application', 'cat'])
      const groups = list.groupBy(x => x.length)
      expect(groups.get(3)).toEqual(['pie', 'cat'])
      expect(groups.get(5)).toEqual(['apple'])
      expect(groups.get(11)).toEqual(['application'])
    })

    it("should partition by condition", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const [evens, odds] = list.partition(x => x % 2 === 0)
      expect(evens.items).toEqual([2, 4])
      expect(odds.items).toEqual([1, 3, 5])
    })

    it("should flatten nested arrays", () => {
      const list = List.new([[1, 2], [3, 4], [5]])
      const result = list.flatten()
      expect(result.items).toEqual([1, 2, 3, 4, 5])
    })

    it("should flat map", () => {
      const list = List.new([1, 2, 3])
      const result = list.flatMap(x => [x, x * 2])
      expect(result.items).toEqual([1, 2, 2, 4, 3, 6])
    })

    it("should merge with another List", () => {
      const list1 = List.new([1, 2, 3])
      const list2 = List.new([4, 5, 6])
      const result = list1.merge(list2)
      expect(result.items).toEqual([1, 2, 3, 4, 5, 6])
    })

    it("should zip with another List", () => {
      const list1 = List.new([1, 2, 3])
      const list2 = List.new(['a', 'b', 'c'])
      const result = list1.zip(list2)
      expect(result.items).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
    })

    it("should check equality", () => {
      const list1 = List.new([1, 2, 3])
      const list2 = List.new([1, 2, 3])
      const list3 = List.new([1, 2, 4])
      expect(list1.equals(list2)).toBe(true)
      expect(list1.equals(list3)).toBe(false)
    })

    it("should map when condition is met", () => {
      const list = List.new([1, 2, 3, 4, 5])
      const result = list.mapWhen(
        x => x > 3,
        x => x * 2
      )
      expect(result.items).toEqual([1, 2, 3, 8, 10])
    })
  })
})
