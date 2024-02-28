// Checks if a value is a number
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

// Checks if a value is null
export function isNull(value: unknown): value is null {
  return value === null;
}

// Checks if a value is undefined
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

// Checks if a value is either null or undefined
export function isNone(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

export function isDefined<T>(value: T | undefined): value is T {
  return !isUndefined(value);
}

export function isPresent<T>(value: T | undefined | null): value is T {
  return !isNone(value);
}

// Checks if a value is an array
export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

// Checks if a value is a Set
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

// Checks if a value is a Map
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

// Checks if a value is a boolean
export function isBool(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

// Checks if a value is a Record (object with string keys and unknown type of values)
export function isRecord(value: unknown): value is Record<string, unknown>{
  return value !== null
    && value !== undefined 
    && typeof value === 'object' 
    && value.constructor.name === 'Object'
    && !isArray(value) 
    && !isSet(value) 
    && !isMap(value)
    && !isDate(value)
    && !isFunction(value)
  ;
}

// Additional checks

// Checks if a value is a string
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Checks if a value is a function
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

// Checks if a value is a symbol
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

// Checks if a value is a BigInt
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

export function ensure<T>(value: T | undefined | null): T {
  if (isNull(value)) {
    throw new Error('Value is null');
  }
  if (isUndefined(value)) {
    throw new Error('Value is undefined');
  }
  return value;
}