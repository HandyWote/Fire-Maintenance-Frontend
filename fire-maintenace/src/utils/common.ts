/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }) as T
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let lastCall = 0
  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(null, args)
    }
  }) as T
}

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
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成UUID
 * @returns UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字
 */
export function formatNumber(num: number, decimals = 2): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化金额
 * @param amount 金额
 * @param currency 货币符号
 * @param decimals 小数位数
 * @returns 格式化后的金额
 */
export function formatCurrency(amount: number, currency = '¥', decimals = 2): string {
  return `${currency}${formatNumber(amount, decimals)}`
}

/**
 * 格式化百分比
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的百分比
 */
export function formatPercentage(num: number, decimals = 2): string {
  return `${formatNumber(num * 100, decimals)}%`
}

/**
 * 验证邮箱
 * @param email 邮箱
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns 是否有效
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

/**
 * 验证URL
 * @param url URL
 * @returns 是否有效
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 获取URL参数
 * @param url URL
 * @returns 参数对象
 */
export function getUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const urlSearchParams = new URLSearchParams(url.split('?')[1])
  
  for (const [key, value] of urlSearchParams.entries()) {
    params[key] = value
  }
  
  return params
}

/**
 * 设置URL参数
 * @param url URL
 * @param params 参数对象
 * @returns 新的URL
 */
export function setUrlParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url)
  
  for (const [key, value] of Object.entries(params)) {
    urlObj.searchParams.set(key, value)
  }
  
  return urlObj.toString()
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * 获取文件名（不含扩展名）
 * @param filename 文件名
 * @returns 文件名
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.slice(0, filename.lastIndexOf('.'))
}

/**
 * 检查文件类型
 * @param filename 文件名
 * @param allowedTypes 允许的文件类型
 * @returns 是否允许
 */
export function isAllowedFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename).toLowerCase()
  return allowedTypes.includes(extension)
}

/**
 * 检查文件大小
 * @param size 文件大小（字节）
 * @param maxSize 最大文件大小（字节）
 * @returns 是否允许
 */
export function isAllowedFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize
}

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
 * 对象转查询字符串
 * @param obj 对象
 * @returns 查询字符串
 */
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 查询字符串转对象
 * @param queryString 查询字符串
 * @returns 对象
 */
export function queryStringToObject(queryString: string): Record<string, string> {
  const params: Record<string, string> = {}
  const urlSearchParams = new URLSearchParams(queryString)
  
  for (const [key, value] of urlSearchParams.entries()) {
    params[key] = value
  }
  
  return params
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
 * 检查对象是否为空
 * @param obj 对象
 * @returns 是否为空
 */
export function isEmptyObject(obj: any): boolean {
  return obj && Object.keys(obj).length === 0
}

/**
 * 检查数组是否为空
 * @param arr 数组
 * @returns 是否为空
 */
export function isEmptyArray(arr: any[]): boolean {
  return !arr || arr.length === 0
}

/**
 * 检查字符串是否为空
 * @param str 字符串
 * @returns 是否为空
 */
export function isEmptyString(str: string): boolean {
  return !str || str.trim().length === 0
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转下划线
 * @param str 字符串
 * @returns 下划线字符串
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

/**
 * 下划线转驼峰
 * @param str 字符串
 * @returns 驼峰字符串
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机颜色
 * @returns 随机颜色
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
}

/**
 * 颜色亮度调整
 * @param color 颜色
 * @param percent 调整百分比
 * @returns 调整后的颜色
 */
export function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)}`
}

/**
 * 复制文本到剪贴板
 * @param text 文本
 * @returns 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * 下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param contentType 文件类型
 */
export function downloadFile(content: string, filename: string, contentType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 打印内容
 * @param content 内容
 */
export function printContent(content: string): void {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }
}

/**
 * 全屏显示元素
 * @param element 元素
 */
export function fullscreen(element: HTMLElement): void {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen()
  } else if ((element as any).mozRequestFullScreen) {
    (element as any).mozRequestFullScreen()
  } else if ((element as any).msRequestFullscreen) {
    (element as any).msRequestFullscreen()
  }
}

/**
 * 退出全屏
 */
export function exitFullscreen(): void {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen()
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen()
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen()
  }
}

/**
 * 检查是否全屏
 * @returns 是否全屏
 */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  )
}

/**
 * 获取设备类型
 * @returns 设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(userAgent)) {
    return 'mobile'
  }
  
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) {
    return 'tablet'
  }
  
  return 'desktop'
}

/**
 * 获取浏览器类型
 * @returns 浏览器类型
 */
export function getBrowserType(): 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie' | 'other' {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edge') === -1) {
    return 'chrome'
  }
  
  if (userAgent.indexOf('firefox') > -1) {
    return 'firefox'
  }
  
  if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
    return 'safari'
  }
  
  if (userAgent.indexOf('edge') > -1) {
    return 'edge'
  }
  
  if (userAgent.indexOf('trident') > -1 || userAgent.indexOf('msie') > -1) {
    return 'ie'
  }
  
  return 'other'
}

/**
 * 获取操作系统类型
 * @returns 操作系统类型
 */
export function getOSType(): 'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'other' {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.indexOf('windows') > -1) {
    return 'windows'
  }
  
  if (userAgent.indexOf('mac') > -1) {
    return 'mac'
  }
  
  if (userAgent.indexOf('linux') > -1) {
    return 'linux'
  }
  
  if (userAgent.indexOf('android') > -1) {
    return 'android'
  }
  
  if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
    return 'ios'
  }
  
  return 'other'
}

/**
 * 获取网络状态
 * @returns 网络状态
 */
export function getNetworkStatus(): 'online' | 'offline' {
  return navigator.onLine ? 'online' : 'offline'
}

/**
 * 监听网络状态变化
 * @param callback 回调函数
 */
export function onNetworkStatusChange(callback: (status: 'online' | 'offline') => void): void {
  window.addEventListener('online', () => callback('online'))
  window.addEventListener('offline', () => callback('offline'))
}

/**
 * 获取屏幕尺寸
 * @returns 屏幕尺寸
 */
export function getScreenSize(): {
  width: number
  height: number
  availWidth: number
  availHeight: number
} {
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight
  }
}

/**
 * 获取窗口尺寸
 * @returns 窗口尺寸
 */
export function getWindowSize(): {
  width: number
  height: number
  innerWidth: number
  innerHeight: number
} {
  return {
    width: window.outerWidth,
    height: window.outerHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  }
}

/**
 * 监听窗口尺寸变化
 * @param callback 回调函数
 */
export function onWindowSizeChange(callback: (size: { width: number; height: number }) => void): void {
  window.addEventListener('resize', () => {
    callback({
      width: window.innerWidth,
      height: window.innerHeight
    })
  })
}

/**
 * 滚动到顶部
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * 滚动到底部
 */
export function scrollToBottom(): void {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

/**
 * 滚动到元素
 * @param element 元素
 * @param offset 偏移量
 */
export function scrollToElement(element: HTMLElement, offset = 0): void {
  const top = element.offsetTop + offset
  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

/**
 * 获取元素位置
 * @param element 元素
 * @returns 元素位置
 */
export function getElementPosition(element: HTMLElement): {
  top: number
  left: number
  width: number
  height: number
} {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    width: rect.width,
    height: rect.height
  }
}

/**
 * 检查元素是否在视口中
 * @param element 元素
 * @returns 是否在视口中
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取元素相对于父元素的位置
 * @param element 元素
 * @param parentElement 父元素
 * @returns 相对位置
 */
export function getRelativePosition(element: HTMLElement, parentElement: HTMLElement): {
  top: number
  left: number
} {
  const elementRect = element.getBoundingClientRect()
  const parentRect = parentElement.getBoundingClientRect()
  
  return {
    top: elementRect.top - parentRect.top,
    left: elementRect.left - parentRect.left
  }
}
