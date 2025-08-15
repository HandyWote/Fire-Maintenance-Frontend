<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElFormItem, ElInput, ElButton, ElCard, ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { usePermissionsStore } from '@/stores/permissions'

const router = useRouter()
const permissionsStore = usePermissionsStore()
const loginForm = ref({
  username: '',
  password: ''
})
const loading = ref(false)

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const loginFormRef = ref()

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 模拟登录成功
      localStorage.setItem('token', 'mock-token')
      
      // 根据用户名确定角色和权限
      let userRole = 'user'
      let userPermissions = [
        'personnel:view',
        'companies:view'
      ]
      
      // 管理员账号拥有所有权限
      if (loginForm.value.username === 'admin') {
        userRole = 'admin'
        userPermissions = ['*'] // 所有权限
      }
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify({
        username: loginForm.value.username,
        role: userRole
      }))
      
      // 设置权限状态
      permissionsStore.login(userPermissions)
      
      ElMessage.success('登录成功')
      router.push('/')
      loading.value = false
    }, 1000)
  } catch (error) {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <ElCard class="login-card">
      <template #header>
        <div class="login-header">
          <h2>消防维护管理系统</h2>
          <p>用户登录</p>
        </div>
      </template>
      
      <ElForm
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        size="large"
      >
        <ElFormItem prop="username">
          <ElInput
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </ElFormItem>
        
        <ElFormItem prop="password">
          <ElInput
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </ElFormItem>
        
        <ElFormItem>
          <ElButton
            type="primary"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%"
          >
            {{ loading ? '登录中...' : '登录' }}
          </ElButton>
        </ElFormItem>
      </ElForm>
      
      <div class="login-footer">
        <p>管理员账号：admin / 123456</p>
        <p>普通用户：user / 123456</p>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-header h2 {
  color: #409eff;
  margin-bottom: 5px;
  font-size: 24px;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.login-footer p {
  margin: 5px 0;
  font-size: 12px;
  color: #999;
}
</style>
