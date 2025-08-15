/**
 * 数组操作工具函数
 */

/**
 * 数组去重
 * @param arr 数组
 * @param key 对象数组的键
 * @returns 去重后的数组
 */
export function uniqueArray<T>(arr: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(arr)]
  }
  
  const seen = new Set()
  return arr.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * 数组分组
 * @param arr 数组
 * @param key 分组键
 * @returns 分组后的对象
 */
export function groupArray<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * 数组排序
 * @param arr 数组
 * @param key 排序键
 * @param order 排序顺序
 * @returns 排序后的数组
 */
export function sortArray<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    const valueA = a[key]
    const valueB = b[key]
    
    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}

/**
 * 数组分页
 * @param arr 数组
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 分页结果
 */
export function paginateArray<T>(arr: T[], page: number, pageSize: number): {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
} {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const data = arr.slice(startIndex, endIndex)
  
  return {
    data,
    total: arr.length,
    page,
    pageSize,
    totalPages: Math.ceil(arr.length / pageSize)
  }
}

/**
 * 数组交集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 交集数组
 */
export function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item))
}

/**
 * 数组并集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 并集数组
 */
export function arrayUnion<T>(arr1: T[], arr2: T[]): T[] {
  return uniqueArray([...arr1, ...arr2])
}

/**
 * 数组差集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 差集数组
 */
export function arrayDifference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => !arr2.includes(item))
}

/**
 * 数组扁平化
 * @param arr 数组
 * @param depth 扁平化深度
 * @returns 扁平化后的数组
 */
export function flattenArray<T>(arr: any[], depth = 1): T[] {
  return depth > 0 
    ? arr.reduce((acc, val) => 
        acc.concat(Array.isArray(val) ? flattenArray(val, depth - 1) : val), 
        []
      )
    : arr.slice()
}

/**
 * 数组分组映射
 * @param arr 数组
 * @param groupFn 分组函数
 * @param mapFn 映射函数
 * @returns 映射后的分组对象
 */
export function groupMap<T, K, V>(
  arr: T[], 
  groupFn: (item: T) => K, 
  mapFn: (item: T) => V
): Record<string, V[]> {
  return arr.reduce((groups, item) => {
    const key = String(groupFn(item))
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(mapFn(item))
    return groups
  }, {} as Record<string, V[]>)
}

/**
 * 数组查找最大值
 * @param arr 数组
 * @param key 对象数组的键
 * @returns 最大值
 */
export function arrayMax<T>(arr: T[], key?: keyof T): T | number {
  if (arr.length === 0) return 0
  
  if (key) {
    return arr.reduce((max, item) => item[key] > max[key] ? item : max)
  }
  
  return Math.max(...arr as number[])
}

/**
 * 数组查找最小值
 * @param arr 数组
 * @param key 对象数组的键
 * @returns 最小值
 */
export function arrayMin<T>(arr: T[], key?: keyof T): T | number {
  if (arr.length === 0) return 0
  
  if (key) {
    return arr.reduce((min, item) => item[key] < min[key] ? item : min)
  }
  
  return Math.min(...arr as number[])
}

/**
 * 数组求和
 * @param arr 数组
 * @param key 对象数组的键
 * @returns 总和
 */
export function arraySum<T>(arr: T[], key?: keyof T): number {
  if (key) {
    return arr.reduce((sum, item) => sum + (item[key] as number), 0)
  }
  
  return arr.reduce((sum, item) => sum + (item as number), 0)
}

/**
 * 数组平均值
 * @param arr 数组
 * @param key 对象数组的键
 * @returns 平均值
 */
export function arrayAverage<T>(arr: T[], key?: keyof T): number {
  if (arr.length === 0) return 0
  
  const sum = arraySum(arr, key)
  return sum / arr.length
}
