export type TList<T> = {
  items: T[]
}

export interface List<T> extends ReturnType<typeof List.new<T>> {}

export const List = {
  new<T>(initialItems: T[]) {
    return {
      items: initialItems,

      toArray() {
        return [...initialItems]
      },
      toSet() {
        return new Set(initialItems)
      },
      toJson(indent?: number) {
        return JSON.stringify(initialItems, null, indent)
      },
      map<U>(fn: (item: T, index: number) => U) {
        return List.new(
          initialItems.map((item, index) => fn(item, index))
        )
      },
      async mapAwaitAll<U>(
        fn: (item: T, index: number) => U | Promise<U>
      ) {
        return List.new(
          await Promise.all(
            initialItems.map((item, index) => fn(item, index))
          )
        )
      },
      async mapAwait<U>(
        fn: (item: T, index: number) => U | Promise<U>
      ) {
        const result = []
        for (let i = 0; i < initialItems.length; i++) {
          result.push(await fn(initialItems[i], i))
        }
        return List.new(result)
      },
      toArrayMap<U>(fn: (item: T, index: number) => U) {
        return initialItems.map(fn)
      },
      async toArrayMapAwaitAll<U>(
        fn: (item: T, index: number) => U | Promise<U>
      ) {
        return Promise.all(
          initialItems.map((item, index) => fn(item, index))
        )
      },
      async toArrayMapAwait<U>(
        fn: (item: T, index: number) => U | Promise<U>
      ) {
        const result = []
        for (let i = 0; i < initialItems.length; i++) {
          result.push(await fn(initialItems[i], i))
        }
        return result
      },
      select(
        condFn: (item: T, index: number) => boolean
      ) {
        return List.new(
          initialItems.filter((item, index) => condFn(item, index))
        )
      },
      async selectAwaitAll(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        return List.new(
          (
            await Promise.all(
              initialItems.map(
                async (item, index) =>
                  [await condFn(item, index), item] as [boolean, T]
              )
            )
          )
            .filter(([cond]) => cond)
            .map(([, item]) => item)
        )
      },
      async selectAwait(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        const result = []
        for (let i = 0; i < initialItems.length; i++) {
          if (await condFn(initialItems[i], i)) {
            result.push(initialItems[i])
          }
        }
        return List.new(result)
      },
      reject(
        condFn: (item: T, index: number) => boolean
      ) {
        return this.select((item, index) => !condFn(item, index))
      },
      async rejectAwaitAll(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        return this.selectAwaitAll(async (item, index) => !(await condFn(item, index)))
      },
      async rejectAwait(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        return this.selectAwait(async (item, index) => !(await condFn(item, index)))
      },
      find(
        condFn: (item: T, index: number) => boolean
      ) {
        return initialItems.find((item, index) => condFn(item, index))
      },
      async findAwaitAll(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialItems.map(
              async (item, index) =>
                [await condFn(item, index), item] as [boolean, T]
            )
          )
        ).find(([cond]) => cond)?.[1]
      },
      async findAwait(
        condFn: (item: T, index: number) => Promise<boolean>
      ) {
        for (let i = 0; i < initialItems.length; i++) {
          if (await condFn(initialItems[i], i)) {
            return initialItems[i]
          }
        }
      },
      reduce<R>(
        initialValue: R,
        fn: (acc: R, item: T, index: number) => R,
      ) {
        return initialItems.reduce(
          (acc, item, index) => fn(acc, item, index),
          initialValue
        )
      },
      async reduceAwait<R>(
        initialValue: R,
        fn: (acc: R, item: T, index: number) => Promise<R>,
      ) {
        let acc = initialValue
        for (let i = 0; i < initialItems.length; i++) {
          acc = await fn(acc, initialItems[i], i)
        }
        return acc
      },
      first() {
        return initialItems[0] ? initialItems[0] : undefined
      },
      last() {
        return initialItems[initialItems.length - 1] ? initialItems[initialItems.length - 1] : undefined
      },
      sortBy(fn: (a: T, b: T) => number) {
        return List.new([...initialItems].sort(fn))
      },
      async sortByAwait(
        fn: (a: T, b: T) => Promise<number>
      ) {
        return List.new(
          (
            await Promise.all(
              initialItems.map(
                async (item) =>
                  [await fn(item, item), item] as [number, T]
              )
            )
          )
            .sort(([a], [b]) => a - b)
            .map(([, item]) => item)
        )
      },
      sort(options: { desc?: boolean } = {}) {
        return this.sortBy((a, b) => {
          if (a > b) return options.desc ? -1 : 1
          if (a < b) return options.desc ? 1 : -1
          return 0
        })
      },
      compact() {
        return this.select((item) => item !== undefined && item !== null) as List<NonNullable<T>>
      },
      isEmpty() {
        return initialItems.length === 0
      },
      length() {
        return initialItems.length
      },
      forEach(fn: (item: T, index: number) => void) {
        initialItems.forEach((item, index) => fn(item, index))
      },
      async forEachAwait(
        fn: (item: T, index: number) => Promise<void>
      ) {
        for (let i = 0; i < initialItems.length; i++) {
          await fn(initialItems[i], i)
        }
      },
      async forEachAwaitAll(
        fn: (item: T, index: number) => Promise<void>
      ) {
        await Promise.all(
          initialItems.map(
            async (item, index) => await fn(item, index)
          )
        )
      },
      any(
        fn: (item: T, index: number) => boolean
      ) {
        return initialItems.some((item, index) => fn(item, index))
      },
      async anyAwaitAll(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialItems.map(
              async (item, index) =>
                [await fn(item, index), item] as [boolean, T]
            )
          )
        ).some(([cond]) => cond)
      },
      async anyAwait(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        for (let i = 0; i < initialItems.length; i++) {
          if (await fn(initialItems[i], i)) {
            return true
          }
        }
        return false
      },
      none(
        fn: (item: T, index: number) => boolean
      ) {
        return !this.any(fn)
      },
      async noneAwaitAll(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        return !(await this.anyAwaitAll(fn))
      },
      async noneAwait(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        return !(await this.anyAwait(fn))
      },
      all(
        fn: (item: T, index: number) => boolean
      ) {
        return initialItems.every((item, index) => fn(item, index))
      },
      async allAwaitAll(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialItems.map(
              async (item, index) =>
                [await fn(item, index), item] as [boolean, T]
            )
          )
        ).every(([cond]) => cond)
      },
      async allAwait(
        fn: (item: T, index: number) => Promise<boolean>
      ) {
        for (let i = 0; i < initialItems.length; i++) {
          if (!(await fn(initialItems[i], i))) {
            return false
          }
        }
        return true
      },
      has(item: T) {
        return initialItems.includes(item)
      },
      hasAll(...items: T[]) {
        return items.every(item => this.has(item))
      },
      omit(item: T) {
        return List.new(initialItems.filter(i => i !== item))
      },
      omitAll(...items: T[]) {
        return List.new(initialItems.filter(i => !items.includes(i)))
      },
      equals(other: List<T>) {
        if (initialItems.length !== other.items.length) return false
        return initialItems.every((item, i) => other.items[i] === item)
      },
      get(index: number) {
        return initialItems[index]
      },
      getOr<U>(index: number, defaultValue: U) {
        return this.get(index) ?? defaultValue
      },
      set(index: number, item: T) {
        if (index < 0 || index >= initialItems.length) {
          return this
        }
        const newItems = [...initialItems]
        newItems[index] = item
        return List.new(newItems)
      },
      add(item: T) {
        return List.new([...initialItems, item])
      },
      addAll(...items: T[]) {
        return List.new([...initialItems, ...items])
      },
      prepend(item: T) {
        return List.new([item, ...initialItems])
      },
      prependAll(...items: T[]) {
        return List.new([...items, ...initialItems])
      },
      insert(index: number, item: T) {
        const newItems = [...initialItems]
        newItems.splice(index, 0, item)
        return List.new(newItems)
      },
      removeAt(index: number) {
        if (index < 0 || index >= initialItems.length) {
          return this
        }
        const newItems = [...initialItems]
        newItems.splice(index, 1)
        return List.new(newItems)
      },
      empty() {
        return List.new<T>([])
      },
      sum(this: List<number>) {
        return this.reduce(0, (acc, item) => acc + item)
      },
      average(this: List<number>) {
        return this.sum() / this.length()
      },
      min(this: List<number>) {
        return Math.min(...this.items)
      },
      max(this: List<number>) {
        return Math.max(...this.items)
      },
      minBy(fn: (item: T, index: number) => number) {
        return Math.min(...this.toArrayMap(fn))
      },
      maxBy(fn: (item: T, index: number) => number) {
        return Math.max(...this.toArrayMap(fn))
      },
      mapWhen<U>(
        condFn: (item: T, index: number) => boolean,
        fn: (item: T, index: number) => U
      ) {
        return List.new(
          this.items.map(
            (item, index) => condFn(item, index) ? fn(item, index) : item
          )
        )
      },
      async mapWhenAwait<U>(
        condFn: (item: T, index: number) => Promise<boolean> | boolean,
        fn: (item: T, index: number) => Promise<U>
      ) {
        let result = []
        for (let i = 0; i < this.items.length; i++) {
          if (await condFn(this.items[i], i)) {
            result.push(await fn(this.items[i], i))
          } else {
            result.push(this.items[i])
          }
        }
        return List.new(result)
      },
      async mapWhenAwaitAll<U>(
        condFn: (item: T, index: number) => Promise<boolean>,
        fn: (item: T, index: number) => U
      ) {
        return List.new(
          await Promise.all(
            this.items.map(
              async (item, index) => (await condFn(item, index)) ? await fn(item, index) : item
            )
          )
        )
      },
      merge(other: List<T>) {
        return List.new([...this.items, ...other.items])
      },
      zip<U>(other: List<U>) {
        return List.new(this.items.map((item, index) => [item, other.items[index]] as [T, U]))
      },
      unique() {
        return List.new([...new Set(this.items)])
      },
      reverse() {
        return List.new([...this.items].reverse())
      },
      slice(start?: number, end?: number) {
        return List.new(this.items.slice(start, end))
      },
      take(count: number) {
        return this.slice(0, count)
      },
      drop(count: number) {
        return this.slice(count)
      },
      takeWhile(fn: (item: T, index: number) => boolean) {
        const result = []
        for (let i = 0; i < this.items.length; i++) {
          if (fn(this.items[i], i)) {
            result.push(this.items[i])
          } else {
            break
          }
        }
        return List.new(result)
      },
      dropWhile(fn: (item: T, index: number) => boolean) {
        let startIndex = 0
        for (let i = 0; i < this.items.length; i++) {
          if (fn(this.items[i], i)) {
            startIndex = i + 1
          } else {
            break
          }
        }
        return this.slice(startIndex)
      },
      indexOf(item: T) {
        return this.items.indexOf(item)
      },
      lastIndexOf(item: T) {
        return this.items.lastIndexOf(item)
      },
      findIndex(fn: (item: T, index: number) => boolean) {
        return this.items.findIndex(fn)
      },
      findLastIndex(fn: (item: T, index: number) => boolean) {
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (fn(this.items[i], i)) {
            return i
          }
        }
        return -1
      },
      join(separator?: string) {
        return this.items.join(separator)
      },
      groupBy<K>(fn: (item: T, index: number) => K) {
        const groups = new Map<K, T[]>()
        this.items.forEach((item, index) => {
          const key = fn(item, index)
          if (!groups.has(key)) {
            groups.set(key, [])
          }
          groups.get(key)!.push(item)
        })
        return groups
      },
      partition(fn: (item: T, index: number) => boolean) {
        const truthy: T[] = []
        const falsy: T[] = []
        this.items.forEach((item, index) => {
          if (fn(item, index)) {
            truthy.push(item)
          } else {
            falsy.push(item)
          }
        })
        return [List.new(truthy), List.new(falsy)] as const
      },
      flatten<U>(this: List<U[]>) {
        return List.new(this.items.flat())
      },
      flatMap<U>(fn: (item: T, index: number) => U[]) {
        return List.new(this.items.flatMap(fn))
      }
    }
  },

  fromArray<T>(array: T[]) {
    return List.new([...array])
  },

  fromSet<T>(set: Set<T>) {
    return List.new(Array.from(set))
  },

  range(start: number, end: number, step: number = 1) {
    const items = []
    for (let i = start; i < end; i += step) {
      items.push(i)
    }
    return List.new(items)
  },

  rangeInclusive(start: number, end: number, step: number = 1) {
    const items = []
    for (let i = start; i <= end; i += step) {
      items.push(i)
    }
    return List.new(items)
  },

  repeat<T>(item: T, count: number) {
    return List.new(Array(count).fill(item))
  }
}
