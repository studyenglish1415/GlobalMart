<template>
  <div>
    <header>
      <router-link to="/" class="brand">🌐 GlobalMart</router-link>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/cart" class="cart-link">
          Cart
          <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
        </router-link>
        <template v-if="authStore.isAuthenticated">
          <router-link to="/profile">Profile</router-link>
          <button class="nav-btn" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/register" class="nav-register">Register</router-link>
        </template>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>© 2026 GlobalMart · Cross-border E-commerce</footer>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #f5f5f5; color: #1a1a1a; }

header {
  background: #0f172a;
  color: white;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.brand { color: white; text-decoration: none; font-size: 1.4rem; font-weight: 700; }

nav { display: flex; align-items: center; gap: 8px; }
nav a {
  color: #cbd5e1;
  padding: 8px 14px;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.95rem;
}
nav a:hover, nav a.router-link-active { color: white; background: rgba(255,255,255,0.1); }

.cart-link { position: relative; }
.cart-badge {
  position: absolute;
  top: -4px; right: -4px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 18px; height: 18px;
  font-size: 0.65rem;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
}

.nav-register {
  background: #ff6b6b !important;
  color: white !important;
}
.nav-btn {
  background: transparent;
  color: #cbd5e1;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.nav-btn:hover { color: white; background: rgba(255,255,255,0.1); }

main { min-height: 80vh; }
footer {
  background: #0f172a;
  color: #64748b;
  text-align: center;
  padding: 24px;
  margin-top: 60px;
  font-size: 0.9rem;
}
</style>
