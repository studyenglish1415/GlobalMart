<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">🌐</div>
      <h1>Create Account</h1>
      <p class="subtitle">Join GlobalMart — shop the world</p>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <form @submit.prevent="handleRegister">
        <div class="form-row"><div class="form-group"><label>First Name</label><input v-model="first_name" type="text" placeholder="First" required /></div><div class="form-group"><label>Last Name</label><input v-model="last_name" type="text" placeholder="Last" required /></div></div>
        <div class="form-group"><label>Email</label><input v-model="email" type="email" placeholder="you@example.com" required /></div>
        <div class="form-group"><label>Password</label><input v-model="password" type="password" placeholder="At least 8 characters" required minlength="8" /></div>
        <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? 'Creating Account...' : 'Register' }}</button>
      </form>
      <p class="switch-link">Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  await new Promise(resolve => setTimeout(resolve, 600))
  if (email.value && password.value) {
    router.push('/login')
  } else {
    error.value = 'Please fill in all required fields.'
  }
  loading.value = false
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
.auth-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 460px; text-align: center; }
.auth-logo { font-size: 48px; margin-bottom: 12px; }
h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; }
.subtitle { color: #64748b; margin-bottom: 28px; }
.form-row { display: flex; gap: 14px; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: 16px; text-align: left; }
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
