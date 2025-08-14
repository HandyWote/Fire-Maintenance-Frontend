import { Company } from './company'

export interface Project {
  id: string
  name: string
  code: string
  companyId: string
  company: Company
  type: 'maintenance' | 'inspection' | 'assessment'
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  startDate: Date
  endDate?: Date
  expectedEndDate?: Date
  budget?: number
  actualCost?: number
  description?: string
  projectManager: string
  projectManagerContact: string
  buildings: Building[]
  contracts: Contract[]
  maintenancePlans: MaintenancePlan[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface ProjectCreateRequest {
  name: string
  code: string
  companyId: string
  type: 'maintenance' | 'inspection' | 'assessment'
  startDate: Date
  endDate?: Date
  expectedEndDate?: Date
  budget?: number
  description?: string
  projectManager: string
  projectManagerContact: string
}

export interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {
  id: string
}

export interface ProjectQueryParams {
  keyword?: string
  companyId?: string
  type?: 'maintenance' | 'inspection' | 'assessment'
  status?: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProjectResponse {
  data: Project[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProjectStatistics {
  total: number
  byStatus: {
    planning: number
    active: number
    paused: number
    completed: number
    cancelled: number
  }
  byType: {
    maintenance: number
    inspection: number
    assessment: number
  }
  totalBudget: number
  totalActualCost: number
}

export interface Building {
  id: string
  name: string
  code: string
  type: 'residential' | 'commercial' | 'industrial' | 'public' | 'other'
  floors: number
  area: number
  address: string
  contactPerson: string
  contactPhone: string
  fireFacilities: FireFacility[]
  createdAt: Date
  updatedAt: Date
}

export interface FireFacility {
  id: string
  name: string
  type: string
  location: string
  installDate: Date
  lastInspectionDate?: Date
  nextInspectionDate: Date
  status: 'normal' | 'warning' | 'error' | 'maintenance'
  description?: string
}

export interface Contract {
  id: string
  code: string
  projectId: string
  project: Project
  type: 'maintenance' | 'inspection' | 'assessment'
  amount: number
  startDate: Date
  endDate: Date
  status: 'draft' | 'active' | 'expired' | 'terminated'
  terms?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface MaintenancePlan {
  id: string
  code: string
  projectId: string
  project: Project
  name: string
  type: 'monthly' | 'quarterly' | 'semiannual' | 'annual'
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled'
  startDate: Date
  endDate: Date
  tasks: MaintenanceTask[]
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceTask {
  id: string
  planId: string
  plan: MaintenancePlan
  name: string
  type: 'inspection' | 'testing' | 'maintenance'
  facilityType: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual'
  assignedTo: string
  dueDate: Date
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'
  estimatedDuration: number
  actualDuration?: number
  description?: string
  result?: TaskResult
  createdAt: Date
  updatedAt: Date
}

export interface TaskResult {
  id: string
  taskId: string
  status: 'pass' | 'fail' | 'warning'
  score?: number
  findings: string[]
  recommendations: string[]
  attachments?: string[]
  completedAt: Date
  completedBy: string
  notes?: string
}
