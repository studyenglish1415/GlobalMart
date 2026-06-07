<template>
  <div class="register">
    <div class="register-container">
      <h1>Create Account</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="first_name">First Name:</label>
          <input v-model="first_name" type="text" id="first_name" required />
        </div>

        <div class="form-group">
          <label for="last_name">Last Name:</label>
          <input v-model="last_name" type="text" id="last_name" required />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" required />
        </div>

        <button type="submit" class="btn-primary">Register</button>
      </form>

      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
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
const router = useRouter()

const handleRegister = async () => {
  // API call will be implemented
  console.log('Register:', { first_name: first_name.value, last_name: last_name.value, email: email.value, password: password.value })
  // Redirect to login after registration
  router.push('/login')
}
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.register-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-container h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.register-container button {
  width: 100%;
  margin-top: 1rem;
}

.register-container p {
  text-align: center;
  margin-top: 1rem;
}
</style>
