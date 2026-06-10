<template>
  <div class="container">
    <div class="hero">
      <div class="hero-text">
        <h1>Shop the World, <span>Delivered to You</span></h1>
        <p>Cross-border shopping made simple — multiple currencies, global brands.</p>
      </div>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search products..."
          @keyup.enter="goToSearch"
        />
        <button @click="goToSearch">Search</button>
      </div>
    </div>

    <h2 class="section-title">Recommended for You</h2>
    <div class="product-grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const searchQuery = ref('')

const fetchProducts = () => {
  products.value = [
    { id: 1, name: 'BMW Series 3', price: 35999, image: '/images/BMW_SERIES_3.jpg', rating: 4.8 },
    { id: 2, name: 'BMW Series 5', price: 48999, image: '/images/BMW_SERIES_5.jpg', rating: 4.9 },
    { id: 3, name: 'BMW X3', price: 42999, image: '/images/BMW_X3.jpg', rating: 4.7 },
    { id: 4, name: 'BMW X5', price: 58999, image: '/images/BMW_X5.jpeg', rating: 4.9 },
    { id: 5, name: 'Huawei Phone', price: 4999, image: '/images/Huawei.png', rating: 4.5 },
    { id: 6, name: 'Xiaomi 14', price: 3999, image: '/images/xiaomi14.jpg', rating: 4.6 },
    { id: 7, name: 'Xiaomi 15', price: 4499, image: '/images/xiaomi15.jpg', rating: 4.7 },
    { id: 8, name: 'iPhone 16', price: 6999, image: '/images/iphone16.png', rating: 4.9 },
    { id: 9, name: 'iPhone 18', price: 8999, image: '/images/iphone18.jpg', rating: 5.0 },
    { id: 10, name: 'AirPods', price: 1299, image: '/images/airpods.jpeg', rating: 4.8 },
    { id: 11, name: 'Mi Refrigerator', price: 2499, image: '/images/MiFridge.jpg', rating: 4.4 },
    { id: 12, name: 'Hat', price: 199, image: '/images/hat.jpeg', rating: 4.2 },
    { id: 13, name: 'Jeans', price: 499, image: '/images/jeanes.jpg', rating: 4.3 },
    { id: 14, name: 'Shoes', price: 899, image: '/images/shoes.jpg', rating: 4.6 },
    { id: 15, name: 'T-Shirt', price: 199, image: '/images/t_shirt.jpg', rating: 4.1 }
  ]
}

const goToSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  border-radius: 16px;
  padding: 48px 40px;
  margin-bottom: 48px;
  color: white;
}
.hero-text h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 10px; }
.hero-text h1 span { color: #ff6b6b; }
.hero-text p { color: #94a3b8; margin-bottom: 28px; font-size: 1.05rem; }
.search-bar { display: flex; gap: 10px; max-width: 560px; }
.search-bar input { flex: 1; padding: 14px 18px; border: none; border-radius: 10px; font-size: 1rem; outline: none; }
.search-bar button { padding: 14px 28px; background: #ff6b6b; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; }
.search-bar button:hover { background: #e95c5c; }
.section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 24px; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
</style>
