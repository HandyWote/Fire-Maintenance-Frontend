import { Project } from './project'

export interface Report {
  id: string
  code: string
  projectId: string
  project: Project
  type: 'inspection' | 'maintenance' | 'assessment'
  title: string
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'signed' | 'published'
  reportDate: Date
  period: {
    startDate: Date
    endDate: Date
  }
  content: ReportContent
  review: ReportReview[]
  signature?: ReportSignature
  attachments: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface ReportCreateRequest {
  projectId: string
  type: 'inspection' | 'maintenance' | 'assessment'
  title: string
  reportDate: Date
  period: {
    startDate: Date
    endDate: Date
  }
  content: ReportContent
}

export interface ReportUpdateRequest extends Partial<ReportCreateRequest> {
  id: string
}

export interface ReportQueryParams {
  keyword?: string
  projectId?: string
  type?: 'inspection' | 'maintenance' | 'assessment'
  status?: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'signed' | 'published'
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ReportResponse {
  data: Report[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ReportContent {
  summary: string
  findings: ReportFinding[]
  recommendations: string[]
  statistics: ReportStatistics
  appendix?: ReportAppendix
}

export interface ReportFinding {
  id: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  location: string
  facility?: string
  recommendation: string
  status: 'open' | 'in_progress' | 'resolved' | 'deferred'
  assignedTo?: string
  dueDate?: Date
  images?: string[]
}

export interface ReportStatistics {
  totalFindings: number
  findingsBySeverity: {
    low: number
    medium: number
    high: number
    critical: number
  }
  findingsByCategory: Record<string, number>
  findingsByStatus: {
    open: number
    in_progress: number
    resolved: number
    deferred: number
  }
  complianceScore: number
  overallScore: number
}

export interface ReportAppendix {
  images: string[]
  documents: string[]
  references: string[]
  glossary?: Record<string, string>
}

export interface ReportReview {
  id: string
  reportId: string
  reviewer: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  comments: string
  reviewedAt: Date
}

export interface ReportSignature {
  id: string
  reportId: string
  signer: string
  role: string
  signature: string
  signedAt: Date
  ipAddress?: string
  userAgent?: string
}

export interface ReportGenerationRequest {
  projectId: string
  type: 'inspection' | 'maintenance' | 'assessment'
  period: {
    startDate: Date
    endDate: Date
  }
  template?: string
  options: {
    includeImages: boolean
    includeStatistics: boolean
    includeRecommendations: boolean
    format: 'pdf' | 'docx' | 'html'
  }
}

export interface ReportGenerationResponse {
  reportId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  error?: string
  progress: number
  estimatedTime?: number
}

export interface ReportTemplate {
  id: string
  name: string
  type: 'inspection' | 'maintenance' | 'assessment'
  description: string
  content: string
  variables: string[]
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
