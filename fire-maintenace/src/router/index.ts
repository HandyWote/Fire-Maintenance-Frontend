import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
      meta: {
        title: '首页',
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    // 暂时注释掉其他路由，等待页面组件创建
    // {
    //   path: '/companies',
    //   name: 'Companies',
    //   component: () => import('@/pages/companies/CompanyList.vue'),
    //   meta: {
    //     title: '企业管理',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/companies/:id',
    //   name: 'CompanyDetail',
    //   component: () => import('@/pages/companies/CompanyDetail.vue'),
    //   meta: {
    //     title: '企业详情',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/personnel',
    //   name: 'Personnel',
    //   component: () => import('@/pages/personnel/PersonnelList.vue'),
    //   meta: {
    //     title: '人员管理',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/buildings',
    //   name: 'Buildings',
    //   component: () => import('@/pages/buildings/BuildingList.vue'),
    //   meta: {
    //     title: '建筑管理',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/projects',
    //   name: 'Projects',
    //   component: () => import('@/pages/projects/ProjectList.vue'),
    //   meta: {
    //     title: '项目管理',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/projects/:id',
    //   name: 'ProjectDetail',
    //   component: () => import('@/pages/projects/ProjectDetail.vue'),
    //   meta: {
    //     title: '项目详情',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/contracts',
    //   name: 'Contracts',
    //   component: () => import('@/pages/contracts/ContractList.vue'),
    //   meta: {
    //     title: '合同管理',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/maintenance-plans',
    //   name: 'MaintenancePlans',
    //   component: () => import('@/pages/maintenance-plans/MaintenancePlanList.vue'),
    //   meta: {
    //     title: '维保计划',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/plan-create',
    //   name: 'PlanCreate',
    //   component: () => import('@/pages/plan-create/PlanCreate.vue'),
    //   meta: {
    //     title: '创建计划',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/plan-detail/:id',
    //   name: 'PlanDetail',
    //   component: () => import('@/pages/plan-detail/PlanDetail.vue'),
    //   meta: {
    //     title: '计划详情',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/operation-monitor',
    //   name: 'OperationMonitor',
    //   component: () => import('@/pages/operation-monitor/OperationMonitor.vue'),
    //   meta: {
    //     title: '运行监控',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/task-progress',
    //   name: 'TaskProgress',
    //   component: () => import('@/pages/task-progress/TaskProgress.vue'),
    //   meta: {
    //     title: '任务进度',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/field-data',
    //   name: 'FieldData',
    //   component: () => import('@/pages/field-data/FieldData.vue'),
    //   meta: {
    //     title: '现场数据',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/report-generation',
    //   name: 'ReportGeneration',
    //   component: () => import('@/pages/report-generation/ReportGeneration.vue'),
    //   meta: {
    //     title: '报告生成',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/report-review',
    //   name: 'ReportReview',
    //   component: () => import('@/pages/report-review/ReportReview.vue'),
    //   meta: {
    //     title: '报告审核',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/report-sign',
    //   name: 'ReportSign',
    //   component: () => import('@/pages/report-sign/ReportSign.vue'),
    //   meta: {
    //     title: '报告签署',
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/report-download',
    //   name: 'ReportDownload',
    //   component: () => import('@/pages/report-download/ReportDownload.vue'),
    //   meta: {
    //     title: '报告下载',
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue'),
      meta: {
        title: '页面不存在',
        requiresAuth: false
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 消防维护管理系统`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router
