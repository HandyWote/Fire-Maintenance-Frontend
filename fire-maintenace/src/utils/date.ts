import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(quarterOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)

// 默认时区设置
dayjs.tz.setDefault('Asia/Shanghai')

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * 格式化时间
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

/**
 * 格式化日期时间
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间
 * @param date 日期
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | string | number): string {
  return dayjs(date).fromNow()
}

/**
 * 获取相对时间到指定日期
 * @param date 日期
 * @param targetDate 目标日期
 * @returns 相对时间字符串
 */
export function getRelativeTimeTo(date: Date | string | number, targetDate: Date | string | number): string {
  return dayjs(date).to(targetDate)
}

/**
 * 获取UTC时间
 * @param date 日期
 * @returns UTC时间字符串
 */
export function getUTCDateTime(date: Date | string | number): string {
  return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取时区时间
 * @param date 日期
 * @param timezone 时区
 * @returns 时区时间字符串
 */
export function getTimezoneDateTime(date: Date | string | number, timezone: string): string {
  return dayjs(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取日期范围
 * @param start 开始日期
 * @param end 结束日期
 * @param unit 单位
 * @returns 日期范围
 */
export function getDateRange(start: Date | string | number, end: Date | string | number, unit: 'day' | 'week' | 'month' | 'year' = 'day'): number {
  return dayjs(end).diff(dayjs(start), unit)
}

/**
 * 获取日期范围数组
 * @param start 开始日期
 * @param end 结束日期
 * @param unit 单位
 * @returns 日期数组
 */
export function getDateRangeArray(start: Date | string | number, end: Date | string | number, unit: 'day' | 'week' | 'month' | 'year' = 'day'): string[] {
  const dates: string[] = []
  const current = dayjs(start)
  const endDay = dayjs(end)
  
  while (current.isBefore(endDay) || current.isSame(endDay)) {
    dates.push(current.format('YYYY-MM-DD'))
    current.add(1, unit)
  }
  
  return dates
}

/**
 * 获取月份的第一天
 * @param date 日期
 * @returns 月份的第一天
 */
export function getFirstDayOfMonth(date: Date | string | number): string {
  return dayjs(date).startOf('month').format('YYYY-MM-DD')
}

/**
 * 获取月份的最后一天
 * @param date 日期
 * @returns 月份的最后一天
 */
export function getLastDayOfMonth(date: Date | string | number): string {
  return dayjs(date).endOf('month').format('YYYY-MM-DD')
}

/**
 * 获取周的第一天
 * @param date 日期
 * @returns 周的第一天
 */
export function getFirstDayOfWeek(date: Date | string | number): string {
  return dayjs(date).startOf('week').format('YYYY-MM-DD')
}

/**
 * 获取周的最后一天
 * @param date 日期
 * @returns 周的最后一天
 */
export function getLastDayOfWeek(date: Date | string | number): string {
  return dayjs(date).endOf('week').format('YYYY-MM-DD')
}

/**
 * 获取年份的第一天
 * @param date 日期
 * @returns 年份的第一天
 */
export function getFirstDayOfYear(date: Date | string | number): string {
  return dayjs(date).startOf('year').format('YYYY-MM-DD')
}

/**
 * 获取年份的最后一天
 * @param date 日期
 * @returns 年份的最后一天
 */
export function getLastDayOfYear(date: Date | string | number): string {
  return dayjs(date).endOf('year').format('YYYY-MM-DD')
}

/**
 * 添加时间
 * @param date 日期
 * @param amount 数量
 * @param unit 单位
 * @returns 添加后的日期
 */
export function addTime(date: Date | string | number, amount: number, unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second'): string {
  return dayjs(date).add(amount, unit).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 减少时间
 * @param date 日期
 * @param amount 数量
 * @param unit 单位
 * @returns 减少后的日期
 */
export function subtractTime(date: Date | string | number, amount: number, unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second'): string {
  return dayjs(date).subtract(amount, unit).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 检查日期是否在范围内
 * @param date 日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 是否在范围内
 */
export function isDateInRange(date: Date | string | number, start: Date | string | number, end: Date | string | number): boolean {
  const target = dayjs(date)
  return target.isAfter(dayjs(start)) && target.isBefore(dayjs(end))
}

/**
 * 检查日期是否在范围内（包含边界）
 * @param date 日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 是否在范围内
 */
export function isDateInRangeInclusive(date: Date | string | number, start: Date | string | number, end: Date | string | number): boolean {
  const target = dayjs(date)
  return (target.isSame(dayjs(start)) || target.isAfter(dayjs(start))) && 
         (target.isSame(dayjs(end)) || target.isBefore(dayjs(end)))
}

/**
 * 获取日期的星期几
 * @param date 日期
 * @returns 星期几
 */
export function getDayOfWeek(date: Date | string | number): string {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return days[dayjs(date).day()]
}

/**
 * 获取日期的季度
 * @param date 日期
 * @returns 季度
 */
export function getQuarter(date: Date | string | number): number {
  return dayjs(date).quarter()
}

/**
 * 获取日期的周数
 * @param date 日期
 * @returns 周数
 */
export function getWeekOfYear(date: Date | string | number): number {
  return dayjs(date).week()
}

/**
 * 获取日期的天数
 * @param date 日期
 * @returns 天数
 */
export function getDayOfYear(date: Date | string | number): number {
  return dayjs(date).dayOfYear()
}

/**
 * 获取两个日期之间的工作日天数
 * @param start 开始日期
 * @param end 结束日期
 * @returns 工作日天数
 */
export function getWorkdaysBetween(start: Date | string | number, end: Date | string | number): number {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  let workdays = 0
  
  const current = startDate
  while (current.isBefore(endDate) || current.isSame(endDate)) {
    const dayOfWeek = current.day()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workdays++
    }
    current.add(1, 'day')
  }
  
  return workdays
}

/**
 * 格式化持续时间
 * @param seconds 秒数
 * @returns 格式化后的持续时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟${remainingSeconds}秒`
  } else if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds}秒`
  } else {
    return `${remainingSeconds}秒`
  }
}

/**
 * 获取时间戳
 * @param date 日期
 * @returns 时间戳
 */
export function getTimestamp(date?: Date | string | number): number {
  return dayjs(date).valueOf()
}

/**
 * 从时间戳创建日期
 * @param timestamp 时间戳
 * @returns 日期字符串
 */
export function fromTimestamp(timestamp: number): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 检查日期是否有效
 * @param date 日期
 * @returns 是否有效
 */
export function isValidDate(date: any): boolean {
  return dayjs(date).isValid()
}

/**
 * 获取当前时间
 * @returns 当前时间字符串
 */
export function getCurrentTime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取当前日期
 * @returns 当前日期字符串
 */
export function getCurrentDate(): string {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * 获取当前时间戳
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(): number {
  return dayjs().valueOf()
}

export default dayjs
