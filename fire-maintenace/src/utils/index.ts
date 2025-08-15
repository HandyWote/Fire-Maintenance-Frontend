// HTTP请求相关
export * from './request'

// 日期时间相关
export * from './date'

// 验证相关工具函数
export * from './validation'

// 格式化相关工具函数
export * from './format'

// 数组操作相关工具函数
export * from './array'

// DOM和浏览器操作相关工具函数
export * from './dom'

// 对象操作相关工具函数
export * from './object'

// 随机数和颜色处理相关工具函数
export * from './random'

// 性能监控相关工具函数
export * from './performance'

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

// 从新的工具文件中导出常用函数
export {
  // 验证相关
  isValidEmail,
  isValidPhone,
  isValidIdCard,
  isValidUrl,
  isAllowedFileType,
  isAllowedFileSize,
  isEmptyObject,
  isEmptyArray,
  isEmptyString
} from './validation'

export {
  // 格式化相关
  formatFileSize,
  formatNumber,
  formatCurrency,
  formatPercentage,
  capitalizeFirstLetter,
  camelToSnake,
  snakeToCamel,
  objectToQueryString,
  queryStringToObject,
  getUrlParams,
  setUrlParams
} from './format'

export {
  // 数组操作相关
  uniqueArray,
  groupArray,
  sortArray,
  paginateArray,
  arrayIntersection,
  arrayUnion,
  arrayDifference,
  flattenArray,
  arrayMax,
  arrayMin,
  arraySum,
  arrayAverage
} from './array'

export {
  // DOM操作相关
  scrollToTop,
  scrollToBottom,
  scrollToElement,
  getElementPosition,
  isElementInViewport,
  getRelativePosition,
  fullscreen,
  exitFullscreen,
  isFullscreen,
  getDeviceType,
  getBrowserType,
  getOSType,
  getNetworkStatus,
  onNetworkStatusChange,
  getScreenSize,
  getWindowSize,
  onWindowSizeChange,
  copyToClipboard,
  downloadFile,
  printContent
} from './dom'

export {
  // 对象操作相关
  deepClone,
  getNestedValue,
  setNestedValue,
  deepMerge,
  isObject,
  objectToEntries,
  entriesToObject,
  filterObject,
  mapObject,
  getObjectKeys,
  getObjectValues,
  hasKey,
  deepEqual,
  flattenObject,
  unflattenObject,
  pick,
  omit
} from './object'

export {
  // 随机数相关
  generateId,
  generateUUID,
  random,
  randomColor,
  adjustColorBrightness,
  randomString,
  randomBoolean,
  randomChoice,
  randomChoices,
  shuffle,
  randomDate,
  hexToRgb,
  rgbToHex,
  generateGradient
} from './random'

export {
  // 原有的常用函数（保留在common.ts中的）
  debounce,
  throttle
} from './common'
