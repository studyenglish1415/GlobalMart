<template>
  <div class="profile-container">
    <h2>My Account</h2>

    <div class="section">
      <h3>Personal Information</h3>
      <div class="profile-row">
        <div class="avatar">{{ initials }}</div>
        <div class="info-grid">
          <div class="form-group"><label>First Name</label><input v-model="user.firstName" /></div>
          <div class="form-group"><label>Last Name</label><input v-model="user.lastName" /></div>
          <div class="form-group"><label>Nickname</label><input v-model="user.nickname" /></div>
          <div class="form-group"><label>Email</label><input v-model="user.email" type="email" /></div>
          <div class="form-group"><label>Phone</label><input v-model="user.phone" /></div>
        </div>
      </div>
      <div class="btn-row"><button class="btn-primary" @click="saveProfile">Save Changes</button><button class="btn-ghost" @click="forgotPassword">Forgot Password?</button></div>
      <div v-if="savedMsg" class="save-msg">✅ Profile saved successfully!</div>
    </div>

    <div class="section">
      <h3>Saved Addresses</h3>
      <ul class="address-list"><li v-for="addr in addresses" :key="addr.id"><span>📍</span> {{ addr.line }}</li></ul>
      <button class="btn-outline">+ Add New Address</button>
    </div>

    <div class="section">
      <h3>Payment Methods</h3>
      <ul class="payment-list"><li><span>💳</span> VISA ending in 1234</li><li><span>🅿️</span> PayPal (user@example.com)</li></ul>
      <button class="btn-outline">+ Add Payment Method</button>
    </div>

    <div class="section">
      <h3>Order History</h3>
      <div v-for="order in orders" :key="order.id" class="order-item"><div><strong>Order #{{ order.id }}</strong><span class="order-total">¥{{ order.total.toLocaleString() }}</span></div><span :class="['order-status', order.status.toLowerCase()]">{{ order.status }}</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const user = ref({ firstName: 'John', lastName: 'Doe', nickname: 'johnd', email: 'john@example.com', phone: '+86 123 4567 8900' })
const addresses = ref([{ id: 1, line: '123 Main St, Beijing' }, { id: 2, line: '456 Nanjing Rd, Shanghai' }])
const orders = ref([{ id: 1001, total: 799, status: 'Delivered' }, { id: 1002, total: 299, status: 'Shipped' }, { id: 1003, total: 4999, status: 'Processing' }])
const savedMsg = ref(false)

const initials = computed(() => (user.value.firstName[0] + user.value.lastName[0]).toUpperCase())

const saveProfile = () => { savedMsg.value = true; setTimeout(() => { savedMsg.value = false }, 3000) }
const forgotPassword = () => alert('Password reset link sent to your email (simulated)')
</script>

<style scoped>
.profile-container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 28px; }
.section { margin-bottom: 24px; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: white; }
.section h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 20px; color: #1a1a1a; }
.profile-row { display: flex; gap: 28px; align-items: flex-start; }
.avatar { width: 72px; height: 72px; background: #ff6b6b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.82rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; }
.form-group input { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
.form-group input:focus { border-color: #ff6b6b; }
.btn-row { display: flex; gap: 12px; margin-top: 20px; align-items: center; }
.btn-primary { background: #ff6b6b; color: white; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-primary:hover { background: #e95c5c; }
.btn-ghost { background: none; border: none; color: #64748b; cursor: pointer; font-size: 0.9rem; }
.btn-ghost:hover { color: #ff6b6b; }
.btn-outline { margin-top: 12px; background: none; border: 1px solid #e2e8f0; color: #374151; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
.btn-outline:hover { border-color: #ff6b6b; color: #ff6b6b; }
.save-msg { margin-top: 12px; color: #059669; font-size: 0.9rem; font-weight: 500; }
.address-list, .payment-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.address-list li, .payment-list li { display: flex; gap: 10px; align-items: center; color: #374151; padding: 10px 14px; background: #f8fafc; border-radius: 8px; }
.order-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; }
.order-total { margin-left: 14px; color: #ff6b6b; font-weight: 700; }
.order-status { padding: 4px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; }
.order-status.delivered { background: #d1fae5; color: #065f46; }
.order-status.shipped { background: #dbeafe; color: #1e40af; }
.order-status.processing { background: #fef3c7; color: #92400e; }
@media (max-width: 600px) { .profile-row { flex-direction: column; } .info-grid { grid-template-columns: 1fr; } }
</style>
