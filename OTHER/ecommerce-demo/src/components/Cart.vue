<template>
  <div class="cart">
    <h2>Shopping Cart</h2>

    <div v-if="cart.length === 0">
      Cart is empty
    </div>

    <div
      v-for="item in cart"
      :key="item.id"
      class="cart-item"
    >
      <span>
        {{ item.name }}
      </span>

      <span>
        x{{ item.quantity }}
      </span>

      <span>
        ${{ item.price * item.quantity }}
      </span>

      <button @click="$emit('remove-from-cart', item.id)">
        Remove
      </button>
    </div>

    <h3>Total: ${{ total }}</h3>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cart: Array
})

const total = computed(() => {
  return props.cart.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})
</script>

<style scoped>
.cart {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  background: #fafafa;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

button {
  background: crimson;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>