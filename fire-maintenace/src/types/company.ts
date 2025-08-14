export interface Company {
  id: string
  name: string
  code: string
  type: 'customer' | 'contractor' | 'supplier'
  status: 'active' | 'inactive' | 'pending'
  contactPerson: string
  contactPhone: string
  contactEmail: string
  address: string
  registrationNumber?: string
  taxNumber?: string
  businessScope?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface CompanyCreateRequest {
  name: string
  code: string
  type: 'customer' | 'contractor' | 'supplier'
  contactPerson: string
  contactPhone: string
  contactEmail: string
  address: string
  registrationNumber?: string
  taxNumber?: string
  businessScope?: string
  description?: string
}

export interface CompanyUpdateRequest extends Partial<CompanyCreateRequest> {
  id: string
}

export interface CompanyQueryParams {
  keyword?: string
  type?: 'customer' | 'contractor' | 'supplier'
  status?: 'active' | 'inactive' | 'pending'
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CompanyResponse {
  data: Company[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CompanyStatistics {
  total: number
  active: number
  inactive: number
  pending: number
  byType: {
    customer: number
    contractor: number
    supplier: number
  }
}
