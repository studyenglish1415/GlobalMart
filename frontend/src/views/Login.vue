<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">🌐</div>
      <h1>Welcome Back</h1>
      <p class="subtitle">Login to your GlobalMart account</p>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group"><label>Email</label><input v-model="email" type="email" placeholder="you@example.com" required /></div>
        <div class="form-group"><label>Password</label><input v-model="password" type="password" placeholder="••••••••" required /></div>
        <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
      </form>
      <p class="switch-link">Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  await new Promise(resolve => setTimeout(resolve, 600))
  if (email.value && password.value) {
    authStore.setToken('fake-jwt-token')
    authStore.setUser({ email: email.value, name: email.value.split('@')[0] })
    router.push('/')
  } else {
    error.value = 'Please enter your email and password.'
  }
  loading.value = false
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
.auth-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 420px; text-align: center; }
.auth-logo { font-size: 48px; margin-bottom: 12px; }
h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; }
.subtitle { color: #64748b; margin-bottom: 28px; }
.form-group { margin-bottom: 18px; text-align: left; }
.form-group label { display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 0.9rem; }
.form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; outline: none; transition: border-color 0.2s; }
.form-group input:focus { border-color: #ff6b6b; }
.btn-primary { width: 100%; padding: 13px; background: #ff6b6b; color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #e95c5c; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 18px; font-size: 0.9rem; }
.switch-link { margin-top: 20px; color: #64748b; font-size: 0.9rem; }
.switch-link a { color: #ff6b6b; font-weight: 600; text-decoration: none; }
</style>
