<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElForm, ElFormItem, ElButton, ElRow, ElCol } from 'element-plus'

interface FormField {
  prop: string
  label: string
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'switch' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rules?: any[]
  options?: Array<{ label: string; value: any }>
  span?: number
  defaultValue?: any
  description?: string
}

interface FormProps {
  model: Record<string, any>
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  readonly?: boolean
  showActions?: boolean
  actionText?: {
    submit?: string
    reset?: string
    cancel?: string
  }
  loading?: boolean
}

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'horizontal',
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  showActions: true,
  actionText: () => ({
    submit: '提交',
    reset: '重置',
    cancel: '取消'
  }),
  loading: false
})

const emit = defineEmits<{
  submit: [model: Record<string, any>]
  reset: []
  cancel: []
  fieldChange: [field: string, value: any]
  validate: [isValid: boolean]
}>()

const formRef = ref<InstanceType<typeof ElForm>>()
const localModel = ref<Record<string, any>>({})

// 初始化本地模型
const initializeModel = () => {
  localModel.value = {}
  props.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      localModel.value[field.prop] = field.defaultValue
    } else if (props.model[field.prop] !== undefined) {
      localModel.value[field.prop] = props.model[field.prop]
    } else {
      localModel.value[field.prop] = ''
    }
  })
}

// 监听外部模型变化
watch(() => props.model, (newModel) => {
  Object.keys(newModel).forEach(key => {
    if (localModel.value[key] !== newModel[key]) {
      localModel.value[key] = newModel[key]
    }
  })
}, { deep: true })

// 监听字段变化
watch(() => props.fields, initializeModel, { immediate: true })

// 获取表单规则
const getFormRules = () => {
  const rules: Record<string, any[]> = {}
  
  props.fields.forEach(field => {
    if (field.rules && field.rules.length > 0) {
      rules[field.prop] = field.rules
    } else if (field.required) {
      rules[field.prop] = [
        { required: true, message: `${field.label}不能为空`, trigger: 'blur' }
      ]
    }
  })
  
  return rules
}

// 获取字段类型组件
const renderField = (field: FormField) => {
  const commonProps = {
    modelValue: localModel.value[field.prop],
    'onUpdate:modelValue': (value: any) => handleFieldChange(field.prop, value),
    placeholder: field.placeholder || `请输入${field.label}`,
    disabled: props.disabled || field.disabled,
    readonly: props.readonly || field.readonly,
    size: props.size
  }

  switch (field.type) {
    case 'textarea':
      return h('el-input', {
        ...commonProps,
        type: 'textarea',
        rows: 4
      })
    
    case 'select':
      return h('el-select', {
        ...commonProps,
        clearable: true
      }, {
        default: () => field.options?.map(option => 
          h('el-option', {
            key: option.value,
            label: option.label,
            value: option.value
          })
        )
      })
    
    case 'date':
      return h('el-date-picker', {
        ...commonProps,
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      })
    
    case 'switch':
      return h('el-switch', {
        ...commonProps,
        inlinePrompt: true
      })
    
    case 'checkbox':
      return h('el-checkbox-group', {
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h('el-checkbox', {
            key: option.value,
            label: option.value
          }, () => option.label)
        )
      })
    
    case 'radio':
      return h('el-radio-group', {
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h('el-radio', {
            key: option.value,
            label: option.value
          }, () => option.label)
        )
      })
    
    default:
      return h('el-input', {
        ...commonProps,
        type: field.type,
        showPassword: field.type === 'password'
      })
  }
}

// 处理字段变化
const handleFieldChange = (field: string, value: any) => {
  localModel.value[field] = value
  emit('fieldChange', field, value)
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    emit('validate', valid)
    
    if (valid) {
      emit('submit', { ...localModel.value })
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    emit('validate', false)
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    initializeModel()
    emit('reset')
  }
}

// 取消表单
const cancelForm = () => {
  emit('cancel')
}

// 获取布局类
const getLayoutClass = () => {
  return `form-layout-${props.layout}`
}

// 获取字段span
const getFieldSpan = (field: FormField) => {
  return field.span || (props.layout === 'inline' ? 6 : 24)
}

// 手动导入h函数
import { h } from 'vue'
</script>

<template>
  <div class="form-wrapper" :class="getLayoutClass()">
    <ElForm
      ref="formRef"
      :model="localModel"
      :rules="getFormRules()"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :size="size"
      :disabled="disabled"
      :inline="layout === 'inline'"
    >
      <ElRow :gutter="20">
        <ElCol
          v-for="field in fields"
          :key="field.prop"
          :span="getFieldSpan(field)"
        >
          <ElFormItem
            :label="field.label"
            :prop="field.prop"
            :required="field.required"
            :rules="field.rules"
          >
            <component :is="() => renderField(field)" />
            
            <div v-if="field.description" class="field-description">
              {{ field.description }}
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      
      <!-- 操作按钮 -->
      <div v-if="showActions" class="form-actions">
        <ElButton
          type="primary"
          :loading="loading"
          @click="submitForm"
        >
          {{ actionText.submit }}
        </ElButton>
        
        <ElButton @click="resetForm">
          {{ actionText.reset }}
        </ElButton>
        
        <ElButton @click="cancelForm">
          {{ actionText.cancel }}
        </ElButton>
      </div>
    </ElForm>
  </div>
</template>

<style scoped>
.form-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-layout-horizontal {
  /* 水平布局样式 */
}

.form-layout-vertical {
  /* 垂直布局样式 */
}

.form-layout-vertical :deep(.el-form-item) {
  flex-direction: column;
  align-items: flex-start;
}

.form-layout-vertical :deep(.el-form-item__label) {
  width: 100% !important;
  text-align: left;
  margin-bottom: 8px;
}

.form-layout-inline {
  /* 内联布局样式 */
}

.field-description {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.form-actions :deep(.el-button) {
  min-width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 16px;
  }
  
  .form-layout-horizontal :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 8px;
  }
  
  .form-layout-horizontal :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .form-actions :deep(.el-button) {
    width: 100%;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .form-wrapper {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .field-description {
    color: #a0a0a0;
  }
}

/* 动画效果 */
.form-wrapper {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
