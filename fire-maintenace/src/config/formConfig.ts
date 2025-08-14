/**
 * 统一表单配置管理
 * 用于管理所有表单的字段配置、验证规则等
 */

import type { FormFieldConfig } from '@/composables/useFormValidation'
import { ValidationRules } from '@/composables/useFormValidation'

/**
 * 表单字段类型定义
 */
export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'date' 
  | 'switch' 
  | 'checkbox' 
  | 'radio'

/**
 * 表单字段配置接口
 */
export interface FormField {
  prop: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  options?: Array<{ label: string; value: any }>
  span?: number
  defaultValue?: any
  description?: string
  validation?: {
    rules?: any[]
    asyncRules?: any[]
  }
  dependencies?: {
    field: string
    value: any
    action: 'show' | 'hide' | 'enable' | 'disable'
  }[]
}

/**
 * 表单配置接口
 */
export interface FormConfig {
  id: string
  name: string
  description?: string
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  showActions?: boolean
  actionText?: {
    submit?: string
    reset?: string
    cancel?: string
  }
  validation?: {
    validateOnBlur?: boolean
    validateOnChange?: boolean
    validateOnSubmit?: boolean
  }
}

/**
 * 公司表单配置
 */
export const companyFormConfig: FormConfig = {
  id: 'company',
  name: '公司表单',
  description: '用于创建和编辑公司信息的表单',
  layout: 'horizontal',
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  showActions: true,
  actionText: {
    submit: '提交',
    reset: '重置',
    cancel: '取消'
  },
  validation: {
    validateOnBlur: true,
    validateOnChange: false,
    validateOnSubmit: true
  },
  fields: [
    {
      prop: 'name',
      label: '公司名称',
      type: 'text',
      required: true,
      placeholder: '请输入公司名称',
      span: 12,
      validation: {
        rules: [
          ValidationRules.required('公司名称不能为空'),
          ValidationRules.minLength(2, '公司名称长度在2-100个字符'),
          ValidationRules.maxLength(100, '公司名称长度在2-100个字符')
        ]
      }
    },
    {
      prop: 'code',
      label: '公司编号',
      type: 'text',
      required: true,
      placeholder: '请输入公司编号',
      span: 12,
      validation: {
        rules: [
          ValidationRules.required('公司编号不能为空'),
          ValidationRules.minLength(2, '公司编号长度在2-50个字符'),
          ValidationRules.maxLength(50, '公司编号长度在2-50个字符')
        ]
      }
    },
    {
      prop: 'address',
      label: '公司地址',
      type: 'text',
      required: true,
      placeholder: '请输入公司地址',
      span: 24,
      validation: {
        rules: [
          ValidationRules.required('公司地址不能为空'),
          ValidationRules.minLength(5, '公司地址长度在5-200个字符'),
          ValidationRules.maxLength(200, '公司地址长度在5-200个字符')
        ]
      }
    },
    {
      prop: 'contactPerson',
      label: '联系人',
      type: 'text',
      required: true,
      placeholder: '请输入联系人姓名',
      span: 12,
      validation: {
        rules: [
          ValidationRules.required('联系人不能为空'),
          ValidationRules.minLength(2, '联系人姓名长度在2-50个字符'),
          ValidationRules.maxLength(50, '联系人姓名长度在2-50个字符')
        ]
      }
    },
    {
      prop: 'contactPhone',
      label: '联系电话',
      type: 'text',
      required: true,
      placeholder: '请输入联系电话',
      span: 12,
      validation: {
        rules: [
          ValidationRules.required('联系电话不能为空'),
          ValidationRules.phone('请输入有效的手机号码')
        ]
      }
    },
    {
      prop: 'contactEmail',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱地址',
      span: 12,
      validation: {
        rules: [
          ValidationRules.email('请输入有效的邮箱地址')
        ]
      }
    },
    {
      prop: 'businessLicense',
      label: '营业执照号',
      type: 'text',
      required: true,
      placeholder: '请输入营业执照号',
      span: 12,
      validation: {
        rules: [
          ValidationRules.required('营业执照号不能为空'),
          ValidationRules.minLength(15, '营业执照号长度在15-30个字符'),
          ValidationRules.maxLength(30, '营业执照号长度在15-30个字符')
        ]
      }
    },
    {
      prop: 'taxNumber',
      label: '税号',
      type: 'text',
      placeholder: '请输入税号',
      span: 12,
      validation: {
        rules: [
          ValidationRules.minLength(15, '税号长度在15-30个字符'),
          ValidationRules.maxLength(30, '税号长度在15-30个字符')
        ]
      }
    },
    {
      prop: 'bankAccount',
      label: '银行账号',
      type: 'text',
      placeholder: '请输入银行账号',
      span: 12,
      validation: {
        rules: [
          ValidationRules.minLength(10, '银行账号长度在10-30个字符'),
          ValidationRules.maxLength(30, '银行账号长度在10-30个字符')
        ]
      }
    },
    {
      prop: 'bankName',
      label: '开户行',
      type: 'text',
      placeholder: '请输入开户行名称',
      span: 12,
      validation: {
        rules: [
          ValidationRules.minLength(4, '开户行名称长度在4-50个字符'),
          ValidationRules.maxLength(50, '开户行名称长度在4-50个字符')
        ]
      }
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      required: true,
      options: [
        { label: '正常', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '待审核', value: 'pending' }
      ],
      span: 12,
      defaultValue: 'active',
      validation: {
        rules: [
          ValidationRules.required('状态不能为空')
        ]
      }
    },
    {
      prop: 'description',
      label: '备注',
      type: 'textarea',
      placeholder: '请输入备注信息',
      span: 24,
      validation: {
        rules: [
          ValidationRules.maxLength(500, '备注长度不能超过500个字符')
        ]
      }
    }
  ]
}

/**
 * 表单配置管理器
 */
export class FormConfigManager {
  private static instance: FormConfigManager
  private configs: Map<string, FormConfig> = new Map()

  private constructor() {
    // 初始化默认配置
    this.registerConfig('company', companyFormConfig)
  }

  /**
   * 获取单例实例
   */
  static getInstance(): FormConfigManager {
    if (!FormConfigManager.instance) {
      FormConfigManager.instance = new FormConfigManager()
    }
    return FormConfigManager.instance
  }

  /**
   * 注册表单配置
   */
  registerConfig(id: string, config: FormConfig): void {
    this.configs.set(id, config)
  }

  /**
   * 获取表单配置
   */
  getConfig(id: string): FormConfig | undefined {
    return this.configs.get(id)
  }

  /**
   * 获取所有表单配置
   */
  getAllConfigs(): FormConfig[] {
    return Array.from(this.configs.values())
  }

  /**
   * 移除表单配置
   */
  removeConfig(id: string): boolean {
    return this.configs.delete(id)
  }

  /**
   * 检查配置是否存在
   */
  hasConfig(id: string): boolean {
    return this.configs.has(id)
  }

  /**
   * 获取表单字段配置
   */
  getFieldConfig(formId: string, fieldProp: string): FormField | undefined {
    const config = this.getConfig(formId)
    return config?.fields.find(field => field.prop === fieldProp)
  }

  /**
   * 获取表单验证规则
   */
  getValidationRules(formId: string): Record<string, any[]> {
    const config = this.getConfig(formId)
    const rules: Record<string, any[]> = {}

    config?.fields.forEach(field => {
      if (field.validation?.rules) {
        rules[field.prop] = field.validation.rules
      } else if (field.required) {
        rules[field.prop] = [ValidationRules.required(`${field.label}不能为空`)]
      }
    })

    return rules
  }

  /**
   * 转换为 useFromValidation 所需的配置格式
   */
  toUseFormValidationConfig(formId: string): {
    fields: FormFieldConfig[]
    autoValidate: boolean
    validateOnBlur: boolean
    validateOnChange: boolean
    validateOnSubmit: boolean
  } {
    const config = this.getConfig(formId)
    if (!config) {
      throw new Error(`Form config with id '${formId}' not found`)
    }

    return {
      fields: config.fields.map(field => ({
        name: field.prop,
        label: field.label,
        type: this.mapFieldType(field.type),
        defaultValue: field.defaultValue,
        rules: field.validation?.rules || [],
        visible: true,
        disabled: false
      })),
      autoValidate: true,
      validateOnBlur: config.validation?.validateOnBlur ?? true,
      validateOnChange: config.validation?.validateOnChange ?? false,
      validateOnSubmit: config.validation?.validateOnSubmit ?? true
    }
  }

  /**
   * 映射字段类型到 useFromValidation 所需的类型
   */
  private mapFieldType(type: FieldType): FormFieldConfig['type'] {
    const typeMap: Record<FieldType, FormFieldConfig['type']> = {
      'text': 'text',
      'number': 'number',
      'email': 'email',
      'password': 'text',
      'textarea': 'textarea',
      'select': 'select',
      'date': 'date',
      'switch': 'text',
      'checkbox': 'checkbox',
      'radio': 'radio'
    }
    return typeMap[type] || 'text'
  }
}

// 导出单例实例
export const formConfigManager = FormConfigManager.getInstance()

// 便捷方法
export const getFormConfig = (id: string) => formConfigManager.getConfig(id)
export const registerFormConfig = (id: string, config: FormConfig) => formConfigManager.registerConfig(id, config)
export const getValidationRules = (formId: string) => formConfigManager.getValidationRules(formId)
