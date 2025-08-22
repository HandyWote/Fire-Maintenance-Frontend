<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    class="personnel-form"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入人员姓名"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="工号" prop="employeeId">
          <el-input
            v-model="formData.employeeId"
            placeholder="请输入工号"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属公司" prop="companyId">
          <el-select
            v-model="formData.companyId"
            placeholder="请选择所属公司"
            style="width: 100%"
            filterable
            clearable
          >
            <el-option
              v-for="company in companies"
              :key="company.id"
              :label="company.name"
              :value="company.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="部门" prop="department">
          <el-input
            v-model="formData.department"
            placeholder="请输入所属部门"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker
            v-model="formData.hireDate"
            type="date"
            placeholder="请选择入职日期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="formData.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
            <el-option label="休假" value="leave" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="formData.role"
            placeholder="请选择角色"
            style="width: 100%"
            allow-create
            filterable
          >
            <el-option label="工程师" value="engineer" />
            <el-option label="操作员" value="operator" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="专业技能" prop="skills">
      <el-select
        v-model="formData.skills"
        multiple
        placeholder="请选择专业技能"
        style="width: 100%"
      >
        <el-option label="消防供配电设施" value="fire_power" />
        <el-option label="火灾自动报警系统" value="fire_alarm" />
        <el-option label="电气火灾监控系统" value="electrical_fire" />
        <el-option label="可燃气体探测报警系统" value="gas_detection" />
        <el-option label="消防供水设施" value="fire_water" />
        <el-option label="消火栓灭火系统" value="hydrant_system" />
        <el-option label="自动喷水灭火系统" value="sprinkler_system" />
        <el-option label="泡沫灭火系统" value="foam_system" />
        <el-option label="气体灭火系统" value="gas_system" />
        <el-option label="防排烟系统" value="smoke_system" />
        <el-option label="应急照明和疏散指示" value="emergency_lighting" />
        <el-option label="应急广播系统" value="emergency_broadcast" />
        <el-option label="消防专用电话" value="fire_phone" />
        <el-option label="防火分隔设施" value="fire_separation" />
        <el-option label="细水雾灭火系统" value="water_mist" />
        <el-option label="干粉灭火系统" value="dry_powder" />
        <el-option label="灭火器" value="fire_extinguisher" />
        <el-option label="消防电梯系统" value="fire_elevator" />
      </el-select>
    </el-form-item>

    <el-form-item label="备注" prop="remarks">
      <el-input
        v-model="formData.remarks"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? '更新' : '创建' }}
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Personnel } from '@/types/personnel'
import { useCompaniesStore } from '@/stores/companies'
import { companyService } from '@/services/company'
import type { Company } from '@/types/company'

interface Props {
  modelValue?: Partial<Personnel>
  isEdit?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<Personnel>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  isEdit: false
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const companiesStore = useCompaniesStore()
const companies = ref<Company[]>([])

const formData = reactive<Partial<Personnel>>({
  name: '',
  employeeId: '',
  role: 'operator',
  phone: '',
  email: '',
  department: '',
  hireDate: '',
  status: 'active',
  skills: [],
  companyId: '',
  remarks: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入人员姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  employeeId: [
    { required: true, message: '请输入工号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+$/, message: '工号只能包含字母和数字', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  companyId: [
    { required: true, message: '请选择所属公司', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 监听props变化，更新表单数据
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      Object.assign(formData, newValue)
    }
  },
  { immediate: true, deep: true }
)

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
}

// 获取公司列表
const loadCompanies = async () => {
  try {
    // 调用API获取公司列表
    const response = await companyService.getAllCompanies({
      page: 1,
      pageSize: 100 // 获取足够多的公司数据
    })
    companies.value = response.data
  } catch (error) {
    console.error('加载公司列表失败:', error)
    // 如果API失败，使用模拟数据作为后备
    companies.value = [
      {
        id: '1',
        name: '消防工程公司A',
        code: 'FIRE001',
        address: '北京市朝阳区',
        contactPerson: '张经理',
        contactPhone: '13800138000',
        contactEmail: 'zhang@fire.com',
        businessLicense: 'BJ001',
        taxNumber: 'TAX001',
        bankAccount: '6222081234567890',
        bankName: '工商银行',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: '消防安全公司B',
        code: 'SAFE002',
        address: '上海市浦东新区',
        contactPerson: '李经理',
        contactPhone: '13800138001',
        contactEmail: 'li@safe.com',
        businessLicense: 'SH002',
        taxNumber: 'TAX002',
        bankAccount: '6222081234567891',
        bankName: '建设银行',
        status: 'active',
        createdAt: '2023-01-02T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z'
      }
    ]
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 组件挂载时加载公司列表
onMounted(() => {
  loadCompanies()
})

defineExpose({
  resetForm
})
</script>

<style scoped lang="scss">
.personnel-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-input__wrapper) {
    border-radius: 6px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-textarea__inner) {
    border-radius: 6px;
  }
}
</style>