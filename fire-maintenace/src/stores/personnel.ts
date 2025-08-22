import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import type { Personnel, PersonnelFormData, PersonnelRole, PersonnelStatus } from '@/types/personnel'

export interface PersonnelFilter {
  keyword?: string
  department?: string
  role?: PersonnelRole
  status?: PersonnelStatus
  companyId?: string
  dateRange?: [string, string]
}

export interface PersonnelState {
  personnel: Personnel[]
  currentPersonnel: Personnel | null
  loading: boolean
  error: string | null
  filter: PersonnelFilter
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const usePersonnelStore = defineStore('personnel', () => {
  // 状态定义
  const personnel = ref<Personnel[]>([])
  const currentPersonnel = ref<Personnel | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const filter = ref<PersonnelFilter>({})
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 计算属性
  const filteredPersonnel = computed(() => {
    let result = [...personnel.value]

    // 关键词过滤
    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase()
      result = result.filter((p: Personnel) => 
        p.name.toLowerCase().includes(keyword) ||
        p.employeeId.toLowerCase().includes(keyword) ||
        p.department.toLowerCase().includes(keyword) ||
        (p.companyName && p.companyName.toLowerCase().includes(keyword))
      )
    }

    // 部门过滤
    if (filter.value.department) {
      result = result.filter((p: Personnel) => p.department === filter.value.department)
    }

    // 角色过滤
    if (filter.value.role) {
      result = result.filter((p: Personnel) => p.role === filter.value.role)
    }

    // 状态过滤
    if (filter.value.status) {
      result = result.filter((p: Personnel) => p.status === filter.value.status)
    }

    // 公司过滤
    if (filter.value.companyId) {
      result = result.filter((p: Personnel) => p.companyId === filter.value.companyId)
    }

    // 日期范围过滤
    if (filter.value.dateRange) {
      const [startDate, endDate] = filter.value.dateRange
      result = result.filter((p: Personnel) => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate)
      })
    }

    return result
  })

  const paginatedPersonnel = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filteredPersonnel.value.slice(start, end)
  })

  const totalPersonnel = computed(() => {
    return filteredPersonnel.value.length
  })

  const activePersonnel = computed(() => {
    return personnel.value.filter((p: Personnel) => p.status === 'active')
  })

  const inactivePersonnel = computed(() => {
    return personnel.value.filter((p: Personnel) => p.status === 'inactive')
  })

  const leavePersonnel = computed(() => {
    return personnel.value.filter((p: Personnel) => p.status === 'leave')
  })

  const personnelByRole = computed(() => {
    const roleCount: Record<string, number> = {}
    
    personnel.value.forEach((p: Personnel) => {
      roleCount[p.role] = (roleCount[p.role] || 0) + 1
    })
    
    return roleCount
  })

  const personnelByDepartment = computed(() => {
    const departmentCount: Record<string, number> = {}
    
    personnel.value.forEach((p: Personnel) => {
      departmentCount[p.department] = (departmentCount[p.department] || 0) + 1
    })
    
    return departmentCount
  })

  const personnelByCompany = computed(() => {
    const companyCount: Record<string, number> = {}
    
    personnel.value.forEach((p: Personnel) => {
      companyCount[p.companyName || p.companyId] = (companyCount[p.companyName || p.companyId] || 0) + 1
    })
    
    return companyCount
  })

  // 动作
  function setPersonnel(newPersonnel: Personnel[]) {
    personnel.value = newPersonnel
    pagination.value.total = newPersonnel.length
  }

  function addPersonnel(person: Personnel) {
    personnel.value.push(person)
    pagination.value.total = personnel.value.length
  }

  function updatePersonnel(updatedPersonnel: Personnel) {
    const index = personnel.value.findIndex((p: Personnel) => p.id === updatedPersonnel.id)
    if (index !== -1) {
      personnel.value[index] = updatedPersonnel
      if (currentPersonnel.value?.id === updatedPersonnel.id) {
        currentPersonnel.value = updatedPersonnel
      }
    }
  }

  function deletePersonnel(personnelId: string) {
    const index = personnel.value.findIndex((p: Personnel) => p.id === personnelId)
    if (index !== -1) {
      personnel.value.splice(index, 1)
      pagination.value.total = personnel.value.length
      if (currentPersonnel.value?.id === personnelId) {
        currentPersonnel.value = null
      }
    }
  }

  function setCurrentPersonnel(person: Personnel | null) {
    currentPersonnel.value = person
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function setFilter(newFilter: Partial<PersonnelFilter>) {
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

  function generateEmployeeId(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `EMP${timestamp.slice(-6)}${random}`
  }

  function validatePersonnelData(data: Partial<PersonnelFormData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!data.name || data.name.trim() === '') {
      errors.name = '姓名不能为空'
    }

    if (!data.employeeId || data.employeeId.trim() === '') {
      errors.employeeId = '员工编号不能为空'
    }

    if (!data.department || data.department.trim() === '') {
      errors.department = '部门不能为空'
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = '联系电话不能为空'
    } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
      errors.phone = '请输入有效的手机号码'
    }

    if (data.email && data.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        errors.email = '请输入有效的邮箱地址'
      }
    }

    if (!data.companyId || data.companyId.trim() === '') {
      errors.companyId = '所属公司不能为空'
    }

    if (!data.role || data.role.trim() === '') {
      errors.role = '角色不能为空'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  function exportToCSV(): string {
    const headers = [
      '员工编号',
      '姓名',
      '部门',
      '联系电话',
      '邮箱',
      '所属公司',
      '角色',
      '状态',
      '入职日期',
      '专业技能',
      '创建时间'
    ]

    const rows = personnel.value.map((p: Personnel) => [
      p.employeeId,
      p.name,
      p.department,
      p.phone,
      p.email || '',
      p.companyName || '',
      p.role,
      p.status === 'active' ? '在职' : p.status === 'inactive' ? '离职' : '休假',
      p.hireDate,
      p.skills.join(', '),
      new Date(p.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...rows]
      .map((row: (string | number)[]) => row.map((cell: string | number) => `"${cell}"`).join(','))
      .join('\n')

    return '\ufeff' + csvContent // 添加BOM以支持中文
  }

  function reset() {
    personnel.value = []
    currentPersonnel.value = null
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
    personnel,
    currentPersonnel,
    loading,
    error,
    filter,
    pagination,

    // 计算属性
    filteredPersonnel,
    paginatedPersonnel,
    totalPersonnel,
    activePersonnel,
    inactivePersonnel,
    leavePersonnel,
    personnelByRole,
    personnelByDepartment,
    personnelByCompany,

    // 动作
    setPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    setCurrentPersonnel,
    setLoading,
    setError,
    setFilter,
    clearFilter,
    setPagination,
    setPage,
    setPageSize,
    generateEmployeeId,
    validatePersonnelData,
    exportToCSV,
    reset,
    $reset
  }
})

// 热模块替换支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonnelStore, import.meta.hot))
}
