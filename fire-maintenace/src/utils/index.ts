// HTTP请求相关
export * from './request'

// 日期时间相关
export * from './date'

// 通用工具函数
export * from './common'

// 重新导出常用的工具函数
export {
  get,
  post,
  put,
  del,
  upload,
  download
} from './request'

import request from './request'
export { request }

export {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  getCurrentTime,
  getCurrentDate,
  getCurrentTimestamp
} from './date'

import dayjs from './date'
export { dayjs }

export {
  debounce,
  throttle,
  deepClone,
  generateId,
  generateUUID,
  formatFileSize,
  formatNumber,
  formatCurrency,
  formatPercentage,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  uniqueArray,
  groupArray,
  sortArray,
  paginateArray,
  copyToClipboard,
  downloadFile,
  scrollToTop,
  scrollToBottom,
  scrollToElement
} from './common'
