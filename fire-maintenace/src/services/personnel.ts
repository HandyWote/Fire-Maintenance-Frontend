import { BaseService, ServiceFactory, ApiError } from './base'
import type { Personnel, PersonnelFormData, PersonnelQueryParams, PersonnelResponse, PersonnelStatistics } from '@/types/personnel'
import type { PageQueryParams, PageResponse } from '@/types'
import { Cache } from '@/utils/performance'

// 简单的缓存实例
const cache = new Cache<any>(5 * 60 * 1000) // 5分钟缓存

// 人员服务类
export class PersonnelService extends BaseService {
  protected baseUrl = '/api/personnel'

  // 获取所有人员
  async getAllPersonnel(params?: PersonnelQueryParams): Promise<PersonnelResponse> {
    const cacheKey = `personnel_all_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getAllPersonnel called with params:`, params)
    const result = await this.getAll<Personnel>(params)
    cache.set(cacheKey, result)
    return result as PersonnelResponse
  }

  // 根据ID获取人员
  async getPersonnelById(id: string): Promise<Personnel> {
    const cacheKey = `personnel_${id}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getPersonnelById called with id:`, id)
    const result = await this.getById<Personnel>(id)
    cache.set(cacheKey, result, 10 * 60 * 1000) // 10分钟缓存
    return result
  }

  // 创建人员
  async createPersonnel(data: PersonnelFormData): Promise<Personnel> {
    console.info(`[PersonnelService] createPersonnel called with data:`, data)
    const result = await this.create<Personnel>(data)
    // 清除相关缓存
    cache.delete('personnel_all_undefined')
    return result
  }

  // 更新人员
  async updatePersonnel(id: string, data: Partial<PersonnelFormData>): Promise<Personnel> {
    console.info(`[PersonnelService] updatePersonnel called with id:`, id, 'data:', data)
    const result = await this.update<Personnel>(id, data)
    // 清除相关缓存
    cache.delete(`personnel_${id}`)
    cache.delete('personnel_all_undefined')
    return result
  }

  // 删除人员
  async deletePersonnel(id: string): Promise<void> {
    console.warn(`[PersonnelService] deletePersonnel called with id:`, id)
    await this.delete(id)
    // 清除相关缓存
    cache.delete(`personnel_${id}`)
    cache.delete('personnel_all_undefined')
  }

  // 批量创建人员
  async batchCreatePersonnel(data: PersonnelFormData[]): Promise<Personnel[]> {
    console.info(`[PersonnelService] batchCreatePersonnel called with data:`, data)
    const result = await this.batchCreate<Personnel>(data)
    // 清除相关缓存
    cache.delete('personnel_all_undefined')
    return result
  }

  // 批量更新人员
  async batchUpdatePersonnel(data: Array<{ id: string; data: Partial<PersonnelFormData> }>): Promise<Personnel[]> {
    console.info(`[PersonnelService] batchUpdatePersonnel called with data:`, data)
    const result = await this.batchUpdate<Personnel>(data)
    // 清除相关缓存
    data.forEach(item => cache.delete(`personnel_${item.id}`))
    cache.delete('personnel_all_undefined')
    return result
  }

  // 批量删除人员
  async batchDeletePersonnel(ids: string[]): Promise<void> {
    console.warn(`[PersonnelService] batchDeletePersonnel called with ids:`, ids)
    await this.batchDelete(ids)
    // 清除相关缓存
    ids.forEach(id => cache.delete(`personnel_${id}`))
    cache.delete('personnel_all_undefined')
  }

  // 搜索人员
  async searchPersonnel(keyword: string, params?: PersonnelQueryParams): Promise<PersonnelResponse> {
    const cacheKey = `personnel_search_${keyword}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] searchPersonnel called with keyword:`, keyword, 'params:', params)
    const result = await this.search<Personnel>(keyword, params)
    cache.set(cacheKey, result, 2 * 60 * 1000) // 2分钟缓存
    return result as PersonnelResponse
  }

  // 获取人员统计信息
  async getPersonnelStats(): Promise<PersonnelStatistics> {
    const cacheKey = 'personnel_stats'
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getPersonnelStats called`)
    const result = await this.getStats()
    cache.set(cacheKey, result)
    return result as PersonnelStatistics
  }

  // 启用人员
  async enablePersonnel(id: string): Promise<void> {
    console.info(`[PersonnelService] enablePersonnel called with id:`, id)
    await this.enable(id)
    // 清除相关缓存
    cache.delete(`personnel_${id}`)
    cache.delete('personnel_all_undefined')
  }

  // 禁用人员
  async disablePersonnel(id: string): Promise<void> {
    console.warn(`[PersonnelService] disablePersonnel called with id:`, id)
    await this.disable(id)
    // 清除相关缓存
    cache.delete(`personnel_${id}`)
    cache.delete('personnel_all_undefined')
  }

  // 获取公司人员列表
  async getCompanyPersonnel(companyId: string, params?: PersonnelQueryParams): Promise<PersonnelResponse> {
    const cacheKey = `personnel_company_${companyId}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getCompanyPersonnel called with companyId:`, companyId, 'params:', params)
    try {
      const response = await fetch(`${this.baseUrl}/company/${companyId}?${new URLSearchParams(params as any)}`)
      if (!response.ok) {
        throw new ApiError(`Failed to fetch company personnel: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      cache.set(cacheKey, result, 3 * 60 * 1000) // 3分钟缓存
      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }

  // 获取部门人员列表
  async getDepartmentPersonnel(department: string, params?: PersonnelQueryParams): Promise<PersonnelResponse> {
    const cacheKey = `personnel_department_${department}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getDepartmentPersonnel called with department:`, department, 'params:', params)
    try {
      const response = await fetch(`${this.baseUrl}/department/${encodeURIComponent(department)}?${new URLSearchParams(params as any)}`)
      if (!response.ok) {
        throw new ApiError(`Failed to fetch department personnel: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      cache.set(cacheKey, result, 3 * 60 * 1000) // 3分钟缓存
      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }

  // 获取角色人员列表
  async getRolePersonnel(role: string, params?: PersonnelQueryParams): Promise<PersonnelResponse> {
    const cacheKey = `personnel_role_${role}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[PersonnelService] getRolePersonnel called with role:`, role, 'params:', params)
    try {
      const response = await fetch(`${this.baseUrl}/role/${role}?${new URLSearchParams(params as any)}`)
      if (!response.ok) {
        throw new ApiError(`Failed to fetch role personnel: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      cache.set(cacheKey, result, 3 * 60 * 1000) // 3分钟缓存
      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }

  // 验证人员数据
  async validatePersonnelData(data: Partial<PersonnelFormData>): Promise<{ valid: boolean; errors: string[] }> {
    console.info(`[PersonnelService] validatePersonnelData called with data:`, data)
    const errors: string[] = []
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('姓名不能为空')
    }
    
    if (!data.employeeId || data.employeeId.trim().length === 0) {
      errors.push('员工编号不能为空')
    }
    
    if (!data.department || data.department.trim().length === 0) {
      errors.push('部门不能为空')
    }
    
    if (!data.position || data.position.trim().length === 0) {
      errors.push('职位不能为空')
    }
    
    if (!data.phone || data.phone.trim().length === 0) {
      errors.push('联系电话不能为空')
    } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
      errors.push('请输入有效的手机号码')
    }
    
    if (data.email && data.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        errors.push('请输入有效的邮箱地址')
      }
    }
    
    if (!data.companyId || data.companyId.trim().length === 0) {
      errors.push('所属公司不能为空')
    }
    
    if (!data.role || data.role.trim().length === 0) {
      errors.push('角色不能为空')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 检查员工编号是否重复
  async checkEmployeeIdExists(employeeId: string, excludeId?: string): Promise<boolean> {
    const cacheKey = `personnel_check_employeeId_${employeeId}_${excludeId || ''}`
    const cached = cache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }
    
    console.info(`[PersonnelService] checkEmployeeIdExists called with employeeId:`, employeeId, 'excludeId:', excludeId)
    try {
      const response = await fetch(`${this.baseUrl}/check-employeeId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, excludeId })
      })
      if (!response.ok) {
        throw new ApiError(`Failed to check employeeId: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      cache.set(cacheKey, result.exists, 10 * 60 * 1000) // 10分钟缓存
      return result.exists
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }

  // 生成员工编号
  async generateEmployeeId(): Promise<string> {
    console.info(`[PersonnelService] generateEmployeeId called`)
    try {
      const response = await fetch(`${this.baseUrl}/generate-employeeId`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new ApiError(`Failed to generate employeeId: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      return result.employeeId
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }
}

// 创建人员服务实例
export const personnelService = ServiceFactory.createService(PersonnelService)
