# GlobalMart E-Commerce Platform - Setup & Quick Start Guide

Welcome to GlobalMart! This guide will help you get the complete e-commerce platform up and running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start (5 minutes)

### Step 1: Create PostgreSQL Database

```bash
# Using PostgreSQL CLI
createdb globalmart

# Or using pgAdmin or another client
# Create database: globalmart
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database migrations to create tables
npm run migration:run

# Start development server
npm run start:dev
```

✅ Backend running at: `http://localhost:3000`
📚 Swagger API docs at: `http://localhost:3000/api`

### Step 3: Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

## 📁 Project Structure

```
GlobalMartVersion2/
├── backend/              # NestJS Backend
│   ├── src/
│   │   ├── main.ts      # Server entry point
│   │   ├── app.module.ts
│   │   ├── database/    # Entities & Migrations
│   │   └── modules/     # Feature modules
│   ├── package.json
│   └── ormconfig.ts     # TypeORM config
├── frontend/             # Vue.js Frontend
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── views/       # Pages
│   │   ├── stores/      # Pinia state
│   │   └── services/    # API client
│   ├── package.json
│   └── vite.config.js
├── database/             # Database schemas
│   ├── schema.sql       # Full database schema
│   └── README.md        # DB documentation
└── README.md            # This file
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=globalmart

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Frontend URL (CORS)
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_APP_TITLE=GlobalMart
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000
```

## 🗄️ Database Setup

### Option 1: Using SQL File (Automatic)

```bash
cd database
psql -U postgres -d globalmart -f schema.sql
```

### Option 2: Using TypeORM Migrations (Recommended)

```bash
cd backend
npm run migration:run
```

## 📚 Available Commands

### Backend Commands

```bash
# Development
npm run start:dev        # Start with auto-reload
npm run start:debug      # Debug mode

# Production
npm run build           # Compile TypeScript
npm run start:prod      # Run production build

# Testing
npm run test            # Run unit tests
npm run test:watch      # Watch mode
npm run test:e2e        # End-to-end tests

# Linting & Formatting
npm run lint            # Check code style
npm run format          # Auto-format code

# Database
npm run migration:run       # Run migrations
npm run migration:revert    # Rollback migrations
npm run migration:generate  # Generate migration from entities
```

### Frontend Commands

```bash
# Development
npm run dev             # Start dev server

# Production
npm run build           # Production build
npm run preview         # Preview build

# Code Quality
npm run lint            # Check ESLint
npm run format          # Format with Prettier
```

## 🔑 Key Features

### ✅ Implemented
- [x] User authentication (JWT)
- [x] Product catalog with categories & brands
- [x] Shopping cart functionality
- [x] Order management
- [x] Payment integration ready
- [x] Product reviews & ratings
- [x] Coupon/discount system
- [x] User address management
- [x] Order tracking & history

### 📦 Database Entities
- Users & User Sessions
- Products with variants
- Product attributes
- Categories (hierarchical)
- Brands
- Shopping Cart
- Orders & Order Items
- Payments & Refunds
- Reviews & Images
- Coupons & Usage tracking
- Addresses

## 🛣️ API Routes

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Products
- `GET /products` - List products
- `GET /products/:id` - Get product details
- `POST /products` - Create (admin)
- `PUT /products/:id` - Update (admin)
- `DELETE /products/:id` - Delete (admin)

### Cart
- `GET /cart` - Get cart
- `POST /cart/items` - Add item
- `PUT /cart/items/:id` - Update item
- `DELETE /cart/items/:id` - Remove item

### Orders
- `GET /orders` - My orders
- `POST /orders` - Create order
- `GET /orders/:id` - Order details

### Reviews
- `GET /products/:id/reviews` - Get reviews
- `POST /reviews` - Create review
- `DELETE /reviews/:id` - Delete review

## 📖 Documentation

- **Backend**: See [backend/README.md](./backend/README.md)
- **Frontend**: See [frontend/README.md](./frontend/README.md)
- **Database**: See [database/README.md](./database/README.md)

## 🐳 Docker Setup (Optional)

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down
```

## 🔗 Development Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api
- PostgreSQL: localhost:5432

## 🆘 Troubleshooting

### Backend won't start
1. Check if port 3000 is available
2. Verify PostgreSQL is running
3. Confirm `.env` database credentials
4. Run `npm install` again

### Frontend shows blank page
1. Check browser console for errors
2. Verify API URL in `.env`
3. Ensure backend is running
4. Clear browser cache (Ctrl+Shift+Delete)

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify database exists
psql -U postgres -l | grep globalmart
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
```

## 📚 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Vue.js 3 Guide](https://vuejs.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeORM Guide](https://typeorm.io)
- [Swagger/OpenAPI](https://swagger.io)

## 🎯 Next Steps

1. **Create Admin Module** - User roles & permissions
2. **Implement Payment Gateway** - Stripe/PayPal integration
3. **Add File Upload** - Product images & reviews
4. **Email Notifications** - Order confirmations
5. **Search & Filtering** - Advanced product search
6. **Analytics Dashboard** - Sales & user metrics
7. **Mobile Optimization** - Responsive design
8. **Performance** - Caching & optimization

## 📝 Project Checklist

- [x] Project structure created
- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running (port 3000)
- [ ] Frontend server running (port 5173)
- [ ] Swagger API documentation accessible
- [ ] Sample products added
- [ ] User authentication tested

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## 📄 License

MIT License - See LICENSE file for details

## ✉️ Support

For issues or questions:
- Check documentation in `/backend/README.md` and `/frontend/README.md`
- Review database schema in `database/schema.sql`
- Check API endpoints in Swagger at `http://localhost:3000/api`

---

**Happy Coding! 🚀**

Last Updated: May 2026
Version: 2.0.0
