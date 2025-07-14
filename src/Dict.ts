export type TDict<K, V> = {
  entries: [K, V][]
}

export interface Dict<K, V> extends ReturnType<typeof Dict.new<K, V>> {}

export const Dict = {
  new<K, V>(initialEntries: [K, V][]) {
    return {
      entries: initialEntries,

      toObj() {
        return Object.fromEntries(initialEntries) as Record<
          K extends string | number | symbol ? K : never,
          V
        >
      },
      toMap() {
        return new Map(initialEntries)
      },
      toJson(indent?: number) {
        return JSON.stringify(initialEntries, null, indent)
      },
      map<U>(fn: (record: { key: K; value: V }, index: number) => U) {
        return initialEntries.map(([key, value], index) => fn({ key, value }, index))
      },
      async mapAwaitAll<U>(
        fn: (record: { key: K; value: V }, index: number) => U | Promise<U>
      ) {
        return Promise.all(
          initialEntries.map(([key, value], index) => fn({ key, value }, index))
        )
      },
      async mapAwait<U>(
        fn: (record: { key: K; value: V }, index: number) => U | Promise<U>
      ) {
        const result = []
        for (const [key, value] of initialEntries) {
          result.push(await fn({ key, value }, initialEntries.indexOf([key, value])))
        }
        return result
      },
      mapValues<V2>(fn: (record: { key: K; value: V }, index: number) => V2) {
        return Dict.new(
          initialEntries.map(
            ([key, value], index) => [key, fn({ key, value }, index)] as [K, V2]
          )
        )
      },
      async mapValuesAwaitAll<V2>(
        fn: (record: { key: K; value: V }, index: number) => V2 | Promise<V2>
      ) {
        return Dict.new(
          await Promise.all(
            initialEntries.map(
              async ([key, value], index) =>
                [key, await fn({ key, value }, index)] as [K, V2]
            )
          )
        )
      },
      async mapValuesAwait<V2>(
        fn: (record: { key: K; value: V }, index: number) => V2 | Promise<V2>
      ) {
        const result = []
        for (const [key, value] of initialEntries) {
          result.push([
            key,
            await fn({ key, value }, initialEntries.indexOf([key, value]))
          ] as [K, V2])
        }
        return result
      },
      mapKeys<K2>(fn: (record: { key: K; value: V }, index: number) => K2) {
        return Dict.new(
          initialEntries.map(
            ([key, value], index) => [fn({ key, value }, index), value] as [K2, V]
          )
        )
      },
      async mapKeysAwaitAll<K2>(
        fn: (record: { key: K; value: V }, index: number) => K2 | Promise<K2>
      ) {
        return Dict.new(
          await Promise.all(
            initialEntries.map(
              async ([key, value], index) =>
                [await fn({ key, value }, index), value] as [K2, V]
            )
          )
        )
      },
      async mapKeysAwait<K2>(
        fn: (record: { key: K; value: V }, index: number) => K2 | Promise<K2>
      ) {
        const result = []
        for (const [key, value] of initialEntries) {
          result.push([
            await fn({ key, value }, initialEntries.indexOf([key, value])),
            value
          ] as [K2, V])
        }
        return result
      },
      select(
        condFn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return Dict.new(
          initialEntries.filter(([key, value], index) => condFn({ key, value }, index))
        )
      },
      async selectAwaitAll(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return Dict.new(
          (
            await Promise.all(
              initialEntries.map(
                async ([key, value], index) =>
                  [await condFn({ key, value }, index), [key, value]] as [boolean, [K, V]]
              )
            )
          )
            .filter(([cond]) => cond)
            .map(([, entry]) => entry)
        )
      },
      async selectAwait(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        const result = []
        for (const [key, value] of initialEntries) {
          if (await condFn({ key, value }, initialEntries.indexOf([key, value]))) {
            result.push([key, value] as [K, V])
          }
        }
        return result
      },
      reject(
        condFn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return this.select((record, index) => !condFn(record, index))
      },
      async rejectAwaitAll(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return this.selectAwaitAll(async (record, index) => !(await condFn(record, index)))
      },
      async rejectAwait(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return this.selectAwait(async (record, index) => !(await condFn(record, index)))
      },
      find(
        condFn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return initialEntries.find(([key, value], index) => condFn({ key, value }, index))
      },
      async findAwaitAll(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialEntries.map(
              async ([key, value], index) =>
                [await condFn({ key, value }, index), [key, value]] as [boolean, [K, V]]
            )
          )
        ).find(([cond]) => cond)?.[1]
      },
      async findAwait(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        for (const [key, value] of initialEntries) {
          if (await condFn({ key, value }, initialEntries.indexOf([key, value]))) {
            return [key, value] as [K, V]
          }
        }
      },
      reduce<R>(
        initialValue: R,
        fn: (acc: R, record: { key: K; value: V }, index: number) => R,
      ) {
        return initialEntries.reduce(
          (acc, [key, value], index) => fn(acc, { key, value }, index),
          initialValue
        )
      },
      async reduceAwait<R>(
        initialValue: R,
        fn: (acc: R, record: { key: K; value: V }, index: number) => Promise<R>,
      ) {
        let acc = initialValue
        for (const [key, value] of initialEntries) {
          acc = await fn(acc, { key, value }, initialEntries.indexOf([key, value]))
        }
        return acc
      },
      reduceValues<R>(
        initialValue: R,
        fn: (acc: R, value: V, index: number) => R,
      ) {
        return initialEntries.reduce(
          (acc, [_, value], index) => fn(acc, value, index),
          initialValue
        )
      },
      async reduceValuesAwait<R>(
        initialValue: R,
        fn: (acc: R, value: V, index: number) => Promise<R>,
      ) {
        let acc = initialValue
        for (const [_, value] of initialEntries) {
          acc = await fn(acc, value, initialEntries.indexOf([_, value]))
        }
        return acc
      },
      reduceKeys<R>(
        initialValue: R,
        fn: (acc: R, key: K, index: number) => R,
      ) {
        return initialEntries.reduce(
          (acc, [key, _], index) => fn(acc, key, index),
          initialValue
        )
      },
      async reduceKeysAwait<R>(
        initialValue: R,
        fn: (acc: R, key: K, index: number) => Promise<R>,
      ) {
        let acc = initialValue
        for (const [key, _] of initialEntries) {
          acc = await fn(acc, key, initialEntries.indexOf([key, _]))
        }
        return acc
      },
      first() {
        return initialEntries[0] ? initialEntries[0] : undefined
      },
      last() {
        return initialEntries[initialEntries.length - 1] ? initialEntries[initialEntries.length - 1] : undefined
      },
      sortBy(fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number) {
        return Dict.new(initialEntries.sort((a, b) => fn({ key: a[0], value: a[1] }, { key: b[0], value: b[1] })))
      },
      async sortByAwait(
        fn: (a: { key: K, value: V }, b: { key: K, value: V }) => Promise<number>
      ) {
        return Dict.new(
          (
            await Promise.all(
              initialEntries.map(
                async (entry) =>
                  [await fn({ key: entry[0], value: entry[1] }, { key: entry[0], value: entry[1] }), entry] as [number, [K, V]]
              )
            )
          )
            .sort(([a], [b]) => a - b)
            .map(([, entry]) => entry)
        )
      },
      sort(options: { desc?: boolean } = {}) {
        return this.sortBy((a, b) => {
          if (a.value > b.value) return options.desc ? -1 : 1
          if (a.value < b.value) return options.desc ? 1 : -1
          return 0
        })
      },
      compact() {
        return this.select(({ value }) => value !== undefined && value !== null) as Dict<K, NonNullable<V>>
      },
      isEmpty() {
        return initialEntries.length === 0
      },
      length() {
        return initialEntries.length
      },
      forEach(fn: (record: { key: K; value: V }, index: number) => void) {
        initialEntries.forEach(([key, value], index) => fn({ key, value }, index))
      },
      async forEachAwait(
        fn: (record: { key: K; value: V }, index: number) => Promise<void>
      ) {
        for (const [key, value] of initialEntries) {
          await fn({ key, value }, initialEntries.indexOf([key, value]))
        }
      },
      async forEachAwaitAll(
        fn: (record: { key: K; value: V }, index: number) => Promise<void>
      ) {
        await Promise.all(
          initialEntries.map(
            async ([key, value], index) => await fn({ key, value }, index)
          )
        )
      },
      any(
        fn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return initialEntries.some(([key, value], index) => fn({ key, value }, index))
      },
      async anyAwaitAll(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialEntries.map(
              async ([key, value], index) =>
                [await fn({ key, value }, index), [key, value]] as [boolean, [K, V]]
            )
          )
        ).some(([cond]) => cond)
      },
      async anyAwait(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        for (const [key, value] of initialEntries) {
          if (await fn({ key, value }, initialEntries.indexOf([key, value]))) {
            return true
          }
        }
        return false
      },
      none(
        fn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return !this.any(fn)
      },
      async noneAwaitAll(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return !(await this.anyAwaitAll(fn))
      },
      async noneAwait(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return !(await this.anyAwait(fn))
      },
      all(
        fn: (record: { key: K; value: V }, index: number) => boolean
      ) {
        return initialEntries.every(([key, value], index) => fn({ key, value }, index))
      },
      async allAwaitAll(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        return (
          await Promise.all(
            initialEntries.map(
              async ([key, value], index) =>
                [await fn({ key, value }, index), [key, value]] as [boolean, [K, V]]
            )
          )
        ).every(([cond]) => cond)
      },
      async allAwait(
        fn: (record: { key: K; value: V }, index: number) => Promise<boolean>
      ) {
        for (const [key, value] of initialEntries) {
          if (!(await fn({ key, value }, initialEntries.indexOf([key, value])))) {
            return false
          }
        }
        return true
      },
      hasKey(key: K) {
        return initialEntries.some(([k]) => k === key)
      },
      hasValue(value: V) {
        return initialEntries.some(([_, v]) => v === value)
      },
      hasEntry(key: K, value: V) {
        return initialEntries.some(([k, v]) => k === key && v === value)
      },
      hasEntries(...entries: [K, V][]) {
        return entries.every(([k, v]) => this.hasEntry(k, v))
      },
      omitKey(key: K) {
        return Dict.new(initialEntries.filter(([k]) => k !== key))
      },
      omitKeys(...keys: K[]) {
        return Dict.new(initialEntries.filter(([k]) => !keys.includes(k)))
      },
      omitValue(value: V) {
        return Dict.new(initialEntries.filter(([_, v]) => v !== value))
      },
      omitValues(...values: V[]) {
        return Dict.new(initialEntries.filter(([_, v]) => !values.includes(v)))
      },
      omitEntry(key: K, value: V) {
        return Dict.new(initialEntries.filter(([k, v]) => k !== key || v !== value))
      },
      omitEntries(...entries: [K, V][]) {
        return Dict.new(initialEntries.filter(([k, v]) => !entries.some(([k2, v2]) => k === k2 && v === v2)))
      },
      equals(other: Dict<K, V>) {
        if (initialEntries.length !== other.entries.length) return false
        return initialEntries.every(([k, v], i) => other.entries[i][0] === k && other.entries[i][1] === v)
      },
      get(key: K) {
        return initialEntries.find(([k]) => k === key)?.[1]
      },
      getOr<T>(key: K, defaultValue: T) {
        return this.get(key) ?? defaultValue
      },
      set(key: K, value: V) {
        const hasKey = this.hasKey(key)
        if (!hasKey) {
          return Dict.new([...initialEntries, [key, value]])
        }
        return Dict.new(initialEntries.map(([k, v]) => k === key ? [key, value] : [k, v]))
      },
      setAll(entries: [K, V][]) {
        const newEntries = Dict.new(entries)
        return newEntries.reduce(this, (acc, { key, value }) => acc.set(key, value))
      },
      empty() {
        return Dict.new<K, V>([])
      },
      sum(this: Dict<K, number>) {
        return this.reduce(0, (acc, { value }) => acc + value)
      },
      keys() {
        return this.entries.map(([key, _]) => key)
      },
      values() {
        return this.entries.map(([_, value]) => value)
      },
      average(this: Dict<K, number>) {
        return this.sum() / this.length()
      },
      min(this: Dict<K, number>) {
        return Math.min(...this.values())
      },
      max(this: Dict<K, number>) {
        return Math.max(...this.values())
      },
      minBy(fn: (record: { key: K; value: V }, index: number) => number) {
        return Math.min(...this.map(fn))
      },
      maxBy(fn: (record: { key: K; value: V }, index: number) => number) {
        return Math.max(...this.map(fn))
      },
      valuesOf(keys: K[]) {
        return this.select(({ key }) => keys.includes(key)).values()
      },
      keysOf(values: V[]) {
        return this.select(({ value }) => values.includes(value)).keys()
      },
      mapWhen<U>(
        condFn: (record: { key: K; value: V }, index: number) => boolean, 
        fn: (record: { key: K; value: V }, index: number) => U
      ) {
        return this.entries.map(
          ([key, value], index) => condFn({ key, value }, index) ? [key, fn({ key, value }, index)] : [key, value]
        )
      },
      async mapWhenAwait<U>(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean> | boolean, 
        fn: (record: { key: K; value: V }, index: number) => Promise<U>
      ) {
        let result = []
        for (const [key, value] of this.entries) {
          if (await condFn({ key, value }, this.entries.indexOf([key, value]))) {
            result.push([key, await fn({ key, value }, this.entries.indexOf([key, value]))])
          } else {
            result.push([key, value])
          }
        }
        return result
      },
      async mapWhenAwaitAll<U>(
        condFn: (record: { key: K; value: V }, index: number) => Promise<boolean>, 
        fn: (record: { key: K; value: V }, index: number) => U
      ) {
        return await Promise.all(
          this.entries.map(
            async ([key, value], index) => (await condFn({ key, value }, index)) ? [key, await fn({ key, value }, index)] : [key, value]
          )
        )    
      },
      merge(other: Dict<K, V>) {
        return Dict.new([...this.entries, ...other.entries])
      },
      zip(other: Dict<K, V>) {
        return Dict.new(this.entries.map(([key, value], index) => [key, [value, other.entries[index][1]]] as [K, [V, V]]))
      }
    }
  },

  fromObj<K extends string | number | symbol, V>(obj: Record<K, V>) {
    const entries = Object.entries(obj) as [K, V][]
    return Dict.new(entries)
  },

  fromMap<K, V>(map: Map<K, V>) {
    const entries = Array.from(map.entries())
    return Dict.new(entries)
  }
}
