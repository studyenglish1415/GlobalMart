<template>
  <div class="product-card" @click="goToProduct">
    <div class="image-wrap"><img :src="product.image" :alt="product.name" class="product-image" @error="onImgError" /></div>
    <div class="card-body"><h3>{{ product.name }}</h3><div class="rating">⭐ {{ product.rating }}</div><div class="price">¥{{ product.price.toLocaleString() }}</div><button class="add-btn" @click.stop="addToCart">{{ added ? '✓ Added!' : 'Add to Cart' }}</button></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps(['product'])
const router = useRouter()
const cartStore = useCartStore()
const added = ref(false)

const goToProduct = () => router.push(`/product/${props.product.id}`)
const addToCart = () => { cartStore.addItem(props.product); added.value = true; setTimeout(() => { added.value = false }, 1500) }
const onImgError = (e) => { e.target.src = 'https://placehold.co/220x180?text=No+Image' }
</script>

<style scoped>
.product-card { border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; background: white; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.image-wrap { background: #f8fafc; height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.product-image { width: 100%; height: 100%; object-fit: cover; }
.card-body { padding: 14px; }
h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; color: #1a1a1a; }
.rating { color: #f59e0b; font-size: 0.85rem; margin-bottom: 8px; }
.price { color: #ff6b6b; font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; }
.add-btn { width: 100%; background: #ff6b6b; color: white; border: none; padding: 9px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: background 0.2s; }
.add-btn:hover { background: #e95c5c; }
</style>
