# GlobalMart E-Commerce Project Setup Guide

This document provides setup instructions for the GlobalMart e-commerce platform.

## Project Overview
- **Frontend**: Vue.js 3 with Vite
- **Backend**: NestJS with TypeORM
- **Database**: PostgreSQL
- **API Docs**: Swagger/OpenAPI

## Setup Checklist

- [x] Project structure created
- [ ] Backend NestJS configuration
- [ ] Frontend Vue.js configuration  
- [ ] Database schema migration
- [ ] Environment variables setup
- [ ] Dependencies installation
- [ ] Development servers running

## Backend NestJS Setup

1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with database configuration
4. Run migrations: `npm run typeorm migration:run`
5. Start development server: `npm run start:dev`

API will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

## Frontend Vue.js Setup

1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

Frontend will be available at `http://localhost:5173`

## Database Setup

1. Create PostgreSQL database: `globalmart`
2. Update `backend/.env` with your database credentials
3. Run OpenAPI migrations for schema

## Environment Configuration

Create `.env` files in:
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `database/.env` - Database configuration (if needed)

## Swagger API Documentation

After starting the backend server, access Swagger UI at:
`http://localhost:3000/api`

This provides interactive API documentation and testing interface.

## Development Guidelines

- Use TypeScript for type safety
- Follow NestJS module pattern for backend
- Use Vue 3 Composition API for frontend
- Implement unit tests
- Document API endpoints in Swagger decorators
- Use environment variables for configuration

## Key Features to Implement

1. **Authentication**: JWT-based auth with refresh tokens
2. **Product Management**: CRUD operations with variants
3. **Shopping Cart**: Add/remove/update items
4. **Order Processing**: Create, track, and manage orders
5. **Payment Integration**: Handle payment methods and refunds
6. **Reviews & Ratings**: Product review system
7. **Coupon System**: Discount and promo code handling
8. **User Addresses**: Multiple delivery addresses per user

## Database Tables

The PostgreSQL schema includes:
- users
- products
- categories
- brands
- product_item (variants)
- attributes & attributes_variants
- cart & cart_item
- orders & order_items
- payments & refunds
- reviews & review_images
- coupons & coupon_usage
- addresses
- order_status_history
- payment_method
- users_sessions

## Running the Application

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

- **Database connection issues**: Verify PostgreSQL is running and credentials in `.env` are correct
- **Port conflicts**: Change port in `.env` if 3000 or 5173 are in use
- **Module not found**: Run `npm install` in respective folder
- **TypeORM migrations fail**: Ensure database exists and user has proper permissions

## Additional Resources

- NestJS Documentation: https://docs.nestjs.com
- Vue.js Documentation: https://vuejs.org
- TypeORM Documentation: https://typeorm.io
- Swagger UIDocumentation: https://swagger.io/tools/swagger-ui/
