<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'
import CompanyForm from '@/components/forms/CompanyForm.vue'
import { companyService } from '@/services/company'
import type { TableColumn, TableAction, TablePagination } from '@/types/table'
import type { Company } from '@/types/company'
import { useCompaniesStore } from '@/stores/companies'
import { useWorkflowStore } from '@/stores/workflow'

// 表格列定义
const columns = ref<TableColumn[]>([
  {
    prop: 'id',
    label: '企业编号',
    width: '120'
  },
  {
    prop: 'name',
    label: '企业名称',
    width: '180'
  },
  {
    prop: 'address',
    label: '企业地址',
    width: '200'
  },
  {
    prop: 'contactPerson',
    label: '联系人',
    width: '100'
  },
  {
    prop: 'contactPhone',
    label: '联系电话',
    width: '140'
  },
  {
    prop: 'contactEmail',
    label: '邮箱',
    width: '180'
  },
  {
    prop: 'businessLicense',
    label: '营业执照号',
    width: '160'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100',
    formatter: (row: Company) => {
      if (!row?.status) return ''
      const status = statusMap[row.status as keyof typeof statusMap]
      return status ? status.label : row.status
    }
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: '160',
    formatter: (row: Company) => {
      if (!row?.createdAt) return ''
      return new Date(row.createdAt).toLocaleString()
    }
  }
])

// 表格数据
const tableData = ref<Company[]>([])
const loading = ref(false)
const error = ref<Error | string | null>(null)

// 分页配置
const pagination = ref<TablePagination>({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  small: false,
  background: true
})

// 公司表单相关
const showCompanyForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentCompany = ref<Company | null>(null)
const companiesStore = useCompaniesStore()
const workflowStore = useWorkflowStore()

// 工作流相关计算属性
const workflowProgress = computed(() => workflowStore.progress)
const currentStep = computed(() => workflowStore.currentStepInfo)
const isCurrentStepCompleted = computed(() => workflowStore.isCurrentStepCompleted)

// 状态映射
const statusMap = {
  active: { label: '正常', type: 'success' },
  inactive: { label: '停用', type: 'danger' },
  pending: { label: '待审核', type: 'warning' }
}

// 操作按钮
const actions = ref<TableAction[]>([
  {
    label: '编辑',
    type: 'primary',
    size: 'small',
    onClick: (row: Company, index: number) => {
      handleEdit(row, index)
    }
  },
  {
    label: '删除',
    type: 'danger',
    size: 'small',
    onClick: (row: Company, index: number) => {
      handleDelete(row, index)
    }
  },
  {
    label: '启用',
    type: 'success',
    size: 'small',
    visible: (row: Company) => row?.status === 'inactive',
    onClick: (row: Company, index: number) => {
      handleEnable(row, index)
    }
  },
  {
    label: '禁用',
    type: 'warning',
    size: 'small',
    visible: (row: Company) => row?.status === 'active',
    onClick: (row: Company, index: number) => {
      handleDisable(row, index)
    }
  }
])

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await companyService.getAllCompanies({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    
    tableData.value = result.data
    pagination.value.total = result.total
  } catch (err) {
    error.value = err as Error | string
    console.error('加载企业数据失败:', err)
    ElMessage.error('加载企业数据失败，将使用模拟数据')
    
    // 如果API调用失败，使用模拟数据作为后备
    try {
      // 模拟数据
      const mockData: Company[] = [
        {
          id: '1',
          name: '消防工程公司A',
          code: 'FIRE001',
          address: '北京市朝阳区消防科技园',
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
          address: '上海市浦东新区安全科技园',
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
        },
        {
          id: '3',
          name: '消防设备公司C',
          code: 'EQUIP003',
          address: '广州市天河区设备产业园',
          contactPerson: '王经理',
          contactPhone: '13800138002',
          contactEmail: 'wang@equipment.com',
          businessLicense: 'GZ003',
          taxNumber: 'TAX003',
          bankAccount: '6222081234567892',
          bankName: '农业银行',
          status: 'inactive',
          createdAt: '2023-02-15T00:00:00Z',
          updatedAt: '2023-02-15T00:00:00Z'
        },
        {
          id: '4',
          name: '消防检测公司D',
          code: 'TEST004',
          address: '深圳市南山区检测中心',
          contactPerson: '赵经理',
          contactPhone: '13800138003',
          contactEmail: 'zhao@test.com',
          businessLicense: 'SZ004',
          taxNumber: 'TAX004',
          bankAccount: '6222081234567893',
          bankName: '中国银行',
          status: 'pending',
          createdAt: '2023-03-20T00:00:00Z',
          updatedAt: '2023-03-20T00:00:00Z'
        }
      ]
      
      // 分页处理
      const startIndex = (pagination.value.page - 1) * pagination.value.pageSize
      const endIndex = startIndex + pagination.value.pageSize
      
      tableData.value = mockData.slice(startIndex, endIndex)
      pagination.value.total = mockData.length
    } catch (mockError) {
      console.error('加载模拟数据也失败:', mockError)
      ElMessage.error('无法加载任何数据，请稍后再试')
    }
  } finally {
    loading.value = false
  }
}

// 创建企业
const handleCreate = () => {
  formMode.value = 'create'
  currentCompany.value = null
  showCompanyForm.value = true
}

// 编辑企业
const handleEdit = (row: Company, _index: number) => {
  formMode.value = 'edit'
  currentCompany.value = row
  showCompanyForm.value = true
}

// 处理表单提交
const handleFormSubmit = (company: Company) => {
  ElMessage.success(`${formMode.value === 'create' ? '创建' : '编辑'}企业成功`)
  loadData() // 重新加载数据
  showCompanyForm.value = false
}

// 处理表单取消
const handleFormCancel = () => {
  showCompanyForm.value = false
}

// 删除企业
const handleDelete = async (row: any, _index: number) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除企业 "${row.name}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await companyService.deleteCompany(row.id)
    ElMessage.success('删除成功')
    loadData() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除企业失败:', error)
      ElMessage.error('删除企业失败')
    }
  }
}

// 启用企业
const handleEnable = async (row: any, _index: number) => {
  try {
    await companyService.enableCompany(row.id)
    ElMessage.success('启用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('启用企业失败:', error)
    ElMessage.error('启用企业失败')
  }
}

// 禁用企业
const handleDisable = async (row: any, _index: number) => {
  try {
    await companyService.disableCompany(row.id)
    ElMessage.success('禁用成功')
    loadData() // 重新加载数据
  } catch (error) {
    console.error('禁用企业失败:', error)
    ElMessage.error('禁用企业失败')
  }
}

// 页面变化处理
const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

// 每页条数变化处理
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadData()
}

// 完成当前工作流步骤
const completeCurrentStep = () => {
  workflowStore.completeStep(workflowStore.currentStep)
  ElMessage.success(`"${currentStep.value?.title || '当前步骤'}" 已标记为完成`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="company-list">
    <!-- 工作流状态卡片 -->
    <Card title="工作流进度" class="workflow-status-card">
      <div class="workflow-status">
        <div class="progress-info">
          <span class="current-step">当前步骤: {{ currentStep?.title || '未知' }}</span>
          <span class="progress-percentage">进度: {{ workflowProgress }}%</span>
        </div>
        <el-progress
          :percentage="workflowProgress"
          :color="isCurrentStepCompleted ? '#67c23a' : '#409eff'"
        />
        <div class="step-actions">
          <el-button
            type="success"
            size="small"
            :disabled="isCurrentStepCompleted"
            @click="completeCurrentStep"
          >
            <el-icon><Check /></el-icon>
            完成当前步骤
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="workflowStore.goToNextStep"
            :disabled="!workflowStore.canGoToNext"
          >
            下一步
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </Card>

    <Card title="企业管理">
      <!-- 操作按钮区域 -->
      <div class="table-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建企业
        </el-button>
      </div>
      
      <DataTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :error="error"
        :actions="actions"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </Card>
    
    <!-- 公司表单对话框 -->
    <CompanyForm
      v-model:visible="showCompanyForm"
      :company="currentCompany"
      :mode="formMode"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<style scoped>
.company-list {
  padding: 20px;
}

.workflow-status-card {
  margin-bottom: 20px;
}

.workflow-status {
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    
    .current-step {
      font-weight: 600;
      color: #303133;
    }
    
    .progress-percentage {
      color: #909399;
      font-size: 14px;
    }
  }
  
  .step-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.table-actions {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.table-actions .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-list {
    padding: 12px;
  }
  
  .table-actions {
    margin-bottom: 12px;
  }
  
  .table-actions .el-button {
    width: 100%;
    justify-content: center;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .table-actions .el-button {
    border-color: #4a4a4a;
    background-color: #2a2a2a;
    color: #e0e0e0;
  }
  
  .table-actions .el-button:hover {
    border-color: #5a5a5a;
    background-color: #3a3a3a;
  }
}
</style>
