/**
 * 格式化工具函数
 */

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
