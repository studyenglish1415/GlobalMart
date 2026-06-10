<template>
  <div class="page-wrap">
    <div class="product-detail" v-if="product">
      <div class="image-col">
        <img :src="product.image" :alt="product.name" class="main-image" @error="onImgError" />
      </div>
      <div class="info-col">
        <div class="breadcrumb"><router-link to="/">Home</router-link> / {{ product.name }}</div>
        <h1>{{ product.name }}</h1>
        <div class="rating">⭐ {{ product.rating }} <span>(128 reviews)</span></div>
        <div class="price">¥{{ product.price.toLocaleString() }}</div>
        <p class="description">{{ product.description }}</p>

        <div class="variants">
          <div class="variant-group">
            <label>Color</label>
            <div class="options">
              <button
                v-for="color in colors" :key="color"
                :class="['option-btn', { active: selectedColor === color }]"
                @click="selectedColor = color"
              >{{ color }}</button>
            </div>
          </div>
          <div class="variant-group">
            <label>Size</label>
            <div class="options">
              <button
                v-for="size in sizes" :key="size"
                :class="['option-btn', { active: selectedSize === size }]"
                @click="selectedSize = size"
              >{{ size }}</button>
            </div>
          </div>
        </div>

        <div class="quantity-row">
          <label>Quantity</label>
          <div class="qty-control">
            <button @click="decrementQty" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQty">+</button>
          </div>
        </div>

        <button class="add-to-cart" @click="addToCart" :class="{ success: addedToCart }">
          {{ addedToCart ? '✓ Added to Cart!' : 'Add to Cart' }}
        </button>

        <div class="trust-badges">
          <span>🚚 Free shipping over ¥999</span>
          <span>🔒 Secure payment</span>
          <span>↩️ 30-day returns</span>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>Loading product...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

interface ProductDetail {
  id: number
  name: string
  price: number
  image: string
  rating: number
  description: string
}

const route = useRoute()
const cartStore = useCartStore()
const product = ref<ProductDetail | null>(null)
const selectedColor = ref('Black')
const selectedSize = ref('M')
const quantity = ref(1)
const addedToCart = ref(false)

const colors = ['Red', 'Blue', 'Black', 'White']
const sizes = ['S', 'M', 'L', 'XL']

const products: Record<number, ProductDetail> = {
  1: { id: 1, name: 'BMW Series 3', price: 35999, image: '/images/BMW_SERIES_3.jpg', description: 'Luxury sedan with sporty performance and advanced tech.', rating: 4.8 },
  2: { id: 2, name: 'BMW Series 5', price: 48999, image: '/images/BMW_SERIES_5.jpg', description: 'Executive business sedan with premium interior.', rating: 4.9 },
  3: { id: 3, name: 'BMW X3', price: 42999, image: '/images/BMW_X3.jpg', description: 'Compact luxury SUV with all-wheel drive.', rating: 4.7 },
  4: { id: 4, name: 'BMW X5', price: 58999, image: '/images/BMW_X5.jpeg', description: 'Spacious and powerful flagship SUV.', rating: 4.9 },
  5: { id: 5, name: 'Huawei Phone', price: 4999, image: '/images/Huawei.png', description: 'Flagship Huawei smartphone with amazing camera.', rating: 4.5 },
  6: { id: 6, name: 'Xiaomi 14', price: 3999, image: '/images/xiaomi14.jpg', description: 'Latest Xiaomi compact powerhouse.', rating: 4.6 },
  7: { id: 7, name: 'Xiaomi 15', price: 4499, image: '/images/xiaomi15.jpg', description: 'Next-gen Xiaomi with hyper-performance.', rating: 4.7 },
  8: { id: 8, name: 'iPhone 16', price: 6999, image: '/images/iphone16.png', description: 'Apple’s newest iPhone with Dynamic Island.', rating: 4.9 },
  9: { id: 9, name: 'iPhone 18', price: 8999, image: '/images/iphone18.jpg', description: 'Futuristic iPhone with breakthrough AI.', rating: 5.0 },
  10: { id: 10, name: 'AirPods', price: 1299, image: '/images/airpods.jpeg', description: 'Wireless earbuds with spatial audio.', rating: 4.8 },
  11: { id: 11, name: 'Mi Refrigerator', price: 2499, image: '/images/MiFridge.jpg', description: 'Smart fridge with energy-saving inverter.', rating: 4.4 },
  12: { id: 12, name: 'Hat', price: 199, image: '/images/hat.jpeg', description: 'Stylish cap for everyday wear.', rating: 4.2 },
  13: { id: 13, name: 'Jeans', price: 499, image: '/images/jeanes.jpg', description: 'Comfortable denim jeans, slim fit.', rating: 4.3 },
  14: { id: 14, name: 'Shoes', price: 899, image: '/images/shoes.jpg', description: 'Running shoes with max cushioning.', rating: 4.6 },
  15: { id: 15, name: 'T-Shirt', price: 199, image: '/images/t_shirt.jpg', description: '100% cotton soft t-shirt.', rating: 4.1 }
}

const fetchProduct = () => {
  const id = parseInt(route.params.id as string)
  product.value = products[id] || null
}

const incrementQty = () => quantity.value++
const decrementQty = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value)
    addedToCart.value = true
    setTimeout(() => { addedToCart.value = false }, 2000)
  }
}

const onImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://placehold.co/400x400?text=No+Image'
}

onMounted(fetchProduct)
</script>

<style scoped>
.page-wrap { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
.product-detail { display: flex; gap: 48px; background: white; border-radius: 16px; padding: 36px; }
.image-col { flex: 0 0 420px; }
.main-image { width: 100%; border-radius: 14px; object-fit: cover; background: #f8fafc; }
.info-col { flex: 1; }
.breadcrumb { font-size: 0.85rem; color: #94a3b8; margin-bottom: 14px; }
.breadcrumb a { color: #64748b; text-decoration: none; }
.breadcrumb a:hover { color: #ff6b6b; }
h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 10px; }
.rating { color: #f59e0b; margin-bottom: 16px; }
.rating span { color: #94a3b8; font-size: 0.85rem; }
.price { font-size: 2rem; color: #ff6b6b; font-weight: 700; margin-bottom: 16px; }
.description { color: #64748b; line-height: 1.7; margin-bottom: 24px; }
.variants { margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px; }
.variant-group label { display: block; font-weight: 600; margin-bottom: 10px; color: #374151; }
.options { display: flex; gap: 8px; flex-wrap: wrap; }
.option-btn { padding: 8px 18px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; transition: all 0.15s; }
.option-btn:hover { border-color: #ff6b6b; }
.option-btn.active { background: #ff6b6b; color: white; border-color: #ff6b6b; }
.quantity-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.quantity-row label { font-weight: 600; }
.qty-control { display: flex; align-items: center; gap: 12px; }
.qty-control button { width: 34px; height: 34px; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 8px; cursor: pointer; font-size: 1.1rem; }
.qty-control button:hover:not(:disabled) { background: #ff6b6b; color: white; border-color: #ff6b6b; }
.qty-control button:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-control span { font-size: 1.1rem; font-weight: 600; min-width: 24px; text-align: center; }
.add-to-cart { width: 100%; padding: 15px; background: #ff6b6b; color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
.add-to-cart:hover { background: #e95c5c; }
.add-to-cart.success { background: #10b981; }
.trust-badges { display: flex; flex-wrap: wrap; gap: 16px; color: #64748b; font-size: 0.85rem; }
.loading { text-align: center; padding: 100px 20px; }
.spinner { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top-color: #ff6b6b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { .product-detail { flex-direction: column; } .image-col { flex: none; } }
</style>
