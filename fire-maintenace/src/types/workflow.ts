export interface WorkflowStep {
  id: string
  name: string
  title: string
  description: string
  order: number
  isCompleted: boolean
  isRequired: boolean
  dependsOn?: string[]
  route?: string
  icon?: string
}

export interface WorkflowStatus {
  currentStep: string
  completedSteps: string[]
  availableSteps: string[]
  progress: number
  data: Record<string, any>
}

export interface WorkflowNavigation {
  canGoNext: boolean
  canGoPrevious: boolean
  canGoToStep: (stepId: string) => boolean
  nextStep?: string
  previousStep?: string
}

export interface PrefillData {
  stepId: string
  data: Record<string, any>
  source: 'previous' | 'api' | 'default'
  timestamp: Date
}

export interface StepValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: Record<string, any>
}
