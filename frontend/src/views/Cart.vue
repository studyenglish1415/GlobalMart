<template>
  <div class="cart-container">
    <h2>🛒 Shopping Cart</h2>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛍️</div>
      <p>Your cart is empty.</p>
      <router-link to="/" class="continue-btn">Continue Shopping</router-link>
    </div>

    <div v-else>
      <table class="cart-table">
        <thead>
          <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.id">
            <td class="product-col"><img :src="item.image" :alt="item.name" class="item-img" @error="onImgError" /><span>{{ item.name }}</span></td>
            <td>¥{{ item.price.toLocaleString() }}</td>
            <td><div class="qty-control"><button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button><span>{{ item.quantity }}</span><button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button></div></td>
            <td class="subtotal">¥{{ (item.price * item.quantity).toLocaleString() }}</td>
            <td><button class="remove-btn" @click="cartStore.removeItem(item.id)">✕</button></td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <div class="summary-row"><span>Items ({{ cartStore.totalItems }})</span><span>¥{{ cartStore.subtotal.toLocaleString() }}</span></div>
        <div class="summary-row total"><span>Total</span><span class="total-price">¥{{ cartStore.subtotal.toLocaleString() }}</span></div>
        <div class="cart-actions"><button class="clear-btn" @click="cartStore.clearCart()">Clear Cart</button><router-link to="/payment" class="checkout-btn">Proceed to Checkout →</router-link></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()
const onImgError = (e) => { e.target.src = 'https://placehold.co/60x60?text=?' }
</script>

<style scoped>
.cart-container { max-width: 1000px; margin: 40px auto; padding: 20px; }
h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 28px; }
.empty-cart { text-align: center; padding: 80px 20px; background: white; border-radius: 16px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-cart p { color: #64748b; font-size: 1.1rem; margin-bottom: 24px; }
.continue-btn { background: #ff6b6b; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; }
.cart-table { width: 100%; border-collapse: collapse; background: white; border-radius: 14px; overflow: hidden; margin-bottom: 24px; }
.cart-table th { background: #f8fafc; padding: 14px 16px; text-align: left; font-size: 0.85rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
.cart-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; }
.product-col { display: flex; align-items: center; gap: 14px; }
.item-img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: #f8fafc; }
.qty-control { display: flex; align-items: center; gap: 10px; }
.qty-control button { width: 30px; height: 30px; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: all 0.15s; }
.qty-control button:hover:not(:disabled) { background: #ff6b6b; color: white; border-color: #ff6b6b; }
.qty-control button:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-control span { font-weight: 600; min-width: 20px; text-align: center; }
.subtotal { font-weight: 600; color: #1a1a1a; }
.remove-btn { background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
.remove-btn:hover { background: #fee2e2; color: #dc2626; }
.cart-summary { background: white; border-radius: 14px; padding: 24px; }
.summary-row { display: flex; justify-content: space-between; padding: 8px 0; color: #64748b; }
.summary-row.total { border-top: 2px solid #f1f5f9; margin-top: 12px; padding-top: 16px; font-weight: 700; font-size: 1.1rem; }
.total-price { color: #ff6b6b; font-size: 1.3rem; }
.cart-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.clear-btn { background: none; border: 1px solid #e2e8f0; color: #64748b; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.clear-btn:hover { border-color: #ff6b6b; color: #ff6b6b; }
.checkout-btn { background: #ff6b6b; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 1rem; }
.checkout-btn:hover { background: #e95c5c; }
</style>
