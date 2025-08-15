/**
 * 验证工具函数
 */

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
