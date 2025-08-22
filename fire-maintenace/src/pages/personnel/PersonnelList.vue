<template>
  <div class="personnel-page">
    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="breadcrumb-area">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <el-button link @click="goHome">
              <el-icon><HomeFilled /></el-icon>
              首页
            </el-button>
          </el-breadcrumb-item>
          <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-area">
        <el-button @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          回到首页
        </el-button>
      </div>
    </div>

    <ElRow :gutter="24" class="main-content">
      <!-- 左侧导航树 -->
      <ElCol :span="4">
        <ElCard class="navigation-card">
          <template #header>
            <div class="card-header">
              <span>功能导航</span>
            </div>
          </template>
          <NavigationTree
            :data="navigationData"
            :current-node="currentNode"
            @node-click="handleNodeClick"
          />
        </ElCard>
      </ElCol>

      <!-- 右侧内容区域 -->
      <ElCol :span="20">
        <ElCard class="content-card">
          <div class="personnel-list">
            <!-- 页面标题 -->
            <div class="page-header">
              <h2>人员管理</h2>
              <p>管理内部员工信息，包括工程师和操作员</p>
            </div>

    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-row :gutter="20" align="middle">
        <el-col :span="16">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input
                v-model="searchForm.name"
                placeholder="搜索姓名"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="searchForm.role"
                placeholder="角色"
                clearable
                @change="handleSearch"
              >
                <el-option label="工程师" value="engineer" />
                <el-option label="操作员" value="operator" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="searchForm.status"
                placeholder="状态"
                clearable
                @change="handleSearch"
              >
                <el-option label="在职" value="active" />
                <el-option label="离职" value="inactive" />
                <el-option label="休假" value="leave" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="searchForm.companyId"
                placeholder="公司"
                clearable
                @change="handleSearch"
              >
                <el-option
                  v-for="company in companies"
                  :key="company.id"
                  :label="company.name"
                  :value="company.id"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="searchForm.department"
                placeholder="部门"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              />
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加人员
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.total }}</div>
              <div class="stat-label">总人数</div>
            </div>
            <el-icon class="stat-icon total"><User /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.active }}</div>
              <div class="stat-label">在职人员</div>
            </div>
            <el-icon class="stat-icon active"><UserFilled /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.byRole.engineer }}</div>
              <div class="stat-label">工程师</div>
            </div>
            <el-icon class="stat-icon engineer"><Tools /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.byRole.operator }}</div>
              <div class="stat-label">操作员</div>
            </div>
            <el-icon class="stat-icon operator"><Operation /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeId" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="companyName" label="所属公司" width="150" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="skills" label="专业技能" min-width="200">
          <template #default="{ row }">
            <div class="skills-container">
              <el-tag
                v-for="skill in row.skills.slice(0, 3)"
                :key="skill"
                size="small"
                class="skill-tag"
              >
                {{ getSkillLabel(skill) }}
              </el-tag>
              <el-tag
                v-if="row.skills.length > 3"
                size="small"
                type="info"
                class="skill-tag"
              >
                +{{ row.skills.length - 3 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hireDate" label="入职日期" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <PersonnelForm
        ref="personnelFormRef"
        :model-value="currentPersonnel"
        :is-edit="isEdit"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="人员详情"
      width="600px"
    >
      <div v-if="viewPersonnel" class="personnel-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工号">
            {{ viewPersonnel.employeeId }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            {{ viewPersonnel.name }}
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag :type="getRoleType(viewPersonnel.role)">
              {{ getRoleLabel(viewPersonnel.role) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ viewPersonnel.department }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ viewPersonnel.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ viewPersonnel.email || '未填写' }}
          </el-descriptions-item>
          <el-descriptions-item label="入职日期">
            {{ viewPersonnel.hireDate }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewPersonnel.status)">
              {{ getStatusLabel(viewPersonnel.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="专业技能" :span="2">
            <div class="skills-detail">
              <el-tag
                v-for="skill in viewPersonnel.skills"
                :key="skill"
                class="skill-tag"
              >
                {{ getSkillLabel(skill) }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ viewPersonnel.remarks || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(viewPersonnel.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(viewPersonnel.updatedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
            </el-dialog>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElRow, ElCol, ElCard } from 'element-plus'
import {
  Search,
  Plus,
  Refresh,
  User,
  UserFilled,
  Tools,
  Operation,
  HomeFilled
} from '@element-plus/icons-vue'
import PersonnelForm from '@/components/forms/PersonnelForm.vue'
import NavigationTree from '@/components/navigation/NavigationTree.vue'
import { useNavigationStore } from '@/stores/navigation'
import { usePersonnelStore } from '@/stores/personnel'
import { useCompaniesStore } from '@/stores/companies'
import { personnelService } from '@/services/personnel'
import type {
  Personnel,
  PersonnelStatistics,
  PersonnelFormData
} from '@/types/personnel'
import type { NavigationItem } from '@/types/navigation'
import { roleMap, statusMap, skillOptions } from '@/types/personnel'
import { formatDate } from '@/utils/date'

// 使用路由和导航Store
const router = useRouter()
const navigationStore = useNavigationStore()
const personnelStore = usePersonnelStore()
const companiesStore = useCompaniesStore()

// 计算属性
const navigationData = computed(() => navigationStore.filteredNavigation)
const currentNode = computed(() => navigationStore.currentNavigation?.id || 'personnel')

// 处理导航树点击
const handleNodeClick = async (data: NavigationItem) => {
  if (!data.path) return
  navigationStore.setCurrentNavigation(data)
  await router.push(data.path)
}

// 回到首页
const goHome = () => {
  router.push('/')
}

// 响应式数据
const loading = ref(false)
const tableData = ref<Personnel[]>([])
const selectedRows = ref<Personnel[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const currentPersonnel = ref<Partial<Personnel>>({})
const viewPersonnel = ref<Personnel | null>(null)
const personnelFormRef = ref()

// 搜索表单
const searchForm = reactive({
  name: '',
  role: '',
  status: '',
  companyId: '',
  department: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 统计数据
const statistics = ref<PersonnelStatistics>({
  total: 0,
  active: 0,
  inactive: 0,
  leave: 0,
  byRole: {
    engineer: 0,
    operator: 0
  },
  byDepartment: {}
})

// 计算属性
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑人员' : '添加人员'
})

// 获取角色标签和类型的辅助函数
const getRoleLabel = (role: string) => {
  return (roleMap as any)[role]?.label || role
}

const getRoleType = (role: string) => {
  return (roleMap as any)[role]?.type || 'default'
}

const getStatusLabel = (status: string) => {
  return (statusMap as any)[status]?.label || status
}

const getStatusType = (status: string) => {
  return (statusMap as any)[status]?.type || 'default'
}

// 获取技能标签
const getSkillLabel = (skillValue: string) => {
  const skill = skillOptions.find(option => option.value === skillValue)
  return skill?.label || skillValue
}

// 公司数据
const companies = ref([
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
])

// 模拟数据
const mockData: Personnel[] = [
  {
    id: '1',
    name: '张工程师',
    employeeId: 'ENG001',
    role: 'engineer',
    phone: '13800138001',
    email: 'zhang.engineer@company.com',
    department: '技术部',
    hireDate: '2023-01-15',
    status: 'active',
    skills: ['fire_alarm', 'sprinkler_system', 'smoke_system'],
    companyId: '1',
    companyName: '消防工程公司A',
    remarks: '经验丰富的消防工程师',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: '李操作员',
    employeeId: 'OP001',
    role: 'operator',
    phone: '13800138002',
    email: 'li.operator@company.com',
    department: '运维部',
    hireDate: '2023-03-20',
    status: 'active',
    skills: ['fire_extinguisher', 'hydrant_system'],
    companyId: '2',
    companyName: '消防安全公司B',
    remarks: '认真负责的操作员',
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: '3',
    name: '王工程师',
    employeeId: 'ENG002',
    role: 'engineer',
    phone: '13800138003',
    email: 'wang.engineer@company.com',
    department: '技术部',
    hireDate: '2022-06-10',
    status: 'leave',
    skills: ['electrical_fire', 'gas_detection', 'emergency_lighting'],
    companyId: '1',
    companyName: '消防工程公司A',
    remarks: '电气消防专家',
    createdAt: '2022-06-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  }
]

// 方法
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 过滤数据 - 创建新的数组引用确保响应式更新
    let filteredData = [...mockData]
    
    if (searchForm.name.trim()) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchForm.name.toLowerCase().trim())
      )
    }
    if (searchForm.role) {
      filteredData = filteredData.filter(item => item.role === searchForm.role)
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }
    if (searchForm.companyId) {
      filteredData = filteredData.filter(item => item.companyId === searchForm.companyId)
    }
    if (searchForm.department.trim()) {
      filteredData = filteredData.filter(item =>
        item.department.toLowerCase().includes(searchForm.department.toLowerCase().trim())
      )
    }

    // 强制更新表格数据
    tableData.value = [...filteredData]
    pagination.total = filteredData.length

    // 更新统计数据 - 使用全部数据进行统计
    updateStatistics(mockData)
    
    console.log('数据加载完成，当前显示:', filteredData.length, '条记录')
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const updateStatistics = (data: Personnel[]) => {
  statistics.value = {
    total: data.length,
    active: data.filter(item => item.status === 'active').length,
    inactive: data.filter(item => item.status === 'inactive').length,
    leave: data.filter(item => item.status === 'leave').length,
    byRole: {
      engineer: data.filter(item => item.role === 'engineer').length,
      operator: data.filter(item => item.role === 'operator').length
    },
    byDepartment: data.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleRefresh = () => {
  Object.assign(searchForm, {
    name: '',
    role: '',
    status: '',
    companyId: '',
    department: ''
  })
  pagination.page = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  currentPersonnel.value = {}
  dialogVisible.value = true
}

const handleEdit = (row: Personnel) => {
  isEdit.value = true
  currentPersonnel.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row: Personnel) => {
  viewPersonnel.value = row
  viewDialogVisible.value = true
}

const handleDelete = async (row: Personnel) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除人员 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 模拟删除操作
    const index = mockData.findIndex(item => item.id === row.id)
    if (index > -1) {
      mockData.splice(index, 1)
      ElMessage.success('删除成功')
      // 立即更新表格数据
      await loadData()
    } else {
      ElMessage.error('删除失败：未找到该人员')
    }
  } catch {
    // 用户取消删除
  }
}

const handleFormSubmit = async (formData: Partial<Personnel>) => {
  try {
    // 确保必填字段存在
    if (!formData.name || !formData.employeeId || !formData.role || !formData.phone || !formData.department || !formData.hireDate || !formData.status) {
      ElMessage.error('请填写所有必填字段')
      return
    }

    const completeFormData: PersonnelFormData = {
      name: formData.name,
      employeeId: formData.employeeId,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      department: formData.department,
      hireDate: formData.hireDate,
      status: formData.status as 'active' | 'inactive' | 'leave',
      skills: formData.skills || [],
      companyId: formData.companyId || '',
      remarks: formData.remarks
    }

    if (isEdit.value) {
      // 更新操作
      const index = mockData.findIndex(item => item.id === currentPersonnel.value.id)
      if (index > -1) {
        mockData[index] = {
          ...mockData[index],
          ...completeFormData,
          companyName: companies.value.find(c => c.id === formData.companyId)?.name || mockData[index].companyName,
          updatedAt: new Date().toISOString()
        }
        ElMessage.success('更新成功')
      }
    } else {
      // 创建操作
      const newPersonnel: Personnel = {
        id: Date.now().toString(),
        ...completeFormData,
        companyName: companies.value.find(c => c.id === formData.companyId)?.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockData.push(newPersonnel)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('操作失败:', error)
  }
}

const handleFormCancel = () => {
  dialogVisible.value = false
}

const handleSelectionChange = (selection: Personnel[]) => {
  selectedRows.value = selection
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
// 导入外部样式文件
@import '@/styles/variables.scss';
@import '@/styles/navigation.scss';
@import '@/styles/home-layout.scss';

.personnel-page {
  .top-bar {
    height: 50px;
    background-color: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin: 20px;
    margin-bottom: $spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .breadcrumb-area {
      :deep(.el-breadcrumb) {
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: #606266;
            font-weight: normal;

            &.is-link:hover {
              color: #409eff;
            }
          }

          &:last-child {
            .el-breadcrumb__inner {
              color: #409eff;
              font-weight: 500;
            }
          }
        }
      }
    }
    
    .action-area {
      :deep(.el-button) {
        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }

  .main-content {
    height: calc(100vh - 90px);
    margin: 0 20px 20px 20px;
    
    .el-col {
      &:first-child {
        padding-right: $spacing-md;
      }
      
      &:last-child {
        padding-left: $spacing-md;
      }
    }
    
    .navigation-card {
      height: 100%;
      
      .card-header {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    
    .content-card {
      height: 100%;
      overflow: auto;
    }
  }
}

.personnel-list {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }
  }

  .search-bar {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .text-right {
      text-align: right;
    }
  }

  .stats-cards {
    margin-bottom: 20px;

    .stat-card {
      position: relative;
      overflow: hidden;

      :deep(.el-card__body) {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .stat-content {
        .stat-number {
          font-size: 28px;
          font-weight: 600;
          color: #303133;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }

      .stat-icon {
        font-size: 40px;
        opacity: 0.8;

        &.total {
          color: #409eff;
        }

        &.active {
          color: #67c23a;
        }

        &.engineer {
          color: #e6a23c;
        }

        &.operator {
          color: #f56c6c;
        }
      }
    }
  }

  .table-card {
    :deep(.el-card__body) {
      padding: 0;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .skill-tag {
        margin: 0;
      }
    }

    .pagination-container {
      padding: 20px;
      text-align: right;
      border-top: 1px solid #ebeef5;
    }
  }

  .personnel-detail {
    .skills-detail {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .skill-tag {
        margin: 0;
      }
    }
  }
}
</style>