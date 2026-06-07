import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setUser(userData: User) {
    user.value = userData
  }

  function setToken(authToken: string) {
    token.value = authToken
    localStorage.setItem('token', authToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  }
})
