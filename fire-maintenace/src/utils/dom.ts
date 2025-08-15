/**
 * DOM和浏览器操作工具函数
 */

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
