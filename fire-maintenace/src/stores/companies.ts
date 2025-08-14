import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

export interface Company {
  id: string
  name: string
  code: string
  address: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  businessLicense: string
  taxNumber: string
  bankAccount: string
  bankName: string
  status: 'active' | 'inactive' | 'pending'
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyFormData {
  name: string
  code: string
  address: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  businessLicense: string
  taxNumber: string
  bankAccount: string
  bankName: string
  status: 'active' | 'inactive' | 'pending'
  description?: string
}

export interface CompanyFilter {
  keyword?: string
  status?: 'active' | 'inactive' | 'pending'
  dateRange?: [string, string]
}

export interface CompanyState {
  companies: Company[]
  currentCompany: Company | null
  loading: boolean
  error: string | null
  filter: CompanyFilter
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const useCompaniesStore = defineStore('companies', () => {
  // 状态定义
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const filter = ref<CompanyFilter>({})
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 计算属性
  const filteredCompanies = computed(() => {
    let result = [...companies.value]

    // 关键词过滤
    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase()
      result = result.filter(company => 
        company.name.toLowerCase().includes(keyword) ||
        company.code.toLowerCase().includes(keyword) ||
        company.contactPerson.toLowerCase().includes(keyword)
      )
    }

    // 状态过滤
    if (filter.value.status) {
      result = result.filter(company => company.status === filter.value.status)
    }

    return result
  })

  const paginatedCompanies = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filteredCompanies.value.slice(start, end)
  })

  const totalCompanies = computed(() => {
    return filteredCompanies.value.length
  })

  const activeCompanies = computed(() => {
    return companies.value.filter(company => company.status === 'active')
  })

  const inactiveCompanies = computed(() => {
    return companies.value.filter(company => company.status === 'inactive')
  })

  const pendingCompanies = computed(() => {
    return companies.value.filter(company => company.status === 'pending')
  })

  // 动作
  function setCompanies(newCompanies: Company[]) {
    companies.value = newCompanies
    pagination.value.total = newCompanies.length
  }

  function addCompany(company: Company) {
    companies.value.push(company)
    pagination.value.total = companies.value.length
  }

  function updateCompany(updatedCompany: Company) {
    const index = companies.value.findIndex(c => c.id === updatedCompany.id)
    if (index !== -1) {
      companies.value[index] = updatedCompany
      if (currentCompany.value?.id === updatedCompany.id) {
        currentCompany.value = updatedCompany
      }
    }
  }

  function deleteCompany(companyId: string) {
    const index = companies.value.findIndex(c => c.id === companyId)
    if (index !== -1) {
      companies.value.splice(index, 1)
      pagination.value.total = companies.value.length
      if (currentCompany.value?.id === companyId) {
        currentCompany.value = null
      }
    }
  }

  function setCurrentCompany(company: Company | null) {
    currentCompany.value = company
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function setFilter(newFilter: Partial<CompanyFilter>) {
    filter.value = { ...filter.value, ...newFilter }
    pagination.value.page = 1 // 重置页码
  }

  function clearFilter() {
    filter.value = {}
    pagination.value.page = 1
  }

  function setPagination(newPagination: Partial<typeof pagination.value>) {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  function setPage(page: number) {
    pagination.value.page = page
  }

  function setPageSize(pageSize: number) {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }

  function generateCompanyCode(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `COMP${timestamp.slice(-6)}${random}`
  }

  function validateCompanyData(data: Partial<CompanyFormData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!data.name || data.name.trim() === '') {
      errors.name = '公司名称不能为空'
    }

    if (!data.code || data.code.trim() === '') {
      errors.code = '公司编号不能为空'
    }

    if (!data.contactPerson || data.contactPerson.trim() === '') {
      errors.contactPerson = '联系人不能为空'
    }

    if (!data.contactPhone || data.contactPhone.trim() === '') {
      errors.contactPhone = '联系电话不能为空'
    } else if (!/^1[3-9]\d{9}$/.test(data.contactPhone)) {
      errors.contactPhone = '请输入有效的手机号码'
    }

    if (data.contactEmail && data.contactEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.contactEmail)) {
        errors.contactEmail = '请输入有效的邮箱地址'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  function exportToCSV(): string {
    const headers = [
      '公司名称',
      '公司编号',
      '地址',
      '联系人',
      '联系电话',
      '邮箱',
      '营业执照号',
      '税号',
      '银行账号',
      '开户行',
      '状态',
      '创建时间'
    ]

    const rows = companies.value.map(company => [
      company.name,
      company.code,
      company.address,
      company.contactPerson,
      company.contactPhone,
      company.contactEmail,
      company.businessLicense,
      company.taxNumber,
      company.bankAccount,
      company.bankName,
      company.status === 'active' ? '正常' : company.status === 'inactive' ? '停用' : '待审核',
      new Date(company.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return '\ufeff' + csvContent // 添加BOM以支持中文
  }

  function reset() {
    companies.value = []
    currentCompany.value = null
    loading.value = false
    error.value = null
    filter.value = {}
    pagination.value = {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }

  // 重置方法
  function $reset() {
    reset()
  }

  return {
    // 状态
    companies,
    currentCompany,
    loading,
    error,
    filter,
    pagination,

    // 计算属性
    filteredCompanies,
    paginatedCompanies,
    totalCompanies,
    activeCompanies,
    inactiveCompanies,
    pendingCompanies,

    // 动作
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    setCurrentCompany,
    setLoading,
    setError,
    setFilter,
    clearFilter,
    setPagination,
    setPage,
    setPageSize,
    generateCompanyCode,
    validateCompanyData,
    exportToCSV,
    reset,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCompaniesStore, import.meta.hot))
}
