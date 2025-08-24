# 消防协查系统后端API开发指南

## 概述

本文档为消防协查系统的后端API开发提供初步指南。由于前端尚未完全开发完成，本指南提供了一套通用的API接口设计，使后端开发能够先行启动。随着前端需求的进一步明确，这些API可能会进行调整和扩展。

## 系统架构概述

消防协查系统主要包含三大业务模块：
1. **维保业务**：最复杂的模块，包括巡查、测试和保养
2. **检测业务**：包括竣工检测和年度检测
3. **评估业务**：使用加权平均方法计算综合评分

系统采用双端架构：
- **网页端**：供工程师使用，负责计划制定和管理
- **App端**：供操作员使用，负责现场作业和数据录入

## API设计原则

1. **RESTful设计**：遵循RESTful API设计原则
2. **统一响应格式**：所有API响应采用统一格式
3. **状态码规范**：使用标准HTTP状态码
4. **版本控制**：API路径包含版本号（如/api/v1/）
5. **安全性**：实现适当的认证和授权机制
6. **分页支持**：列表数据支持分页查询
7. **过滤和排序**：支持基本的过滤和排序功能

## 通用响应格式

```typescript
// 成功响应
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2023-08-24T10:30:00Z"
}

// 错误响应
{
  "code": 400,
  "message": "请求参数错误",
  "error": "详细错误信息",
  "timestamp": "2023-08-24T10:30:00Z"
}
```

## 认证与授权

### 登录接口

```
POST /api/v1/auth/login
```

**请求体**：
```json
{
  "username": "string",
  "password": "string",
  "captcha": "string" // 可选
}
```

**响应**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": 3600,
    "user": {
      "id": "string",
      "username": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "roles": ["string"],
      "permissions": ["string"],
      "department": "string",
      "position": "string",
      "status": "active"
    }
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

### 令牌刷新

```
POST /api/v1/auth/refresh
```

**请求体**：
```json
{
  "refreshToken": "string"
}
```

### 登出

```
POST /api/v1/auth/logout
```

**请求头**：
```
Authorization: Bearer {token}
```

## 公司管理API

### 获取公司列表

```
GET /api/v1/companies
```

**查询参数**：
- `keyword`: 搜索关键词（可选）
- `type`: 公司类型（customer/contractor/supplier，可选）
- `status`: 状态（active/inactive/pending，可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `sortBy`: 排序字段（可选）
- `sortOrder`: 排序方向（asc/desc，默认asc）

**响应**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "data": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "address": "string",
        "contactPerson": "string",
        "contactPhone": "string",
        "contactEmail": "string",
        "businessLicense": "string",
        "taxNumber": "string",
        "bankAccount": "string",
        "bankName": "string",
        "status": "active",
        "description": "string",
        "createdAt": "2023-08-24T10:30:00Z",
        "updatedAt": "2023-08-24T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

### 获取公司详情

```
GET /api/v1/companies/{id}
```

### 创建公司

```
POST /api/v1/companies
```

**请求体**：
```json
{
  "name": "string",
  "code": "string",
  "address": "string",
  "contactPerson": "string",
  "contactPhone": "string",
  "contactEmail": "string",
  "businessLicense": "string",
  "taxNumber": "string",
  "bankAccount": "string",
  "bankName": "string",
  "status": "active",
  "description": "string"
}
```

### 更新公司

```
PUT /api/v1/companies/{id}
```

### 删除公司

```
DELETE /api/v1/companies/{id}
```

### 获取公司统计信息

```
GET /api/v1/companies/statistics
```

**响应**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 100,
    "active": 80,
    "inactive": 15,
    "pending": 5,
    "byType": {
      "customer": 50,
      "contractor": 30,
      "supplier": 20
    }
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

## 人员管理API

### 获取人员列表

```
GET /api/v1/personnel
```

**查询参数**：
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `name`: 姓名（可选）
- `role`: 角色（engineer/operator，可选）
- `department`: 部门（可选）
- `status`: 状态（active/inactive/leave，可选）
- `companyId`: 公司ID（可选）

### 获取人员详情

```
GET /api/v1/personnel/{id}
```

### 创建人员

```
POST /api/v1/personnel
```

**请求体**：
```json
{
  "name": "string",
  "employeeId": "string",
  "role": "engineer",
  "phone": "string",
  "email": "string",
  "department": "string",
  "hireDate": "2023-08-24",
  "status": "active",
  "skills": ["string"],
  "remarks": "string",
  "companyId": "string"
}
```

### 更新人员

```
PUT /api/v1/personnel/{id}
```

### 删除人员

```
DELETE /api/v1/personnel/{id}
```

### 获取人员统计信息

```
GET /api/v1/personnel/statistics
```

**响应**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 100,
    "active": 90,
    "inactive": 5,
    "leave": 5,
    "byRole": {
      "engineer": 30,
      "operator": 70
    },
    "byDepartment": {
      "技术部": 50,
      "运营部": 30,
      "管理部": 20
    }
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

## 项目管理API

### 获取项目列表

```
GET /api/v1/projects
```

**查询参数**：
- `keyword`: 搜索关键词（可选）
- `companyId`: 公司ID（可选）
- `type`: 项目类型（maintenance/inspection/assessment，可选）
- `status`: 状态（planning/active/paused/completed/cancelled，可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `sortBy`: 排序字段（可选）
- `sortOrder`: 排序方向（asc/desc，默认asc）

### 获取项目详情

```
GET /api/v1/projects/{id}
```

### 创建项目

```
POST /api/v1/projects
```

**请求体**：
```json
{
  "name": "string",
  "code": "string",
  "companyId": "string",
  "type": "maintenance",
  "startDate": "2023-08-24",
  "endDate": "2023-12-31",
  "expectedEndDate": "2023-12-31",
  "budget": 100000,
  "description": "string",
  "projectManager": "string",
  "projectManagerContact": "string"
}
```

### 更新项目

```
PUT /api/v1/projects/{id}
```

### 删除项目

```
DELETE /api/v1/projects/{id}
```

### 获取项目统计信息

```
GET /api/v1/projects/statistics
```

**响应**：
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 50,
    "byStatus": {
      "planning": 5,
      "active": 30,
      "paused": 5,
      "completed": 8,
      "cancelled": 2
    },
    "byType": {
      "maintenance": 30,
      "inspection": 15,
      "assessment": 5
    },
    "totalBudget": 5000000,
    "totalActualCost": 3500000
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

## 建筑管理API

### 获取建筑列表

```
GET /api/v1/projects/{projectId}/buildings
```

### 获取建筑详情

```
GET /api/v1/buildings/{id}
```

### 创建建筑

```
POST /api/v1/projects/{projectId}/buildings
```

**请求体**：
```json
{
  "name": "string",
  "code": "string",
  "type": "residential",
  "floors": 10,
  "area": 5000,
  "address": "string",
  "contactPerson": "string",
  "contactPhone": "string"
}
```

### 更新建筑

```
PUT /api/v1/buildings/{id}
```

### 删除建筑

```
DELETE /api/v1/buildings/{id}
```

## 消防设施管理API

### 获取消防设施列表

```
GET /api/v1/buildings/{buildingId}/facilities
```

### 获取消防设施详情

```
GET /api/v1/facilities/{id}
```

### 创建消防设施

```
POST /api/v1/buildings/{buildingId}/facilities
```

**请求体**：
```json
{
  "name": "string",
  "type": "string",
  "location": "string",
  "installDate": "2023-08-24",
  "nextInspectionDate": "2023-12-31",
  "status": "normal",
  "description": "string"
}
```

### 更新消防设施

```
PUT /api/v1/facilities/{id}
```

### 删除消防设施

```
DELETE /api/v1/facilities/{id}
```

## 合同管理API

### 获取合同列表

```
GET /api/v1/projects/{projectId}/contracts
```

### 获取合同详情

```
GET /api/v1/contracts/{id}
```

### 创建合同

```
POST /api/v1/projects/{projectId}/contracts
```

**请求体**：
```json
{
  "code": "string",
  "type": "maintenance",
  "amount": 100000,
  "startDate": "2023-08-24",
  "endDate": "2024-08-23",
  "terms": "string",
  "attachments": ["string"]
}
```

### 更新合同

```
PUT /api/v1/contracts/{id}
```

### 删除合同

```
DELETE /api/v1/contracts/{id}
```

## 维保计划管理API

### 获取维保计划列表

```
GET /api/v1/projects/{projectId}/maintenance-plans
```

### 获取维保计划详情

```
GET /api/v1/maintenance-plans/{id}
```

### 创建维保计划

```
POST /api/v1/projects/{projectId}/maintenance-plans
```

**请求体**：
```json
{
  "code": "string",
  "name": "string",
  "type": "monthly",
  "startDate": "2023-08-24",
  "endDate": "2023-09-23"
}
```

### 更新维保计划

```
PUT /api/v1/maintenance-plans/{id}
```

### 删除维保计划

```
DELETE /api/v1/maintenance-plans/{id}
```

## 维保任务管理API

### 获取维保任务列表

```
GET /api/v1/maintenance-plans/{planId}/tasks
```

### 获取维保任务详情

```
GET /api/v1/tasks/{id}
```

### 创建维保任务

```
POST /api/v1/maintenance-plans/{planId}/tasks
```

**请求体**：
```json
{
  "name": "string",
  "type": "inspection",
  "facilityType": "string",
  "frequency": "monthly",
  "assignedTo": "string",
  "dueDate": "2023-09-23",
  "estimatedDuration": 60,
  "description": "string"
}
```

### 更新维保任务

```
PUT /api/v1/tasks/{id}
```

### 删除维保任务

```
DELETE /api/v1/tasks/{id}
```

### 提交任务结果

```
POST /api/v1/tasks/{id}/result
```

**请求体**：
```json
{
  "status": "pass",
  "score": 90,
  "findings": ["string"],
  "recommendations": ["string"],
  "attachments": ["string"],
  "notes": "string"
}
```

## 执行计划管理API

### 获取执行计划列表

```
GET /api/v1/projects/{projectId}/execution-plans
```

### 获取执行计划详情

```
GET /api/v1/execution-plans/{id}
```

### 创建执行计划

```
POST /api/v1/projects/{projectId}/execution-plans
```

**请求体**：
```json
{
  "name": "string",
  "month": "2023-08",
  "selectedFrequencies": ["monthly", "quarterly"],
  "strategy": "concentrated",
  "selectedPeriodPlans": ["string"]
}
```

### 更新执行计划

```
PUT /api/v1/execution-plans/{id}
```

### 删除执行计划

```
DELETE /api/v1/execution-plans/{id}
```

### 发布执行计划

```
POST /api/v1/execution-plans/{id}/publish
```

### 获取执行计划任务

```
GET /api/v1/execution-plans/{id}/tasks
```

## App端API

### 获取当前用户的执行计划列表

```
GET /api/v1/app/execution-plans
```

### 获取执行计划详情

```
GET /api/v1/app/execution-plans/{id}
```

### 获取执行计划任务

```
GET /api/v1/app/execution-plans/{id}/tasks
```

### 获取任务详情

```
GET /api/v1/app/tasks/{taskId}
```

### 更新任务状态

```
PUT /api/v1/app/tasks/{taskId}/status
```

**请求体**：
```json
{
  "status": "in_progress"
}
```

### 提交任务结果

```
POST /api/v1/app/tasks/{taskId}/result
```

**请求体**：
```json
{
  "status": "pass",
  "score": 90,
  "findings": ["string"],
  "recommendations": ["string"],
  "attachments": ["string"],
  "notes": "string",
  "location": {
    "latitude": 23.123456,
    "longitude": 113.123456,
    "address": "string"
  }
}
```

### 临时添加保养任务

```
POST /api/v1/app/maintenance-tasks
```

**请求体**：
```json
{
  "executionPlanId": "string",
  "name": "string",
  "facilityType": "string",
  "location": "string",
  "description": "string"
}
```

### 人员签到

```
POST /api/v1/app/check-in
```

**请求体**：
```json
{
  "executionPlanId": "string",
  "type": "check_in",
  "location": {
    "latitude": 23.123456,
    "longitude": 113.123456,
    "address": "string"
  }
}
```

### 人员签退

```
POST /api/v1/app/check-out
```

**请求体**：
```json
{
  "executionPlanId": "string",
  "type": "check_out",
  "location": {
    "latitude": 23.123456,
    "longitude": 113.123456,
    "address": "string"
  }
}
```

## 报告管理API

### 获取报告列表

```
GET /api/v1/reports
```

**查询参数**：
- `keyword`: 搜索关键词（可选）
- `projectId`: 项目ID（可选）
- `type`: 报告类型（inspection/maintenance/assessment，可选）
- `status`: 状态（draft/pending_review/approved/rejected/signed/published，可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `sortBy`: 排序字段（可选）
- `sortOrder`: 排序方向（asc/desc，默认asc）

### 获取报告详情

```
GET /api/v1/reports/{id}
```

### 创建报告

```
POST /api/v1/reports
```

**请求体**：
```json
{
  "projectId": "string",
  "type": "inspection",
  "title": "string",
  "reportDate": "2023-08-24",
  "period": {
    "startDate": "2023-08-01",
    "endDate": "2023-08-31"
  },
  "content": {
    "summary": "string",
    "findings": [
      {
        "category": "string",
        "severity": "medium",
        "description": "string",
        "location": "string",
        "facility": "string",
        "recommendation": "string",
        "status": "open",
        "assignedTo": "string",
        "dueDate": "2023-09-30",
        "images": ["string"]
      }
    ],
    "recommendations": ["string"],
    "statistics": {
      "totalFindings": 10,
      "findingsBySeverity": {
        "low": 5,
        "medium": 3,
        "high": 2,
        "critical": 0
      },
      "findingsByCategory": {
        "电气安全": 5,
        "消防设施": 3,
        "疏散通道": 2
      },
      "findingsByStatus": {
        "open": 8,
        "in_progress": 2,
        "resolved": 0,
        "deferred": 0
      },
      "complianceScore": 85,
      "overallScore": 80
    },
    "appendix": {
      "images": ["string"],
      "documents": ["string"],
      "references": ["string"]
    }
  }
}
```

### 更新报告

```
PUT /api/v1/reports/{id}
```

### 删除报告

```
DELETE /api/v1/reports/{id}
```

### 提交报告审核

```
POST /api/v1/reports/{id}/submit
```

### 审核报告

```
POST /api/v1/reports/{id}/review
```

**请求体**：
```json
{
  "status": "approved",
  "comments": "string"
}
```

### 签署报告

```
POST /api/v1/reports/{id}/sign
```

**请求体**：
```json
{
  "signature": "base64_encoded_signature"
}
```

### 生成报告

```
POST /api/v1/reports/generate
```

**请求体**：
```json
{
  "projectId": "string",
  "type": "inspection",
  "period": {
    "startDate": "2023-08-01",
    "endDate": "2023-08-31"
  },
  "template": "string",
  "options": {
    "includeImages": true,
    "includeStatistics": true,
    "includeRecommendations": true,
    "format": "pdf"
  }
}
```

### 获取报告生成状态

```
GET /api/v1/reports/generation/{generationId}
```

### 下载报告

```
GET /api/v1/reports/{id}/download
```

## 故障报修管理API

### 获取故障报修列表

```
GET /api/v1/fault-reports
```

**查询参数**：
- `keyword`: 搜索关键词（可选）
- `projectId`: 项目ID（可选）
- `status`: 状态（open/in_progress/resolved/closed，可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `sortBy`: 排序字段（可选）
- `sortOrder`: 排序方向（asc/desc，默认asc）

### 获取故障报修详情

```
GET /api/v1/fault-reports/{id}
```

### 创建故障报修

```
POST /api/v1/fault-reports
```

**请求体**：
```json
{
  "projectId": "string",
  "planName": "string",
  "projectManager": "string",
  "maintenancePersonnel": "string",
  "equipmentName": "string",
  "repairItemName": "string",
  "companyName": "string",
  "faultDescription": "string",
  "hideInReport": false
}
```

### 更新故障报修

```
PUT /api/v1/fault-reports/{id}
```

### 删除故障报修

```
DELETE /api/v1/fault-reports/{id}
```

### 处理故障报修

```
POST /api/v1/fault-reports/{id}/handle
```

**请求体**：
```json
{
  "status": "resolved",
  "handlingResult": "string",
  "attachments": ["string"]
}
```

## 模板管理API

### 获取巡检模板列表

```
GET /api/v1/inspection-templates
```

### 获取巡检模板详情

```
GET /api/v1/inspection-templates/{id}
```

### 创建巡检模板

```
POST /api/v1/inspection-templates
```

**请求体**：
```json
{
  "name": "string",
  "description": "string",
  "items": [
    {
      "name": "string",
      "type": "inspection",
      "facilityType": "string",
      "frequency": "monthly",
      "content": "string",
      "criteria": "string",
      "isRequired": true
    }
  ]
}
```

### 更新巡检模板

```
PUT /api/v1/inspection-templates/{id}
```

### 删除巡检模板

```
DELETE /api/v1/inspection-templates/{id}
```

## 统计分析API

### 获取维保统计信息

```
GET /api/v1/statistics/maintenance
```

**查询参数**：
- `projectId`: 项目ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

### 获取检测统计信息

```
GET /api/v1/statistics/inspection
```

**查询参数**：
- `projectId`: 项目ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

### 获取评估统计信息

```
GET /api/v1/statistics/assessment
```

**查询参数**：
- `projectId`: 项目ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）

### 获取任务完成率统计

```
GET /api/v1/statistics/task-completion
```

**查询参数**：
- `projectId`: 项目ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `groupBy`: 分组方式（day/week/month/year，默认month）

### 获取设备故障统计

```
GET /api/v1/statistics/equipment-faults
```

**查询参数**：
- `projectId`: 项目ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `groupBy`: 分组方式（equipment_type/location，默认equipment_type）

## 文件上传API

### 上传文件

```
POST /api/v1/files/upload
```

**请求体**：multipart/form-data

**响应**：
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": "string",
    "name": "string",
    "size": 1024,
    "type": "image/jpeg",
    "url": "https://example.com/files/xxx.jpg",
    "status": "success"
  },
  "timestamp": "2023-08-24T10:30:00Z"
}
```

### 下载文件

```
GET /api/v1/files/{id}/download
```

### 删除文件

```
DELETE /api/v1/files/{id}
```

## 系统配置API

### 获取系统配置

```
GET /api/v1/config
```

### 更新系统配置

```
PUT /api/v1/config
```

**请求体**：
```json
{
  "key": "value"
}
```

### 获取系统日志

```
GET /api/v1/system/logs
```

**查询参数**：
- `level`: 日志级别（error/warn/info/debug，可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）

## 开发建议

1. **数据库设计**：根据API接口设计相应的数据库表结构，确保数据完整性和一致性。
2. **认证授权**：实现基于JWT的认证机制，并根据用户角色控制API访问权限。
3. **数据验证**：对所有输入数据进行严格验证，防止无效或恶意数据。
4. **错误处理**：实现统一的错误处理机制，提供清晰的错误信息。
5. **日志记录**：记录关键操作和异常信息，便于问题排查和系统监控。
6. **性能优化**：对大数据量查询进行优化，考虑使用索引、分页等技术。
7. **API文档**：使用Swagger等工具生成API文档，方便前端开发人员查阅。
8. **测试**：编写单元测试和集成测试，确保API功能正确性和稳定性。

## 后续扩展

随着前端需求的进一步明确，以下API可能需要扩展或新增：

1. **工作流管理API**：支持更复杂的工作流程，如审批流程、任务流转等。
2. **通知管理API**：支持系统通知、邮件通知、短信通知等。
3. **数据导入导出API**：支持批量数据导入导出功能。
4. **报表生成API**：支持更复杂的报表生成和定制功能。
5. **第三方集成API**：支持与其他系统的集成，如企业微信、钉钉等。
6. **移动端特有API**：根据移动端具体需求，可能需要新增一些特有API。

## 注意事项

1. 本API指南为初步设计，具体实现时可能需要根据前端需求进行调整。
2. 所有日期时间字段建议使用ISO 8601格式（YYYY-MM-DDTHH:mm:ssZ）。
3. 文件上传建议支持多种格式，并对文件大小进行限制。
4. 敏感操作应记录操作日志，包括操作人、操作时间、操作内容等。
5. 考虑实现API版本控制，便于后续升级和兼容性处理。
6. 对于大数据量查询，建议实现异步处理机制，避免长时间阻塞。