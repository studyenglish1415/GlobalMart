import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CartItem {
  id: number
  product_id: number
  product_name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  function addItem(item: CartItem) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  function removeItem(itemId: number) {
    items.value = items.value.filter((i) => i.id !== itemId)
  }

  function updateQuantity(itemId: number, quantity: number) {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
