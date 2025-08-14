export interface Personnel {
  id: string
  name: string
  employeeId: string
  department: string
  position: string
  phone: string
  email: string
  companyId: string
  companyName: string
  role: 'admin' | 'manager' | 'engineer' | 'operator' | 'inspector'
  status: 'active' | 'inactive' | 'pending'
  gender?: 'male' | 'female'
  age?: number
  idNumber?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  hireDate?: string
  certificateNumber?: string
  certificateExpiryDate?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface PersonnelFormData {
  name: string
  employeeId: string
  department: string
  position: string
  phone: string
  email: string
  companyId: string
  role: 'admin' | 'manager' | 'engineer' | 'operator' | 'inspector'
  status: 'active' | 'inactive' | 'pending'
  gender?: 'male' | 'female'
  age?: number
  idNumber?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  hireDate?: string
  certificateNumber?: string
  certificateExpiryDate?: string
  description?: string
}

export interface PersonnelCreateRequest extends PersonnelFormData {}

export interface PersonnelUpdateRequest extends Partial<PersonnelFormData> {
  id: string
}

export interface PersonnelQueryParams {
  keyword?: string
  department?: string
  position?: string
  role?: 'admin' | 'manager' | 'engineer' | 'operator' | 'inspector'
  status?: 'active' | 'inactive' | 'pending'
  companyId?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PersonnelResponse {
  data: Personnel[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PersonnelStatistics {
  total: number
  active: number
  inactive: number
  pending: number
  byRole: {
    admin: number
    manager: number
    engineer: number
    operator: number
    inspector: number
  }
  byDepartment: Record<string, number>
}

// 角色映射
export const roleMap = {
  admin: { label: '管理员', type: 'danger' },
  manager: { label: '经理', type: 'warning' },
  engineer: { label: '工程师', type: 'primary' },
  operator: { label: '操作员', type: 'success' },
  inspector: { label: '检查员', type: 'info' }
} as const

// 状态映射
export const statusMap = {
  active: { label: '在职', type: 'success' },
  inactive: { label: '离职', type: 'danger' },
  pending: { label: '待审核', type: 'warning' }
} as const

// 性别映射
export const genderMap = {
  male: { label: '男', type: 'primary' },
  female: { label: '女', type: 'success' }
} as const
