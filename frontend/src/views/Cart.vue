<template>
  <div class="cart">
    <h1>Shopping Cart</h1>
    
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/products" class="btn-primary">Continue Shopping</router-link>
    </div>

    <div v-else>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.id">
            <td>{{ item.product_name }}</td>
            <td>${{ item.price }}</td>
            <td>
              <input 
                :value="item.quantity" 
                type="number" 
                min="1"
                @change="(e) => cartStore.updateQuantity(item.id, parseInt((e.target as HTMLInputElement).value))"
              />
            </td>
            <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button @click="cartStore.removeItem(item.id)" class="btn-danger">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Tax:</span>
          <span>${{ tax.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ (subtotal + tax).toFixed(2) }}</span>
        </div>
        <button class="btn-success checkout">Checkout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const tax = computed(() => {
  return subtotal.value * 0.1 // 10% tax
})
</script>

<style scoped>
.empty-cart {
  text-align: center;
  padding: 3rem;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-table th {
  background-color: #f0f0f0;
  padding: 1rem;
  text-align: left;
}

.cart-table td {
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.cart-table input {
  width: 60px;
}

.cart-summary {
  background: white;
  max-width: 400px;
  margin-left: auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: bold;
  border-top: 2px solid #ddd;
  padding-top: 1rem;
  margin-top: 1rem;
}

.checkout {
  width: 100%;
  margin-top: 1rem;
}
</style>
