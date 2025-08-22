import { BaseService, ServiceFactory, ApiError } from './base'
import type { Company } from '@/types/company'
import type { PageQueryParams, PageResponse } from '@/types'
import { Cache } from '@/utils/performance'

// 模拟公司数据
const mockCompanies: Company[] = [
  {
    id: '1',
    name: '消防工程公司A',
    code: 'FIRE001',
    address: '北京市朝阳区消防科技园',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    contactEmail: 'zhang@fire.com',
    businessLicense: 'BJ001',
    taxNumber: 'TAX001',
    bankAccount: '6222081234567890',
    bankName: '工商银行',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '消防安全公司B',
    code: 'SAFE002',
    address: '上海市浦东新区安全科技园',
    contactPerson: '李经理',
    contactPhone: '13800138001',
    contactEmail: 'li@safe.com',
    businessLicense: 'SH002',
    taxNumber: 'TAX002',
    bankAccount: '6222081234567891',
    bankName: '建设银行',
    status: 'active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '消防设备公司C',
    code: 'EQUIP003',
    address: '广州市天河区设备产业园',
    contactPerson: '王经理',
    contactPhone: '13800138002',
    contactEmail: 'wang@equipment.com',
    businessLicense: 'GZ003',
    taxNumber: 'TAX003',
    bankAccount: '6222081234567892',
    bankName: '农业银行',
    status: 'inactive',
    createdAt: '2023-02-15T00:00:00Z',
    updatedAt: '2023-02-15T00:00:00Z'
  },
  {
    id: '4',
    name: '消防检测公司D',
    code: 'TEST004',
    address: '深圳市南山区检测中心',
    contactPerson: '赵经理',
    contactPhone: '13800138003',
    contactEmail: 'zhao@test.com',
    businessLicense: 'SZ004',
    taxNumber: 'TAX004',
    bankAccount: '6222081234567893',
    bankName: '中国银行',
    status: 'pending',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2023-03-20T00:00:00Z'
  }
]

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
    
    try {
      // 尝试调用真实API
      const result = await this.getAll<Company>(params)
      cache.set(cacheKey, result)
      return result
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const page = params?.page || 1
      const pageSize = params?.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      
      const data = mockCompanies.slice(startIndex, endIndex)
      
      const mockResult: PageResponse<Company> = {
        data,
        total: mockCompanies.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockCompanies.length / pageSize)
      }
      
      cache.set(cacheKey, mockResult)
      return mockResult
    }
  }

  // 根据ID获取公司
  async getCompanyById(id: string): Promise<Company> {
    const cacheKey = `companies_${id}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    console.info(`[CompanyService] getCompanyById called with id:`, id)
    
    try {
      // 尝试调用真实API
      const result = await this.getById<Company>(id)
      cache.set(cacheKey, result, 10 * 60 * 1000) // 10分钟缓存
      return result
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const company = mockCompanies.find(c => c.id === id)
      if (!company) {
        throw new ApiError(`Company with id ${id} not found`, 404)
      }
      
      cache.set(cacheKey, company, 10 * 60 * 1000) // 10分钟缓存
      return company
    }
  }

  // 创建公司
  async createCompany(data: Partial<Company>): Promise<Company> {
    console.info(`[CompanyService] createCompany called with data:`, data)
    
    try {
      // 尝试调用真实API
      const result = await this.create<Company>(data)
      // 清除相关缓存
      cache.delete('companies_all_undefined')
      return result
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const newCompany: Company = {
        id: Date.now().toString(),
        name: data.name || '',
        code: data.code || '',
        address: data.address || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contactEmail: data.contactEmail || '',
        businessLicense: data.businessLicense || '',
        taxNumber: data.taxNumber || '',
        bankAccount: data.bankAccount || '',
        bankName: data.bankName || '',
        status: data.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockCompanies.push(newCompany)
      // 清除相关缓存
      cache.delete('companies_all_undefined')
      
      return newCompany
    }
  }

  // 更新公司
  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    console.info(`[CompanyService] updateCompany called with id:`, id, 'data:', data)
    
    try {
      // 尝试调用真实API
      const result = await this.update<Company>(id, data)
      // 清除相关缓存
      cache.delete(`companies_${id}`)
      cache.delete('companies_all_undefined')
      return result
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const index = mockCompanies.findIndex(c => c.id === id)
      if (index === -1) {
        throw new ApiError(`Company with id ${id} not found`, 404)
      }
      
      mockCompanies[index] = {
        ...mockCompanies[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      // 清除相关缓存
      cache.delete(`companies_${id}`)
      cache.delete('companies_all_undefined')
      
      return mockCompanies[index]
    }
  }

  // 删除公司
  async deleteCompany(id: string): Promise<void> {
    console.warn(`[CompanyService] deleteCompany called with id:`, id)
    
    try {
      // 尝试调用真实API
      await this.delete(id)
      // 清除相关缓存
      cache.delete(`companies_${id}`)
      cache.delete('companies_all_undefined')
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const index = mockCompanies.findIndex(c => c.id === id)
      if (index === -1) {
        throw new ApiError(`Company with id ${id} not found`, 404)
      }
      
      mockCompanies.splice(index, 1)
      // 清除相关缓存
      cache.delete(`companies_${id}`)
      cache.delete('companies_all_undefined')
    }
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
    
    try {
      // 尝试调用真实API
      const result = await this.getStats()
      cache.set(cacheKey, result)
      return result
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error)
      
      // 使用模拟数据
      const stats = {
        total: mockCompanies.length,
        active: mockCompanies.filter(c => c.status === 'active').length,
        inactive: mockCompanies.filter(c => c.status === 'inactive').length,
        pending: mockCompanies.filter(c => c.status === 'pending').length,
        byType: {
          customer: mockCompanies.filter(c => c.name.includes('客户')).length,
          contractor: mockCompanies.filter(c => c.name.includes('承包')).length,
          supplier: mockCompanies.filter(c => c.name.includes('供应商')).length
        }
      }
      
      cache.set(cacheKey, stats)
      return stats
    }
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
