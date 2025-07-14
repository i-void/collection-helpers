import { describe, it, expect } from "bun:test"
import { Dict } from "../src/Dict"

describe("Dict", () => {
  describe("creation and conversion", () => {
    it("should create Dict from entries", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    it("should create Dict from object", () => {
      const dict = Dict.fromObj({ a: 1, b: 2, c: 3 })
      expect(dict.entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    it("should create Dict from Map", () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const dict = Dict.fromMap(map)
      expect(dict.entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    it("should convert to object", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.toObj()).toEqual({ a: 1, b: 2, c: 3 })
    })

    it("should convert to Map", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const map = dict.toMap()
      expect(map.get('a')).toBe(1)
      expect(map.get('b')).toBe(2)
      expect(map.get('c')).toBe(3)
    })

    it("should convert to JSON", () => {
      const dict = Dict.new([['a', 1], ['b', 2]])
      expect(dict.toJson()).toBe('[["a",1],["b",2]]')
      expect(dict.toJson(2)).toBe('[\n  [\n    "a",\n    1\n  ],\n  [\n    "b",\n    2\n  ]\n]')
    })
  })

  describe("map operations", () => {
    it("should map values", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.map(({ key, value }) => `${key}:${value}`)
      expect(result).toEqual(['a:1', 'b:2', 'c:3'])
    })

    it("should map values to new Dict", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.mapValues(({ value }) => value * 2)
      expect(result.entries).toEqual([['a', 2], ['b', 4], ['c', 6]])
    })

    it("should map keys to new Dict", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.mapKeys(({ key }) => key.toUpperCase())
      expect(result.entries).toEqual([['A', 1], ['B', 2], ['C', 3]])
    })

    it("should map values async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.mapAwait(async ({ value }) => value * 2)
      expect(result).toEqual([2, 4, 6])
    })

    it("should map values async all", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.mapAwaitAll(async ({ value }) => value * 2)
      expect(result).toEqual([2, 4, 6])
    })

    it("should map values to Dict async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.mapValuesAwait(async ({ value }) => value * 2)
      expect(result.entries).toEqual([['a', 2], ['b', 4], ['c', 6]])
    })

    it("should map keys to Dict async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.mapKeysAwait(async ({ key }) => key.toUpperCase())
      expect(result.entries).toEqual([['A', 1], ['B', 2], ['C', 3]])
    })
  })

  describe("filtering operations", () => {
    it("should select entries", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.select(({ value }) => value > 1)
      expect(result.entries).toEqual([['b', 2], ['c', 3]])
    })

    it("should reject entries", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.reject(({ value }) => value > 1)
      expect(result.entries).toEqual([['a', 1]])
    })

    it("should find entry", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.find(({ value }) => value === 2)
      expect(result).toEqual(['b', 2])
    })

    it("should select entries async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.selectAwait(async ({ value }) => value > 1)
      expect(result.entries).toEqual([['b', 2], ['c', 3]])
    })

    it("should find entry async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.findAwait(async ({ value }) => value === 2)
      expect(result).toEqual(['b', 2])
    })
  })

  describe("reduce operations", () => {
    it("should reduce entries", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.reduce(0, (acc, { value }) => acc + value)
      expect(result).toBe(6)
    })

    it("should reduce values", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.reduceValues(0, (acc, value) => acc + value)
      expect(result).toBe(6)
    })

    it("should reduce keys", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.reduceKeys('', (acc, key) => acc + key)
      expect(result).toBe('abc')
    })

    it("should reduce async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.reduceAwait(0, async (acc, { value }) => acc + value)
      expect(result).toBe(6)
    })
  })

  describe("utility operations", () => {
    it("should get first and last", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.first()).toEqual(['a', 1])
      expect(dict.last()).toEqual(['c', 3])
    })

    it("should check if empty", () => {
      const emptyDict = Dict.new([])
      const nonEmptyDict = Dict.new([['a', 1]])
      expect(emptyDict.isEmpty()).toBe(true)
      expect(nonEmptyDict.isEmpty()).toBe(false)
    })

    it("should get length", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.length()).toBe(3)
    })

    it("should sort by value", () => {
      const dict = Dict.new([['c', 3], ['a', 1], ['b', 2]])
      const result = dict.sort()
      expect(result.entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    it("should sort by value desc", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.sort({ desc: true })
      expect(result.entries).toEqual([['c', 3], ['b', 2], ['a', 1]])
    })

    it("should compact null/undefined values", () => {
      const dict = Dict.new([['a', 1], ['b', null], ['c', 3], ['d', undefined]])
      const result = dict.compact()
      expect(result.entries).toEqual([['a', 1], ['c', 3]])
    })
  })

  describe("boolean operations", () => {
    it("should check any condition", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.any(({ value }) => value > 2)).toBe(true)
      expect(dict.any(({ value }) => value > 5)).toBe(false)
    })

    it("should check all condition", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.all(({ value }) => value > 0)).toBe(true)
      expect(dict.all(({ value }) => value > 1)).toBe(false)
    })

    it("should check none condition", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.none(({ value }) => value > 5)).toBe(true)
      expect(dict.none(({ value }) => value > 2)).toBe(false)
    })

    it("should check any async", async () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = await dict.anyAwait(async ({ value }) => value > 2)
      expect(result).toBe(true)
    })
  })

  describe("key/value operations", () => {
    it("should check if has key", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.hasKey('a')).toBe(true)
      expect(dict.hasKey('d')).toBe(false)
    })

    it("should check if has value", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.hasValue(2)).toBe(true)
      expect(dict.hasValue(5)).toBe(false)
    })

    it("should get value by key", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.get('b')).toBe(2)
      expect(dict.get('d')).toBeUndefined()
    })

    it("should get value with default", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.getOr('b', 0)).toBe(2)
      expect(dict.getOr('d', 0)).toBe(0)
    })

    it("should set value", () => {
      const dict = Dict.new([['a', 1], ['b', 2]])
      const result = dict.set('c', 3)
      expect(result.entries).toEqual([['a', 1], ['b', 2], ['c', 3]])
    })

    it("should update existing value", () => {
      const dict = Dict.new([['a', 1], ['b', 2]])
      const result = dict.set('b', 5)
      expect(result.entries).toEqual([['a', 1], ['b', 5]])
    })

    it("should get keys and values", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.keys()).toEqual(['a', 'b', 'c'])
      expect(dict.values()).toEqual([1, 2, 3])
    })

    it("should omit keys", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.omitKeys('a', 'c')
      expect(result.entries).toEqual([['b', 2]])
    })
  })

  describe("mathematical operations", () => {
    it("should sum numeric values", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      expect(dict.sum()).toBe(6)
    })

    it("should calculate average", () => {
      const dict = Dict.new([['a', 2], ['b', 4], ['c', 6]])
      expect(dict.average()).toBe(4)
    })

    it("should find min and max", () => {
      const dict = Dict.new([['a', 3], ['b', 1], ['c', 5]])
      expect(dict.min()).toBe(1)
      expect(dict.max()).toBe(5)
    })

    it("should find min and max by function", () => {
      const dict = Dict.new([['a', 3], ['b', 1], ['c', 5]])
      expect(dict.minBy(({ value }) => value)).toBe(1)
      expect(dict.maxBy(({ value }) => value)).toBe(5)
    })
  })

  describe("advanced operations", () => {
    it("should merge with another Dict", () => {
      const dict1 = Dict.new([['a', 1], ['b', 2]])
      const dict2 = Dict.new([['c', 3], ['d', 4]])
      const result = dict1.merge(dict2)
      expect(result.entries).toEqual([['a', 1], ['b', 2], ['c', 3], ['d', 4]])
    })

    it("should zip with another Dict", () => {
      const dict1 = Dict.new([['a', 1], ['b', 2]])
      const dict2 = Dict.new([['a', 10], ['b', 20]])
      const result = dict1.zip(dict2)
      expect(result.entries).toEqual([['a', [1, 10]], ['b', [2, 20]]])
    })

    it("should check equality", () => {
      const dict1 = Dict.new([['a', 1], ['b', 2]])
      const dict2 = Dict.new([['a', 1], ['b', 2]])
      const dict3 = Dict.new([['a', 1], ['b', 3]])
      expect(dict1.equals(dict2)).toBe(true)
      expect(dict1.equals(dict3)).toBe(false)
    })

    it("should map when condition is met", () => {
      const dict = Dict.new([['a', 1], ['b', 2], ['c', 3]])
      const result = dict.mapWhen(
        ({ value }) => value > 1,
        ({ value }) => value * 2
      )
      expect(result).toEqual([['a', 1], ['b', 4], ['c', 6]])
    })
  })
})
