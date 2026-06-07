<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to GlobalMart</h1>
      <p>Your favorite online shopping platform</p>
      <router-link to="/products" class="btn-primary">Start Shopping</router-link>
    </section>

    <section class="features">
      <div class="feature">
        <h3>✈️ Fast Shipping</h3>
        <p>Quick and reliable delivery to your doorstep</p>
      </div>
      <div class="feature">
        <h3>💰 Great Prices</h3>
        <p>Competitive prices on thousands of products</p>
      </div>
      <div class="feature">
        <h3>🛡️ Secure Payment</h3>
        <p>Safe and secure payment options</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  margin-bottom: 1rem;
}
</style>
