# 消防维护管理系统

> 专业的消防设备维护管理平台，提供全方位的消防设备维护解决方案

## 📖 项目概述

### 项目简介
消防维护管理系统是一个专业的Web前端应用，旨在为消防设备维护提供全面的管理解决方案。系统采用现代化的前端技术栈，支持维保管理、检测管理和评估管理三大核心业务模块。

### 技术栈
- **前端框架**: Vue 3 + Composition API
- **类型系统**: TypeScript
- **UI组件库**: Element Plus
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **样式方案**: SCSS + CSS Variables
- **图表库**: ECharts
- **日期处理**: Day.js

### 项目目标
- 提供专业的消防设备维护管理平台
- 实现维保、检测、评估三大业务流程的数字化管理
- 支持Web端和App端的协同工作
- 提高消防设备维护的效率和质量

## 🏗️ 系统架构

### 整体架构
```
消防维护管理系统
├── Web端（本项目）
│   ├── 管理员功能
│   ├── 工程师功能
│   └── 数据分析功能
└── App端（独立项目）
    ├── 操作员功能
    ├── 现场数据采集
    └── 实时数据同步
```

### 前端架构
```
前端架构
├── 表示层 (Vue 3 + TypeScript)
├── 状态管理层 (Pinia)
├── 路由层 (Vue Router)
├── 服务层 (Axios + API)
├── 工具层 (Utils + Composables)
└── 样式层 (SCSS + Element Plus)
```

### 部署架构
- **部署环境**: 云服务
- **构建工具**: Vite
- **部署方式**: Nginx + 静态文件
- **代码管理**: GitHub

## 🎯 核心业务流程

### 主要业务流程
```
基础信息录入 → 项目建立 → 维保计划 → APP执业 → 报告生成 → 签署下载
```

### 详细流程说明
1. **基础信息录入**: 录入企业、人员、建筑物等基础信息
2. **项目建立**: 创建维保项目，关联相关基础信息
3. **维保计划**: 制定维保计划，设置周期和任务分配
4. **APP执业**: 操作员通过App端执行维保任务
5. **报告生成**: 系统自动生成维保报告
6. **签署下载**: 审核签署报告并下载存档

## 📋 功能模块

### 1. 维保管理系统
#### 计划制定功能
- **核心对象**: 合同、客户、计划
- **客户管理**: 企业信息、人员管理、维保内容设置
- **合同管理**: 合同信息、状态管理、续签功能
- **计划管理**: 维保计划制定、期计划管理、执行计划生成

#### 维保结果访问功能
- **巡查记录**: 巡查结果查看和管理
- **测试记录**: 测试结果查看和管理
- **数据筛选**: 按客户、项目、时间等维度筛选

#### 其他信息访问功能
- **故障报修**: 报修信息管理和处理
- **人员签到**: 签到信息查看和补签功能
- **报告管理**: 报告生成和管理

### 2. 检测管理系统
#### 竣工检测
- **检测标准**: 支持不同检测标准
- **施工方管理**: 施工方信息记录
- **检测结果**: 检测结果录入和管理

#### 年度检测
- **年度计划**: 年度检测计划制定
- **维保方管理**: 维保方信息记录
- **检测报告**: 年度检测报告生成

#### 局部检测
- **部位管理**: 检测部位信息管理
- **局部标准**: 局部检测标准设置
- **结果管理**: 局部检测结果管理

### 3. 评估管理系统
#### 评估模型
- **加权平均**: 综合评分计算
- **分项评估**: 建筑防火、设施器材、安全管理
- **动态权重**: 根据设备条件调整权重

#### 评估流程
- **数据采集**: 自动采集评估数据
- **评分计算**: 智能计算综合得分
- **报告生成**: 自动生成评估报告

## 🛠️ 技术实现

### 项目结构
```
fire-maintenace/
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/               # 全局资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   ├── components/           # 公共组件
│   │   ├── common/          # 通用组件
│   │   ├── forms/           # 表单组件
│   │   ├── layout/          # 布局组件
│   │   └── navigation/      # 导航组件
│   ├── composables/         # 组合式函数
│   ├── pages/               # 页面组件
│   ├── router/              # 路由配置
│   ├── stores/              # 状态管理
│   ├── types/               # TypeScript类型
│   ├── utils/               # 工具函数
│   ├── api/                 # API接口
│   ├── styles/              # 全局样式
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 📁 项目文件夹结构说明

### 根目录结构
- **`fire-maintenace/`** - 主要项目源码目录，包含所有前端开发代码
- **`docs/`** - 项目文档目录，存放需求文档、设计文档等
- **`README.md`** - 项目说明文档，包含项目概述、技术栈、开发进度等
- **`TODO.md`** - 开发任务清单，详细记录各阶段开发任务和完成状态

### `fire-maintenace/src/` 目录详解

#### `api/` - API接口层
**用途**: 定义所有后端API接口和HTTP请求服务
**包含内容**:
- `base.ts` - 基础HTTP服务配置
- `company.ts` - 企业相关API接口
- `personnel.ts` - 人员相关API接口
**开发规范**: 
- 统一使用Axios进行HTTP请求
- API接口命名遵循RESTful规范
- 统一错误处理和响应格式

#### `assets/` - 静态资源
**用途**: 存放项目中的静态资源文件
**包含内容**:
- `images/` - 图片资源文件
- `icons/` - 图标资源文件
**开发规范**: 
- 图片文件命名使用kebab-case格式
- 图片资源需要进行压缩优化
- 支持多种图片格式（PNG、JPG、SVG等）

#### `components/` - 组件库
**用途**: 可复用的Vue组件库，按功能分类组织
**包含内容**:
- `common/` - 通用组件
  - `DataTable.vue` - 数据表格组件
  - `Card.vue` - 卡片组件
  - `Loading.vue` - 加载状态组件
  - `Error.vue` - 错误提示组件
  - `Empty.vue` - 空状态组件
  - `TableActions.vue` - 表格操作组件
  - `TablePagination.vue` - 分页组件
- `forms/` - 表单相关组件
  - `CompanyForm.vue` - 企业信息表单
  - `DynamicFormBuilder.vue` - 动态表单构建器
  - `FieldGroup.vue` - 字段组组件
  - `FormWrapper.vue` - 表单包装器
- `layout/` - 布局组件
  - `HomeLayout.vue` - 首页布局组件
- `navigation/` - 导航组件
  - `NavigationTree.vue` - 导航树组件
**开发规范**: 
- 组件命名使用PascalCase格式
- 组件文件名与组件名保持一致
- 每个组件都应该有明确的职责和用途

#### `composables/` - 组合式函数
**用途**: Vue 3组合式API的逻辑复用函数
**包含内容**:
- `useFormValidation.ts` - 表单验证逻辑
- `useWorkflow.ts` - 工作流管理逻辑
**开发规范**: 
- 函数命名以`use`开头
- 每个组合式函数应该专注于单一功能
- 返回响应式数据和方法

#### `config/` - 配置文件
**用途**: 存放项目的各种配置文件
**包含内容**:
- `formConfig.ts` - 表单配置
- `navigation.ts` - 导航配置
- `navigationConfig.ts` - 导航详细配置
- `routes.ts` - 路由配置
**开发规范**: 
- 配置文件应该有清晰的类型定义
- 配置项应该有详细的注释说明

#### `pages/` - 页面组件
**用途**: 存放所有页面级组件，按业务模块分类
**包含内容**:
- `Home.vue` - 首页
- `Login.vue` - 登录页
- `NotFound.vue` - 404页面
- `companies/` - 企业管理模块
  - `CompanyList.vue` - 企业列表页面
- `personnel/` - 人员管理模块
  - `PersonnelList.vue` - 人员列表页面
- `contracts/` - 合同管理模块
  - `ContractList.vue` - 合同列表页面
  - `MaintenanceContractList.vue` - 维保合同管理
  - `InspectionContractList.vue` - 检测合同管理
  - `EvaluationContractList.vue` - 评估合同管理
- `plan-management/` - 计划管理模块
  - `PlanManagementList.vue` - 计划管理列表
  - `MaintenancePlanList.vue` - 维保计划管理
  - `InspectionPlanList.vue` - 检测计划管理
  - `EvaluationPlanList.vue` - 评估计划管理
- `execution-monitor/` - 执行监控模块
  - `ExecutionMonitorList.vue` - 执行监控列表
  - `ExecutionStatsList.vue` - 执行统计
  - `TaskStatusList.vue` - 任务状态管理
**开发规范**: 
- 页面组件应该以业务模块为单位组织
- 页面文件名应该清晰表达页面功能
- 每个页面模块都应该有独立的文件夹

#### `router/` - 路由配置
**用途**: Vue Router路由配置
**包含内容**:
- `index.ts` - 路由主配置文件
**开发规范**: 
- 路由配置应该支持懒加载
- 路由守卫应该统一配置
- 路由命名应该遵循统一的规范

#### `stores/` - 状态管理
**用途**: Pinia状态管理配置
**包含内容**:
- `companies.ts` - 企业状态管理
- `personnel.ts` - 人员状态管理
- `navigation.ts` - 导航状态管理
- `permissions.ts` - 权限状态管理
- `workflow.ts` - 工作流状态管理
**开发规范**: 
- 每个业务模块应该有独立的store文件
- 状态更新应该通过actions进行
- 复杂的状态逻辑应该使用getters

#### `styles/` - 样式文件
**用途**: 全局样式文件和主题配置
**包含内容**:
- `global.scss` - 全局样式
- `variables.scss` - SCSS变量定义
- `mixins.scss` - SCSS混合器定义
- `home-layout.scss` - 首页布局样式
- `navigation.scss` - 导航样式
**开发规范**: 
- 使用SCSS预处理器
- 样式变量统一管理
- 样式类名使用BEM命名规范

#### `types/` - 类型定义
**用途**: TypeScript类型定义文件
**包含内容**:
- `company.ts` - 企业相关类型
- `personnel.ts` - 人员相关类型
- `project.ts` - 项目相关类型
- `report.ts` - 报告相关类型
- `workflow.ts` - 工作流相关类型
- `navigation.ts` - 导航相关类型
- `table.ts` - 表格相关类型
- `vue.d.ts` - Vue类型扩展
- `vite-env.d.ts` - 环境变量类型
**开发规范**: 
- 类型定义应该尽可能详细和准确
- 接口命名应该使用PascalCase
- 类型文件应该按功能模块分类

#### `utils/` - 工具函数
**用途**: 通用工具函数库
**包含内容**:
- `array.ts` - 数组处理工具
- `common.ts` - 通用工具函数
- `date.ts` - 日期处理工具
- `dom.ts` - DOM操作工具
- `format.ts` - 格式化工具
- `object.ts` - 对象处理工具
- `performance.ts` - 性能优化工具
- `random.ts` - 随机数生成工具
- `request.ts` - HTTP请求工具
- `validation.ts` - 验证工具
**开发规范**: 
- 工具函数应该是纯函数
- 函数命名应该清晰表达功能
- 每个工具函数都应该有完整的JSDoc注释

### 开发环境配置文件
- **`.env`** - 环境变量配置
- **`.env.development`** - 开发环境配置
- **`.env.production`** - 生产环境配置
- **`.eslintrc.js`** - ESLint代码检查配置
- **`.prettierrc`** - Prettier代码格式化配置
- **`tsconfig.json`** - TypeScript配置
- **`vite.config.ts`** - Vite构建工具配置
- **`package.json`** - 项目依赖和脚本配置

### 核心技术点

#### 1. Vue 3 + Composition API
- 使用组合式API进行组件开发
- 利用响应式系统进行状态管理
- 支持TypeScript类型检查

#### 2. TypeScript类型系统
- 完整的类型定义文件
- 严格的类型检查
- 智能代码提示

#### 3. Element Plus组件库
- 丰富的UI组件
- 完整的主题定制
- 良好的无障碍支持

#### 4. Vite构建工具
- 快速的开发服务器
- 优化的构建流程
- 丰富的插件生态

#### 5. Pinia状态管理
- 简洁的状态管理API
- 完整的TypeScript支持
- 模块化的状态设计

### 开发环境配置

#### 环境要求
- Node.js >= 20.19.0 || >= 22.12.0
- npm >= 8.0.0

#### 安装步骤
```bash
# 克隆项目
git clone https://github.com/HandyWote/Fire-Maintenance-Frontend.git
cd fire-maintenace

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

#### 环境变量配置
```bash
# .env.development
VITE_APP_TITLE=消防维护管理系统
VITE_APP_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development

# .env.production
VITE_APP_TITLE=消防维护管理系统
VITE_APP_API_BASE_URL=https://api.example.com/api
VITE_APP_ENV=production
```

## 📊 开发进度

### 当前完成状态
- **项目阶段**: 中期开发
- **完成度**: 约60%
- **核心架构**: 已完成
- **基础功能**: 大部分完成

### 各阶段完成度

#### 第一阶段：项目搭建 (100% 完成)
- [x] 环境配置与依赖安装
- [x] 项目结构搭建
- [x] 路由配置
- [x] 基础组件开发
- [x] TypeScript类型定义完善

#### 第二阶段：基础信息管理 (60% 完成)
- [x] 公司信息管理页面 (CompanyList.vue) - 功能完整
- [x] 人员信息管理页面 (PersonnelList.vue) - 基础功能完成
- [ ] 建筑物信息管理页面
- [x] 工作流状态管理 (基础状态管理完成)

#### 第三阶段：项目管理 (40% 完成)
- [ ] 项目管理页面
- [x] 合同管理页面 (ContractList.vue 及子页面已创建)
- [ ] 项目详情页面
- [x] 数据关联服务 (基础关联逻辑完成)

#### 第四阶段：维保计划 (40% 完成)
- [x] 维保计划列表页面 (PlanManagementList.vue 已创建)
- [ ] 维保计划创建页面
- [ ] 计划详情页面
- [ ] 多频次任务管理

#### 第五阶段：执业监控 (40% 完成)
- [x] 执业监控页面 (ExecutionMonitorList.vue 已创建)
- [x] 任务进度跟踪页面 (TaskStatusList.vue 已创建)
- [x] 执行统计页面 (ExecutionStatsList.vue 已创建)
- [ ] 实时数据服务

#### 第六阶段：报告管理 (0% 完成)
- [ ] 报告生成页面
- [ ] 报告审核页面
- [ ] 报告签署页面
- [ ] 报告下载页面

#### 第七阶段：系统优化 (0% 完成)
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 测试与Bug修复

### 已完成功能清单

#### 核心架构
- [x] Vue 3 + TypeScript 项目搭建
- [x] Vite 构建配置
- [x] Element Plus 组件库集成
- [x] Vue Router 路由配置
- [x] Pinia 状态管理配置
- [x] Axios HTTP 客户端配置
- [x] SCSS 样式系统配置

#### 基础页面
- [x] 首页 (Home.vue)
- [x] 登录页 (Login.vue)
- [x] 404页面 (NotFound.vue)

#### 业务页面
- [x] 企业管理页面 (CompanyList.vue) - 功能完整，包含增删改查
- [x] 员工管理页面 (PersonnelList.vue) - 基础列表展示功能
- [x] 合同管理页面 (ContractList.vue) - 基础页面结构
- [x] 维保合同管理页面 (MaintenanceContractList.vue)
- [x] 检测合同管理页面 (InspectionContractList.vue)
- [x] 评估合同管理页面 (EvaluationContractList.vue)
- [x] 计划管理页面 (PlanManagementList.vue)
- [x] 维保计划管理页面 (MaintenancePlanList.vue)
- [x] 检测计划管理页面 (InspectionPlanList.vue)
- [x] 评估计划管理页面 (EvaluationPlanList.vue)
- [x] 执业监控页面 (ExecutionMonitorList.vue)
- [x] 任务状态页面 (TaskStatusList.vue)
- [x] 执行统计页面 (ExecutionStatsList.vue)

#### 通用组件
- [x] 数据表格组件 (DataTable.vue)
- [x] 卡片组件 (Card.vue)
- [x] 公司表单组件 (CompanyForm.vue)
- [x] 动态表单构建器 (DynamicFormBuilder.vue)
- [x] 表单包装器 (FormWrapper.vue)
- [x] 字段组组件 (FieldGroup.vue)
- [x] 布局组件 (HomeLayout.vue)
- [x] 导航树组件 (NavigationTree.vue)
- [x] 表格操作组件 (TableActions.vue)
- [x] 表格分页组件 (TablePagination.vue)
- [x] 加载组件 (Loading.vue)
- [x] 错误组件 (Error.vue)
- [x] 空状态组件 (Empty.vue)

#### 工具函数
- [x] HTTP 请求工具 (request.ts)
- [x] 日期处理工具 (date.ts)
- [x] 通用工具函数 (common.ts)
- [x] 表单验证组合函数 (useFormValidation.ts)
- [x] 工作流组合函数 (useWorkflow.ts)
- [x] 性能优化工具 (performance.ts) - 包含批量处理、虚拟滚动、懒加载等功能

#### TypeScript 类型优化
- [x] 修复 performance.ts 中的 TypeScript 类型错误
- [x] 将 unref() 替换为 toValue() 以获得更好的类型推断
- [x] 优化 useBatchProcess 函数的类型安全性
- [x] 移除不必要的类型断言，提高代码质量

#### 类型定义
- [x] 工作流类型定义 (workflow.ts)
- [x] 公司类型定义 (company.ts)
- [x] 项目类型定义 (project.ts)
- [x] 报告类型定义 (report.ts)
- [x] Vue 类型声明 (vue.d.ts)

#### 样式系统
- [x] SCSS 变量定义 (variables.scss)
- [x] SCSS 混合器定义 (mixins.scss)
- [x] 全局样式 (global.scss)

## 🔄 TODO清单

### 完整任务清单

#### 第一阶段：项目搭建
- [x] 环境配置与依赖安装
  - [x] 安装 Node.js 和 npm
  - [x] 初始化 Vue 3 + TypeScript 项目
  - [x] 安装 Element Plus 及相关依赖
  - [x] 配置 Vite 构建工具
  - [x] 设置 ESLint 和 Prettier

- [x] 项目结构搭建
  - [x] 创建基础目录结构
  - [x] 配置路由系统
  - [x] 设置状态管理 (Pinia)
  - [x] 配置 HTTP 客户端 (Axios)
  - [x] 设置全局样式和主题

- [x] 基础组件开发
  - [x] 布局组件 (Header, Sidebar, Footer)
  - [ ] 导航组件 (WorkflowNavigation)
  - [ ] 通用组件 (Loading, Error, Empty)
  - [ ] 表单组件 (FormWrapper, FieldGroup)
  - [ ] 数据展示组件 (DataTable, Card)

- [x] 路由配置
  - [x] 配置多页面路由
  - [x] 设置路由守卫
  - [x] 配置页面标题
  - [x] 实现路由懒加载

#### 第二阶段：基础信息管理模块
- [ ] 公司信息管理页面 (`companies.html`)
  - [ ] 公司列表展示
  - [ ] 公司信息表单
  - [ ] 增删改查功能
  - [ ] 数据验证和错误处理
  - [ ] 与下一步的关联验证

- [ ] 人员信息管理页面 (`personnel.html`)
  - [ ] 人员列表展示
  - [ ] 人员信息表单
  - [ ] 角色管理 (工程师/操作员)
  - [ ] 人员与公司关联
  - [ ] 权限控制

- [ ] 建筑物信息管理页面 (`buildings.html`)
  - [ ] 建筑物列表展示
  - [ ] 建筑物信息表单
  - [ ] 建筑类型分类
  - [ ] 消防设施信息
  - [ ] 与公司关联

- [ ] 工作流状态管理
  - [ ] 步骤状态跟踪
  - [ ] 数据预填充服务
  - [ ] 步骤完成验证
  - [ ] 智能导航系统

#### 第三阶段：项目管理模块
- [ ] 项目管理页面 (`projects.html`)
  - [ ] 项目列表展示
  - [ ] 项目创建表单
  - [ ] 项目与公司关联
  - [ ] 项目与建筑物关联
  - [ ] 项目状态管理

- [ ] 合同管理页面 (`contracts.html`)
  - [ ] 合同列表展示
  - [ ] 合同信息表单
  - [ ] 合同与项目关联
  - [ ] 合同状态管理
  - [ ] 合同有效期跟踪

- [ ] 项目详情页面 (`project-detail.html`)
  - [ ] 项目基本信息展示
  - [ ] 关联建筑物列表
  - [ ] 合同信息展示
  - [ ] 相关人员列表
  - [ ] 项目进度统计

- [ ] 数据关联服务
  - [ ] 公司-项目关联
  - [ ] 建筑物-项目关联
  - [ ] 人员-项目关联
  - [ ] 合同-项目关联

#### 第四阶段：维保计划模块
- [ ] 维保计划列表页面 (`maintenance-plans.html`)
  - [ ] 计划列表展示
  - [ ] 计划状态管理
  - [ ] 计划筛选和搜索
  - [ ] 计划操作按钮
  - [ ] 计划统计信息

- [ ] 维保计划创建页面 (`plan-create.html`)
  - [ ] 计划创建向导
  - [ ] 项目选择功能
  - [ ] 维保内容配置
  - [ ] 多频次设置 (月度/季度/半年/年度)
  - [ ] 任务分配功能
  - [ ] 计划发布功能

- [ ] 计划详情页面 (`plan-detail.html`)
  - [ ] 计划基本信息
  - [ ] 任务列表展示
  - [ ] 人员分配情况
  - [ ] 执行进度跟踪
  - [ ] 计划修改功能

- [ ] 多频次任务管理
  - [ ] 任务生成算法
  - [ ] 集中执行模式
  - [ ] 均衡分配模式
  - [ ] 混合模式支持
  - [ ] 覆盖率校验

#### 第五阶段：执业监控模块
- [ ] 执业监控页面 (`operation-monitor.html`)
  - [ ] 实时统计面板
  - [ ] 人员位置地图
  - [ ] 任务进度表格
  - [ ] 实时数据流
  - [ ] 异常情况预警

- [ ] 任务进度跟踪页面 (`task-progress.html`)
  - [ ] 任务详情展示
  - [ ] 进度可视化
  - [ ] 人员状态跟踪
  - [ ] 任务筛选功能
  - [ ] 进度导出功能

- [ ] 现场数据查看页面 (`field-data.html`)
  - [ ] 现场数据列表
  - [ ] 数据详情展示
  - [ ] 照片查看功能
  - [ ] 数据验证功能
  - [ ] 异常数据处理

- [ ] 实时数据服务
  - [ ] WebSocket 连接
  - [ ] 实时数据更新
  - [ ] 位置跟踪服务
  - [ ] 状态同步机制

#### 第六阶段：报告管理模块
- [ ] 报告生成页面 (`report-generation.html`)
  - [ ] 报告配置表单
  - [ ] 报告类型选择
  - [ ] 项目和周期选择
  - [ ] 报告内容配置
  - [ ] 报告预览功能
  - [ ] 报告生成服务

- [ ] 报告审核页面 (`report-review.html`)
  - [ ] 报告信息展示
  - [ ] 审核意见输入
  - [ ] 审核流程管理
  - [ ] 审核历史记录
  - [ ] 审核状态跟踪

- [ ] 报告签署页面 (`report-sign.html`)
  - [ ] 签署人信息展示
  - [ ] 电子签名功能
  - [ ] 签署确认流程
  - [ ] 签署记录管理
  - [ ] 签署状态跟踪

- [ ] 报告下载页面 (`report-download.html`)
  - [ ] 报告列表展示
  - [ ] 报告筛选功能
  - [ ] 报告下载功能
  - [ ] 报告打印功能
  - [ ] 报告版本管理

#### 第七阶段：系统优化
- [ ] 性能优化
  - [ ] 代码分割优化
  - [ ] 图片资源优化
  - [ ] 缓存策略优化
  - [ ] API 请求优化
  - [ ] 渲染性能优化

- [ ] 用户体验优化
  - [ ] 加载状态优化
  - [ ] 错误处理优化
  - [ ] 操作反馈优化
  - [ ] 响应式设计优化
  - [ ] 无障碍访问优化

- [ ] 测试与 Bug 修复
  - [ ] 单元测试编写
  - [ ] 集成测试编写
  - [ ] 端到端测试
  - [ ] Bug 修复
  - [ ] 性能测试

## 📋 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 统一的命名规范
- 完善的代码注释

### 提交规范
```bash
# 提交格式
<type>(<scope>): <subject>

# 类型说明
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建或辅助工具变动

# 示例
feat(auth): 添加用户登录功能
fix(router): 修复路由守卫问题
docs(readme): 更新README文档
```

### 分支管理
```bash
main          # 主分支，用于生产环境
develop       # 开发分支，用于集成开发
feature/*     # 功能分支，用于开发新功能
hotfix/*      # 紧急修复分支，用于修复生产环境bug
release/*     # 发布分支，用于版本发布
```

### 开发流程
1. 从 `develop` 分支创建功能分支
2. 在功能分支上进行开发
3. 提交代码并推送到远程仓库
4. 创建 Pull Request 进行代码审查
5. 合并到 `develop` 分支
6. 定期将 `develop` 分支合并到 `main` 分支

## 📄 许可证

本项目采用 MIT 许可证，详情请参阅 [LICENSE](LICENSE) 文件。

---

**最后更新**: 2025-08-15  
**创建者**: HandyWote
**状态**: 60%
