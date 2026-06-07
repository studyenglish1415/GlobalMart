# GlobalMart E-Commerce Platform

A full-stack e-commerce application built with Vue.js, NestJS, and PostgreSQL.

## 🏗️ Project Structure

```
GlobalMartVersion2/
├── backend/           # NestJS backend application
├── frontend/          # Vue.js frontend application
├── database/          # PostgreSQL schema and migrations
└── .github/           # GitHub configuration
```

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - UI Framework
- **Vite** - Build tool
- **Axios** - HTTP Client
- **Pinia** - State management

### Backend
- **NestJS** - Backend framework
- **TypeORM** - ORM
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - API Documentation
- **JWT** - Authentication

### Database
- **PostgreSQL 14+**

## 📋 Prerequisites

- **Node.js 18+**
- **npm or yarn**
- **PostgreSQL 14+**
- **Git**

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run typeorm migration:run
npm run start:dev
```

API Documentation will be available at: `http://localhost:3000/api`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

### 3. Database Setup

Create PostgreSQL database and update `.env` in backend:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/globalmart
JWT_SECRET=your_jwt_secret_here
```

## 📚 Database Schema

The database includes the following main entities:
- **Users** - User accounts and authentication
- **Products** - Product catalog with variants and attributes
- **Categories** - Product categorization
- **Brands** - Product brands
- **Cart** - Shopping cart functionality
- **Orders** - Order management
- **Payments** - Payment processing
- **Reviews** - Product reviews
- **Coupons** - Coupon management
- **Addresses** - User delivery addresses

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token

### Products
- `GET /products` - List products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove from cart

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status (admin)

### Reviews
- `GET /products/:id/reviews` - Get product reviews
- `POST /reviews` - Create review
- `DELETE /reviews/:id` - Delete review

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/globalmart
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📦 Dependencies Installation

```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

## 🧪 Running Tests

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
```

## 🏗️ Building for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
```

## 📖 API Documentation

Swagger API documentation is available at:
- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.example.com/api`

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit pull request

## 📝 License

MIT License - see LICENSE file for details

## 📧 Contact & Support

For support, email: support@globalmart.com

---

**Last Updated**: May 2026
**Version**: 2.0.0
