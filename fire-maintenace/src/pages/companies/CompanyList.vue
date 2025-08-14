<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import Card from '@/components/common/Card.vue'

// 表格列定义
const columns = ref([
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
    prop: 'type',
    label: '企业类型',
    width: '120'
  },
  {
    prop: 'industry',
    label: '所属行业',
    width: '140'
  },
  {
    prop: 'address',
    label: '企业地址',
    width: '200'
  },
  {
    prop: 'contact',
    label: '联系人',
    width: '100'
  },
  {
    prop: 'phone',
    label: '联系电话',
    width: '140'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: '160'
  }
])

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const error = ref<Error | string | null>(null)

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  small: false,
  background: true
})

// 操作按钮
const actions = [
  {
    label: '编辑',
    type: 'primary' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('编辑企业:', row, index)
    }
  },
  {
    label: '删除',
    type: 'danger' as const,
    size: 'small' as const,
    onClick: (row: any, index: number) => {
      console.log('删除企业:', row, index)
    }
  }
]

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = [
      {
        id: 'COM001',
        name: '北京科技有限公司',
        type: '有限责任公司',
        industry: '信息技术',
        address: '北京市朝阳区科技园区',
        contact: '张经理',
        phone: '010-12345678',
        status: '正常',
        createdAt: '2024-01-01 10:00:00'
      },
      {
        id: 'COM002',
        name: '上海商贸有限公司',
        type: '股份有限公司',
        industry: '贸易',
        address: '上海市浦东新区商务区',
        contact: '李总',
        phone: '021-87654321',
        status: '正常',
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: 'COM003',
        name: '广州制造有限公司',
        type: '有限责任公司',
        industry: '制造业',
        address: '广州市天河区工业区',
        contact: '王厂长',
        phone: '020-11223344',
        status: '暂停',
        createdAt: '2024-01-03 10:00:00'
      }
    ]
    
    tableData.value = mockData
    pagination.value.total = mockData.length
  } catch (err) {
    error.value = err as Error | string
    console.error('加载企业数据失败:', err)
  } finally {
    loading.value = false
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

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="company-list">
    <Card title="企业管理">
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
  </div>
</template>

<style scoped>
.company-list {
  padding: 20px;
}
</style>
