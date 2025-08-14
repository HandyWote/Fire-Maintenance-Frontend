import { ref, shallowRef, toValue } from 'vue'

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this
    
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function (this: any, ...args: Parameters<T>) {
    const context = this
    
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// 记忆化函数
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = func.apply(this, args)
    cache.set(key, result)
    
    return result
  } as T
}

// 优化的递归函数
export function optimizedRecursive<T extends { children?: T[] }, R>(
  func: (item: T, ...args: any[]) => R,
  items: T[],
  ...args: any[]
): R[] {
  const result: R[] = []
  const stack: Array<{ item: T; depth: number }> = []
  
  // 初始化栈
  for (const item of items) {
    stack.push({ item, depth: 0 })
  }
  
  // 使用栈代替递归
  while (stack.length > 0) {
    const { item, depth } = stack.pop()!
    
    // 执行函数
    const funcResult = func(item, ...args)
    if (funcResult !== undefined) {
      result.push(funcResult)
    }
    
    // 如果有子项，添加到栈中
    if (item.children && Array.isArray(item.children)) {
      for (let i = item.children.length - 1; i >= 0; i--) {
        stack.push({ item: item.children[i], depth: depth + 1 })
      }
    }
  }
  
  return result
}

// 虚拟滚动工具
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const scrollTop = ref(0)
  const visibleItems = shallowRef<T[]>([])
  const startIndex = ref(0)
  const endIndex = ref(0)
  
  const updateVisibleItems = () => {
    const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop.value + containerHeight) / itemHeight) + overscan
    )
    
    startIndex.value = start
    endIndex.value = end
    visibleItems.value = items.slice(start, end + 1) as T[]
  }
  
  const onScroll = (event: Event) => {
    scrollTop.value = (event.target as HTMLElement).scrollTop
    updateVisibleItems()
  }
  
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex.value * itemHeight
  
  return {
    scrollTop,
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    onScroll,
    updateVisibleItems
  }
}

// 懒加载工具
export function useLazyLoad<T>(
  loadFunction: () => Promise<T>,
  options: {
    immediate?: boolean
    retryCount?: number
    retryDelay?: number
  } = {}
) {
  const {
    immediate = false,
    retryCount = 3,
    retryDelay = 1000
  } = options
  
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const retryTimes = ref(0)
  
  const load = async () => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await loadFunction()
      retryTimes.value = 0
    } catch (err) {
      error.value = err as Error
      
      // 重试逻辑
      if (retryTimes.value < retryCount) {
        retryTimes.value++
        setTimeout(load, retryDelay * retryTimes.value)
      }
    } finally {
      loading.value = false
    }
  }
  
  const reload = () => {
    retryTimes.value = 0
    load()
  }
  
  if (immediate) {
    load()
  }
  
  return {
    data,
    loading,
    error,
    retryTimes,
    load,
    reload
  }
}

// 缓存工具
export class Cache<T> {
  private cache = new Map<string, { value: T; expires: number }>()
  private defaultTTL: number
  
  constructor(defaultTTL: number = 5 * 60 * 1000) { // 默认5分钟
    this.defaultTTL = defaultTTL
  }
  
  set(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expires = Date.now() + ttl
    this.cache.set(key, { value, expires })
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  has(key: string): boolean {
    return this.get(key) !== null
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

// 批量处理工具
export function useBatchProcess<T, R>(
  processFunction: (items: T[]) => Promise<R[]>,
  options: {
    batchSize?: number
    delay?: number
  } = {}
) {
  const {
    batchSize = 10,
    delay = 100
  } = options
  
  const queue = ref<T[]>([])
  const processing = ref(false)
  const results = ref<R[]>([])
  const errors = ref<Error[]>([])
  
  const process = async (items: T[]) => {
    processing.value = true
    
    try {
      const batches: T[][] = []
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize))
      }
      
      for (const batch of batches) {
    const batchResults = await processFunction(batch)
    const currentResults = toValue(results.value) as R[]
    results.value = [...currentResults, ...batchResults]
        
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    } catch (err) {
      errors.value.push(err as Error)
    } finally {
      processing.value = false
    }
  }
  
  const add = (item: T) => {
    const currentQueue = toValue(queue.value) as T[]
    queue.value = [...currentQueue, item]
  }
  
  const addBatch = (items: T[]) => {
    const currentQueue = toValue(queue.value) as T[]
    queue.value = [...currentQueue, ...items]
  }
  
  const start = () => {
    if (!processing.value && queue.value.length > 0) {
      const itemsToProcess = toValue(queue.value) as T[]
      queue.value = []
      process(itemsToProcess)
    }
  }
  
  return {
    queue,
    processing,
    results,
    errors,
    add,
    addBatch,
    start
  }
}

// 性能监控工具
export function usePerformanceMonitor() {
  const metrics = ref<Map<string, number>>(new Map())
  const timers = ref<Map<string, number>>(new Map())
  
  const startTimer = (name: string) => {
    timers.value.set(name, performance.now())
  }
  
  const endTimer = (name: string) => {
    const startTime = timers.value.get(name)
    if (startTime) {
      const duration = performance.now() - startTime
      metrics.value.set(name, duration)
      timers.value.delete(name)
      return duration
    }
    return 0
  }
  
  const getMetric = (name: string) => {
    return metrics.value.get(name) || 0
  }
  
  const getAllMetrics = () => {
    return Object.fromEntries(metrics.value.entries())
  }
  
  const clearMetrics = () => {
    metrics.value.clear()
    timers.value.clear()
  }
  
  return {
    metrics,
    timers,
    startTimer,
    endTimer,
    getMetric,
    getAllMetrics,
    clearMetrics
  }
}
