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

export interface CompanyCreateRequest extends CompanyFormData {}

export interface CompanyUpdateRequest extends Partial<CompanyFormData> {
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
