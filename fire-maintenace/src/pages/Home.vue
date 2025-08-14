<script setup>
import { ElRow, ElCol, ElCard, ElButton, ElIcon } from 'element-plus'
import { House, Setting, Document, DataLine } from '@element-plus/icons-vue'
</script>

<template>
  <div class="home-container">
    <ElRow :gutter="20">
      <ElCol :span="24">
        <ElCard class="welcome-card">
          <h1>欢迎使用消防维护管理系统</h1>
          <p>这是一个专业的消防设备维护管理平台，提供全方位的消防设备维护解决方案。</p>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" class="feature-row">
      <ElCol :span="6">
        <ElCard class="feature-card">
          <ElIcon class="feature-icon"><House /></ElIcon>
          <h3>企业管理</h3>
          <p>管理企业信息，维护企业档案</p>
          <ElButton type="primary">进入管理</ElButton>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard class="feature-card">
          <ElIcon class="feature-icon"><Setting /></ElIcon>
          <h3>设备维护</h3>
          <p>制定维护计划，跟踪维护进度</p>
          <ElButton type="primary">进入管理</ElButton>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard class="feature-card">
          <ElIcon class="feature-icon"><Document /></ElIcon>
          <h3>报告管理</h3>
          <p>生成维护报告，审核签署文档</p>
          <ElButton type="primary">进入管理</ElButton>
        </ElCard>
      </ElCol>
      <ElCol :span="6">
        <ElCard class="feature-card">
          <ElIcon class="feature-icon"><DataLine /></ElIcon>
          <h3>数据监控</h3>
          <p>实时监控设备状态，分析运行数据</p>
          <ElButton type="primary">进入管理</ElButton>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" class="stats-row">
      <ElCol :span="24">
        <ElCard class="stats-card">
          <h2>系统统计</h2>
          <ElRow :gutter="20">
            <ElCol :span="6">
              <div class="stat-item">
                <h4>企业数量</h4>
                <p class="stat-number">0</p>
              </div>
            </ElCol>
            <ElCol :span="6">
              <div class="stat-item">
                <h4>维护项目</h4>
                <p class="stat-number">0</p>
              </div>
            </ElCol>
            <ElCol :span="6">
              <div class="stat-item">
                <h4>进行中任务</h4>
                <p class="stat-number">0</p>
              </div>
            </ElCol>
            <ElCol :span="6">
              <div class="stat-item">
                <h4>已完成报告</h4>
                <p class="stat-number">0</p>
              </div>
            </ElCol>
          </ElRow>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
  text-align: center;
}

.welcome-card h1 {
  color: #409eff;
  margin-bottom: 10px;
}

.welcome-card p {
  color: #666;
  font-size: 16px;
}

.feature-row {
  margin-bottom: 20px;
}

.feature-card {
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.feature-card p {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-card h2 {
  text-align: center;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-item h4 {
  margin-bottom: 10px;
  font-weight: normal;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}
</style>
