/**
 * 对象操作工具函数
 */

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 获取对象的嵌套值
 * @param obj 对象
 * @param path 路径
 * @param defaultValue 默认值
 * @returns 值
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue
    }
    current = current[key]
  }
  
  return current === undefined ? defaultValue : current
}

/**
 * 设置对象的嵌套值
 * @param obj 对象
 * @param path 路径
 * @param value 值
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined || current[key] === null) {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

/**
 * 对象合并
 * @param target 目标对象
 * @param sources 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  
  const source = sources.shift()
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source[key] !== undefined) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} })
          }
          deepMerge(target[key], source[key] as any)
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }
  }
  
  return deepMerge(target, ...sources)
}

/**
 * 检查是否为对象
 * @param obj 对象
 * @returns 是否为对象
 */
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

/**
 * 对象转键值对数组
 * @param obj 对象
 * @returns 键值对数组
 */
export function objectToEntries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * 键值对数组转对象
 * @param entries 键值对数组
 * @returns 对象
 */
export function entriesToObject<K extends string, V>(entries: [K, V][]): Record<K, V> {
  return entries.reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as Record<K, V>)
}

/**
 * 对象过滤
 * @param obj 对象
 * @param predicate 过滤函数
 * @returns 过滤后的对象
 */
export function filterObject<T extends Record<string, any>>(
  obj: T, 
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (predicate(value, key as keyof T)) {
      result[key as keyof T] = value
    }
    return result
  }, {} as Partial<T>)
}

/**
 * 对象映射
 * @param obj 对象
 * @param mapper 映射函数
 * @returns 映射后的对象
 */
export function mapObject<T extends Record<string, any>, U>(
  obj: T, 
  mapper: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key as keyof T] = mapper(value, key as keyof T)
    return result
  }, {} as Record<keyof T, U>)
}

/**
 * 对象键重命名
 * @param obj 对象
 * @param keyMap 键映射
 * @returns 重命名后的对象
 */
export function renameKeys<T extends Record<string, any>, U extends Record<string, string>>(
  obj: T, 
  keyMap: U
): Record<string, any> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const newKey = keyMap[key] || key
    result[newKey] = value
    return result
  }, {} as Record<string, any>)
}

/**
 * 对象值转换
 * @param obj 对象
 * @param transformer 转换函数
 * @returns 转换后的对象
 */
export function transformValues<T extends Record<string, any>, U>(
  obj: T, 
  transformer: (value: T[keyof T]) => U
): Record<keyof T, U> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key as keyof T] = transformer(value)
    return result
  }, {} as Record<keyof T, U>)
}

/**
 * 获取对象的所有键
 * @param obj 对象
 * @returns 键数组
 */
export function getObjectKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

/**
 * 获取对象的所有值
 * @param obj 对象
 * @returns 值数组
 */
export function getObjectValues<T extends Record<string, any>>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}

/**
 * 检查对象是否包含某个键
 * @param obj 对象
 * @param key 键
 * @returns 是否包含
 */
export function hasKey<T extends Record<string, any>>(obj: T, key: string | number | symbol): key is keyof T {
  return key in obj
}

/**
 * 检查对象是否为空
 * @param obj 对象
 * @returns 是否为空
 */
export function isEmptyObject(obj: any): boolean {
  return obj && Object.keys(obj).length === 0
}

/**
 * 对象深度比较
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns 是否相等
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}

/**
 * 对象扁平化
 * @param obj 对象
 * @param prefix 前缀
 * @returns 扁平化后的对象
 */
export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, newKey))
      } else {
        result[newKey] = value
      }
    }
  }
  
  return result
}

/**
 * 对象反扁平化
 * @param obj 扁平化对象
 * @returns 反扁平化后的对象
 */
export function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keys = key.split('.')
      let current = result
      
      for (let i = 0; i < keys.length - 1; i++) {
        const subKey = keys[i]
        if (!current[subKey]) {
          current[subKey] = {}
        }
        current = current[subKey]
      }
      
      current[keys[keys.length - 1]] = obj[key]
    }
  }
  
  return result
}

/**
 * 对象选择
 * @param obj 对象
 * @param keys 要选择的键
 * @returns 选择后的对象
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {} as Pick<T, K>)
}

/**
 * 对象排除
 * @param obj 对象
 * @param keys 要排除的键
 * @returns 排除后的对象
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result as Omit<T, K>
}
