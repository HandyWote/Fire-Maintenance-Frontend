import { BaseService, ServiceFactory, ApiError } from './base'
import type { Company } from '@/types/company'
import type { PageQueryParams, PageResponse } from '@/types'
import { Cache } from '@/utils/performance'

// 简单的缓存实例
const cache = new Cache<any>(5 * 60 * 1000) // 5分钟缓存

// 公司服务类
export class CompanyService extends BaseService {
  protected baseUrl = '/api/companies'

  // 获取所有公司
  async getAllCompanies(params?: PageQueryParams): Promise<PageResponse<Company>> {
    const cacheKey = `companies_all_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getAllCompanies called with params:`, params)
    const result = await this.getAll<Company>(params)
    cache.set(cacheKey, result)
    return result
  }

  // 根据ID获取公司
  async getCompanyById(id: string): Promise<Company> {
    const cacheKey = `companies_${id}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyById called with id:`, id)
    const result = await this.getById<Company>(id)
    cache.set(cacheKey, result, 10 * 60 * 1000) // 10分钟缓存
    return result
  }

  // 创建公司
  async createCompany(data: Partial<Company>): Promise<Company> {
    console.info(`[CompanyService] createCompany called with data:`, data)
    const result = await this.create<Company>(data)
    // 清除相关缓存
    cache.delete('companies_all_undefined')
    return result
  }

  // 更新公司
  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    console.info(`[CompanyService] updateCompany called with id:`, id, 'data:', data)
    const result = await this.update<Company>(id, data)
    // 清除相关缓存
    cache.delete(`companies_${id}`)
    cache.delete('companies_all_undefined')
    return result
  }

  // 删除公司
  async deleteCompany(id: string): Promise<void> {
    console.warn(`[CompanyService] deleteCompany called with id:`, id)
    await this.delete(id)
    // 清除相关缓存
    cache.delete(`companies_${id}`)
    cache.delete('companies_all_undefined')
  }

  // 批量创建公司
  async batchCreateCompanies(data: Partial<Company>[]): Promise<Company[]> {
    console.info(`[CompanyService] batchCreateCompanies called with data:`, data)
    const result = await this.batchCreate<Company>(data)
    // 清除相关缓存
    cache.delete('companies_all_undefined')
    return result
  }

  // 批量更新公司
  async batchUpdateCompanies(data: Array<{ id: string; data: Partial<Company> }>): Promise<Company[]> {
    console.info(`[CompanyService] batchUpdateCompanies called with data:`, data)
    const result = await this.batchUpdate<Company>(data)
    // 清除相关缓存
    data.forEach(item => cache.delete(`companies_${item.id}`))
    cache.delete('companies_all_undefined')
    return result
  }

  // 批量删除公司
  async batchDeleteCompanies(ids: string[]): Promise<void> {
    console.warn(`[CompanyService] batchDeleteCompanies called with ids:`, ids)
    await this.batchDelete(ids)
    // 清除相关缓存
    ids.forEach(id => cache.delete(`companies_${id}`))
    cache.delete('companies_all_undefined')
  }

  // 搜索公司
  async searchCompanies(keyword: string, params?: PageQueryParams): Promise<PageResponse<Company>> {
    const cacheKey = `companies_search_${keyword}_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] searchCompanies called with keyword:`, keyword, 'params:', params)
    const result = await this.search<Company>(keyword, params)
    cache.set(cacheKey, result, 2 * 60 * 1000) // 2分钟缓存
    return result
  }

  // 获取公司统计信息
  async getCompanyStats(): Promise<any> {
    const cacheKey = 'companies_stats'
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyStats called`)
    const result = await this.getStats()
    cache.set(cacheKey, result)
    return result
  }

  // 启用公司
  async enableCompany(id: string): Promise<void> {
    console.info(`[CompanyService] enableCompany called with id:`, id)
    await this.enable(id)
    // 清除相关缓存
    cache.delete(`companies_${id}`)
    cache.delete('companies_all_undefined')
  }

  // 禁用公司
  async disableCompany(id: string): Promise<void> {
    console.warn(`[CompanyService] disableCompany called with id:`, id)
    await this.disable(id)
    // 清除相关缓存
    cache.delete(`companies_${id}`)
    cache.delete('companies_all_undefined')
  }

  // 上传公司logo
  async uploadCompanyLogo(id: string, file: File, onProgress?: (progress: number) => void): Promise<{ url: string; filename: string }> {
    console.info(`[CompanyService] uploadCompanyLogo called with id:`, id, 'file:', file.name)
    const result = await this.uploadFile(file, onProgress)
    // 清除相关缓存
    cache.delete(`companies_${id}`)
    return result
  }

  // 下载公司资料
  async downloadCompanyDocuments(id: string, filename?: string): Promise<void> {
    console.info(`[CompanyService] downloadCompanyDocuments called with id:`, id, 'filename:', filename)
    await this.downloadFile(id, filename)
  }

  // 获取公司详情（包含关联数据）
  async getCompanyDetails(id: string): Promise<Company & { contracts: any[]; personnel: any[] }> {
    const cacheKey = `companies_${id}_details`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyDetails called with id:`, id)
    try {
      const response = await fetch(`${this.baseUrl}/${id}/details`)
      if (!response.ok) {
        throw new ApiError(`Failed to fetch company details: ${response.statusText}`, response.status)
      }
      const result = await response.json()
      cache.set(cacheKey, result, 5 * 60 * 1000) // 5分钟缓存
      return result
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error occurred', 500, error)
    }
  }

  // 获取公司合同列表
  async getCompanyContracts(id: string, params?: PageQueryParams): Promise<PageResponse<any>> {
    const cacheKey = `companies_${id}_contracts_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyContracts called with id:`, id, 'params:', params)
    try {
      const response = await fetch(`${this.baseUrl}/${id}/contracts?${new URLSearchParams(params as any)}`)
      if (!response.ok) {
        throw new ApiError(`Failed to fetch company contracts: ${response.statusText}`, response.status)
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

  // 获取公司员工列表
  async getCompanyPersonnel(id: string, params?: PageQueryParams): Promise<PageResponse<any>> {
    const cacheKey = `companies_${id}_personnel_${JSON.stringify(params)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyPersonnel called with id:`, id, 'params:', params)
    try {
      const response = await fetch(`${this.baseUrl}/${id}/personnel?${new URLSearchParams(params as any)}`)
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

  // 验证公司数据
  async validateCompanyData(data: Partial<Company>): Promise<{ valid: boolean; errors: string[] }> {
    console.info(`[CompanyService] validateCompanyData called with data:`, data)
    const errors: string[] = []
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('公司名称不能为空')
    }
    
    if (!data.type || data.type.trim().length === 0) {
      errors.push('公司类型不能为空')
    }
    
    // 安全地访问 phone 属性
    if ('phone' in data && data.phone && typeof data.phone === 'string' && !/^1[3-9]\d{9}$/.test(data.phone)) {
      errors.push('手机号码格式不正确')
    }
    
    // 安全地访问 email 属性
    if ('email' in data && data.email && typeof data.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('邮箱格式不正确')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 检查公司名称是否重复
  async checkCompanyNameExists(name: string, excludeId?: string): Promise<boolean> {
    const cacheKey = `companies_check_name_${name}_${excludeId || ''}`
    const cached = cache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }
    
    console.info(`[CompanyService] checkCompanyNameExists called with name:`, name, 'excludeId:', excludeId)
    try {
      const response = await fetch(`${this.baseUrl}/check-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, excludeId })
      })
      if (!response.ok) {
        throw new ApiError(`Failed to check company name: ${response.statusText}`, response.status)
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
}

// 创建公司服务实例
export const companyService = ServiceFactory.createService(CompanyService)
