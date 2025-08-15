/**
 * 随机数和颜色处理工具函数
 */

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
 * 生成随机字符串
 * @param length 字符串长度
 * @param characters 可选字符集
 * @returns 随机字符串
 */
export function randomString(length: number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/**
 * 生成随机布尔值
 * @returns 随机布尔值
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5
}

/**
 * 从数组中随机选择元素
 * @param array 数组
 * @returns 随机元素
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 从数组中随机选择多个元素
 * @param array 数组
 * @param count 选择数量
 * @returns 随机元素数组
 */
export function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * 洗牌算法（Fisher-Yates）
 * @param array 数组
 * @returns 洗牌后的数组
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 生成随机日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 随机日期
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * 生成随机IP地址
 * @returns 随机IP地址
 */
export function randomIP(): string {
  return `${random(1, 255)}.${random(1, 255)}.${random(1, 255)}.${random(1, 255)}`
}

/**
 * 生成随机MAC地址
 * @returns 随机MAC地址
 */
export function randomMAC(): string {
  return randomString(12, '0123456789ABCDEF')
    .match(/.{2}/g)
    ?.join(':') || '00:00:00:00:00:00'
}

/**
 * 生成随机手机号
 * @returns 随机手机号
 */
export function randomPhone(): string {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                    '145', '147', '149', '150', '151', '152', '153', '155', '156', '157',
                    '158', '159', '165', '166', '167', '170', '171', '172', '173', '174',
                    '175', '176', '177', '178', '180', '181', '182', '183', '184', '185',
                    '186', '187', '188', '189', '191', '198', '199']
  const prefix = randomChoice(prefixes)
  const suffix = randomString(8, '0123456789')
  return `${prefix}${suffix}`
}

/**
 * 生成随机邮箱
 * @returns 随机邮箱
 */
export function randomEmail(): string {
  const usernames = ['user', 'admin', 'test', 'demo', 'sample', 'example', 'temp', 'guest']
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', '163.com', 'qq.com']
  const username = randomChoice(usernames) + randomString(4, '0123456789')
  const domain = randomChoice(domains)
  return `${username}@${domain}`
}

/**
 * 生成随机姓名
 * @returns 随机姓名
 */
export function randomName(): string {
  const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴']
  const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军']
  const surname = randomChoice(surnames)
  const givenName = randomChoice(givenNames)
  return `${surname}${givenName}`
}

/**
 * 生成随机地址
 * @returns 随机地址
 */
export function randomAddress(): string {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '重庆']
  const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区']
  const streets = ['中山路', '人民路', '解放路', '建设路', '新华路', '文化路']
  const city = randomChoice(cities)
  const district = randomChoice(districts)
  const street = randomChoice(streets)
  const number = random(1, 999)
  return `${city}市${district}${street}${number}号`
}

/**
 * 生成随机公司名称
 * @returns 随机公司名称
 */
export function randomCompanyName(): string {
  const prefixes = ['北京', '上海', '广州', '深圳', '杭州']
  const industries = ['科技', '信息', '网络', '数据', '智能', '数字']
  const suffixes = ['有限公司', '科技股份有限公司', '信息技术有限公司', '网络科技有限公司']
  const prefix = randomChoice(prefixes)
  const industry = randomChoice(industries)
  const suffix = randomChoice(suffixes)
  return `${prefix}${industry}${suffix}`
}

/**
 * 生成随机URL
 * @returns 随机URL
 */
export function randomURL(): string {
  const protocols = ['http', 'https']
  const domains = ['example.com', 'test.com', 'demo.com', 'sample.com']
  const paths = ['home', 'about', 'contact', 'products', 'services']
  const protocol = randomChoice(protocols)
  const domain = randomChoice(domains)
  const path = randomChoice(paths)
  return `${protocol}://${domain}/${path}`
}

/**
 * 颜色格式转换
 * @param color 颜色
 * @returns 转换后的颜色
 */
export function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * RGB转HEX
 * @param r 红色
 * @param g 绿色
 * @param b 蓝色
 * @returns HEX颜色
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')}`
}

/**
 * 生成渐变色
 * @param startColor 开始颜色
 * @param endColor 结束颜色
 * @param steps 步数
 * @returns 渐变色数组
 */
export function generateGradient(startColor: string, endColor: string, steps: number): string[] {
  const start = hexToRgb(startColor)
  const end = hexToRgb(endColor)
  
  if (!start || !end) return []
  
  const gradient = []
  for (let i = 0; i < steps; i++) {
    const r = Math.round(start.r + (end.r - start.r) * i / (steps - 1))
    const g = Math.round(start.g + (end.g - start.g) * i / (steps - 1))
    const b = Math.round(start.b + (end.b - start.b) * i / (steps - 1))
    gradient.push(rgbToHex(r, g, b))
  }
  
  return gradient
}
