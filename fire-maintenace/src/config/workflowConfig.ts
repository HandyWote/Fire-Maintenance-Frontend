import type { WorkflowStep } from '@/types/workflow'

/**
 * 消防维护管理系统工作流配置
 * 根据业务流程：基础信息录入 → 项目建立 → 维保计划 → APP执业 → 报告生成 → 签署下载
 */
export const workflowSteps: WorkflowStep[] = [
  {
    id: 'basic-info',
    name: 'basicInfo',
    title: '基础信息录入',
    description: '录入公司、人员和建筑物等基础信息',
    order: 1,
    isCompleted: false,
    isRequired: true,
    route: '/companies',
    icon: 'Document'
  },
  {
    id: 'project-setup',
    name: 'projectSetup',
    title: '项目建立',
    description: '创建项目并关联基础信息',
    order: 2,
    isCompleted: false,
    isRequired: true,
    dependsOn: ['basic-info'],
    route: '/projects',
    icon: 'FolderOpened'
  },
  {
    id: 'maintenance-plan',
    name: 'maintenancePlan',
    title: '维保计划',
    description: '制定维保计划和任务分配',
    order: 3,
    isCompleted: false,
    isRequired: true,
    dependsOn: ['project-setup'],
    route: '/plans',
    icon: 'Calendar'
  },
  {
    id: 'field-operation',
    name: 'fieldOperation',
    title: 'APP执业',
    description: '现场执行维保任务',
    order: 4,
    isCompleted: false,
    isRequired: true,
    dependsOn: ['maintenance-plan'],
    route: '/monitor',
    icon: 'Mobile'
  },
  {
    id: 'report-generation',
    name: 'reportGeneration',
    title: '报告生成',
    description: '生成维保报告和审核',
    order: 5,
    isCompleted: false,
    isRequired: true,
    dependsOn: ['field-operation'],
    route: '/report-generation',
    icon: 'DocumentAdd'
  },
  {
    id: 'sign-download',
    name: 'signDownload',
    title: '签署下载',
    description: '签署报告并下载存档',
    order: 6,
    isCompleted: false,
    isRequired: true,
    dependsOn: ['report-generation'],
    route: '/report-download',
    icon: 'Download'
  }
]

/**
 * 获取工作流步骤
 * @param stepId 步骤ID
 * @returns 工作流步骤
 */
export const getWorkflowStep = (stepId: string): WorkflowStep | undefined => {
  return workflowSteps.find(step => step.id === stepId)
}

/**
 * 获取工作流步骤索引
 * @param stepId 步骤ID
 * @returns 步骤索引
 */
export const getWorkflowStepIndex = (stepId: string): number => {
  return workflowSteps.findIndex(step => step.id === stepId)
}

/**
 * 获取下一个工作流步骤
 * @param stepId 当前步骤ID
 * @returns 下一个工作流步骤
 */
export const getNextWorkflowStep = (stepId: string): WorkflowStep | undefined => {
  const currentIndex = getWorkflowStepIndex(stepId)
  if (currentIndex >= 0 && currentIndex < workflowSteps.length - 1) {
    return workflowSteps[currentIndex + 1]
  }
  return undefined
}

/**
 * 获取上一个工作流步骤
 * @param stepId 当前步骤ID
 * @returns 上一个工作流步骤
 */
export const getPreviousWorkflowStep = (stepId: string): WorkflowStep | undefined => {
  const currentIndex = getWorkflowStepIndex(stepId)
  if (currentIndex > 0) {
    return workflowSteps[currentIndex - 1]
  }
  return undefined
}

/**
 * 检查是否可以导航到指定步骤
 * @param stepId 目标步骤ID
 * @param completedSteps 已完成的步骤ID数组
 * @returns 是否可以导航
 */
export const canNavigateToStep = (stepId: string, completedSteps: string[]): boolean => {
  const step = getWorkflowStep(stepId)
  if (!step) return false
  
  // 如果步骤已完成，可以导航
  if (completedSteps.includes(stepId)) return true
  
  // 检查依赖项是否已完成
  if (step.dependsOn && step.dependsOn.length > 0) {
    return step.dependsOn.every(depId => completedSteps.includes(depId))
  }
  
  // 如果没有依赖项，可以导航
  return true
}

/**
 * 获取工作流进度百分比
 * @param completedSteps 已完成的步骤ID数组
 * @returns 进度百分比
 */
export const getWorkflowProgress = (completedSteps: string[]): number => {
  if (workflowSteps.length === 0) return 0
  return Math.round((completedSteps.length / workflowSteps.length) * 100)
}

/**
 * 获取可用的步骤
 * @param completedSteps 已完成的步骤ID数组
 * @returns 可用的步骤ID数组
 */
export const getAvailableSteps = (completedSteps: string[]): string[] => {
  return workflowSteps
    .filter(step => canNavigateToStep(step.id, completedSteps))
    .map(step => step.id)
}

/**
 * 检查工作流是否完成
 * @param completedSteps 已完成的步骤ID数组
 * @returns 工作流是否完成
 */
export const isWorkflowCompleted = (completedSteps: string[]): boolean => {
  return workflowSteps.every(step => completedSteps.includes(step.id))
}

/**
 * 获取工作流导航信息
 * @param currentStepId 当前步骤ID
 * @param completedSteps 已完成的步骤ID数组
 * @returns 工作流导航信息
 */
export const getWorkflowNavigation = (currentStepId: string, completedSteps: string[]) => {
  const currentIndex = getWorkflowStepIndex(currentStepId)
  const previousStep = getPreviousWorkflowStep(currentStepId)
  const nextStep = getNextWorkflowStep(currentStepId)
  
  return {
    canGoPrevious: currentIndex > 0,
    canGoNext: currentIndex < workflowSteps.length - 1 && canNavigateToStep(nextStep?.id || '', completedSteps),
    canGoToStep: (stepId: string) => canNavigateToStep(stepId, completedSteps),
    nextStep: nextStep?.id,
    previousStep: previousStep?.id
  }
}