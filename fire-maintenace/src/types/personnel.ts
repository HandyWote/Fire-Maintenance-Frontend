export interface Personnel {
  id: string
  name: string
  employeeId: string
  role: PersonnelRole
  phone: string
  email?: string
  department: string
  hireDate: string
  status: PersonnelStatus
  skills: string[]
  remarks?: string
  createdAt: string
  updatedAt: string
}

export type PersonnelRole = 'engineer' | 'operator'
export type PersonnelStatus = 'active' | 'inactive' | 'leave'

export interface PersonnelFormData {
  name: string
  employeeId: string
  role: PersonnelRole
  phone: string
  email?: string
  department: string
  hireDate: string
  status: PersonnelStatus
  skills: string[]
  remarks?: string
}

export interface PersonnelListQuery {
  page: number
  pageSize: number
  name?: string
  role?: PersonnelRole
  department?: string
  status?: PersonnelStatus
}

export interface PersonnelListResponse {
  data: Personnel[]
  total: number
  page: number
  pageSize: number
}

export interface PersonnelCreateRequest extends PersonnelFormData {}

export interface PersonnelUpdateRequest extends Partial<PersonnelFormData> {
  id: string
}

export interface PersonnelStatistics {
  total: number
  active: number
  inactive: number
  leave: number
  byRole: Record<PersonnelRole, number>
  byDepartment: Record<string, number>
}

// 角色映射 - 使用更严格的类型
export const roleMap: Record<PersonnelRole, { label: string; type: string }> = {
  engineer: { label: '工程师', type: 'primary' },
  operator: { label: '操作员', type: 'success' }
} as const

// 状态映射 - 使用更严格的类型
export const statusMap: Record<PersonnelStatus, { label: string; type: string }> = {
  active: { label: '在职', type: 'success' },
  inactive: { label: '离职', type: 'danger' },
  leave: { label: '休假', type: 'warning' }
} as const

// 专业技能选项 - 可以后续从API加载
export const skillOptions = [
  { value: 'fire_power', label: '消防供配电设施' },
  { value: 'fire_alarm', label: '火灾自动报警系统' },
  { value: 'electrical_fire', label: '电气火灾监控系统' },
  { value: 'gas_detection', label: '可燃气体探测报警系统' },
  { value: 'fire_water', label: '消防供水设施' },
  { value: 'hydrant_system', label: '消火栓灭火系统' },
  { value: 'sprinkler_system', label: '自动喷水灭火系统' },
  { value: 'foam_system', label: '泡沫灭火系统' },
  { value: 'gas_system', label: '气体灭火系统' },
  { value: 'smoke_system', label: '防排烟系统' },
  { value: 'emergency_lighting', label: '应急照明和疏散指示' },
  { value: 'emergency_broadcast', label: '应急广播系统' },
  { value: 'fire_phone', label: '消防专用电话' },
  { value: 'fire_separation', label: '防火分隔设施' },
  { value: 'water_mist', label: '细水雾灭火系统' },
  { value: 'dry_powder', label: '干粉灭火系统' },
  { value: 'fire_extinguisher', label: '灭火器' },
  { value: 'fire_elevator', label: '消防电梯系统' }
] as const

// 类型安全的辅助函数
export const getRoleInfo = (role: PersonnelRole) => roleMap[role]
export const getStatusInfo = (status: PersonnelStatus) => statusMap[status]
export const getSkillLabel = (skillValue: string) => {
  const skill = skillOptions.find(option => option.value === skillValue)
  return skill?.label || skillValue
}