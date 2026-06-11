# Backend Development Guide

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Copy `.env.example` to `.env` and update with your configuration:
```bash
cp .env.example .env
```

4. **Configure database:**
Update the `.env` file with your PostgreSQL credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=globalmart
```

5. **Run database migrations:**
```bash
npm run migration:run
```

### Development

**Start development server with auto-reload:**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api`

### Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── modules/                # Feature modules
│   ├── auth/              # Authentication
│   ├── users/             # User management
│   ├── products/          # Product catalog
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order management
│   └── ...
├── database/
│   ├── entities/          # TypeORM entities
│   ├── migrations/        # Database migrations
│   └── seeds/             # Database seeds
├── common/
│   ├── decorators/        # Custom decorators
│   ├── guards/            # Auth guards
│   ├── pipes/             # Validation pipes
│   └── filters/           # Exception filters
└── config/                # Configuration files
```

## Working with TypeORM

### Generate a new migration:
```bash
npm run migration:generate -- -n MigrationName
```

### Create a new migration:
```bash
npm run migration:create -- -n MigrationName
```

### Run migrations:
```bash
npm run migration:run
```

### Revert migrations:
```bash
npm run migration:revert
```

## API Documentation

All endpoints are documented using Swagger/OpenAPI. After starting the server:
- Visit `http://localhost:3000/api` for interactive API documentation
- All endpoints require proper DTOs and validation
- Authentication uses JWT bearer tokens

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `NODE_ENV` - Application environment (development/production)
- `DATABASE_*` - Database connection settings
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRATION` - Token expiration time
- `CORS_ORIGIN` - Frontend URL for CORS
- `PORT` - Server port (default: 3000)

## Key Features Implemented

1. **Authentication** - JWT-based with refresh tokens
2. **Product Management** - Complete CRUD operations
3. **Shopping Cart** - Add, update, remove items
4. **Order Processing** - Create and manage orders
5. **Payment Integration** - Payment method management
6. **Reviews & Ratings** - Product review system
7. **Coupon System** - Discount code handling
8. **User Addresses** - Multiple delivery addresses

## Common Commands

```bash
# Start development
npm run start:dev

# Build project
npm run build

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

## Troubleshooting

1. **Database Connection Error:**
   - Verify PostgreSQL is running
   - Check `.env` credentials
   - Ensure database exists

2. **Port Already in Use:**
   - Change PORT in `.env`
   - Or kill process: `lsof -ti:3000 | xargs kill -9`

3. **Module Not Found:**
   - Run `npm install` again
   - Clear `node_modules` and reinstall

4. **Migration Issues:**
   - Ensure database user has proper permissions
   - Check `.env` database configuration
   - Verify entities are properly registered

## Support

For more information:
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Swagger UI Guide](https://swagger.io/tools/swagger-ui/)

## Admin Panel (no-code CRUD)

You can run an admin UI to perform CRUD operations on all TypeORM entities without writing code using AdminJS.

1. Install additional packages in the `backend` folder:
```bash
cd backend
npm install adminjs @adminjs/express @adminjs/typeorm
```

2. Start the backend in development:
```bash
npm run start:dev
```

3. Visit the admin UI at `http://localhost:3000/admin` (adjust port if you changed `PORT`).

Notes:
- The admin automatically registers all entities exported from `src/database/entities/index.ts`.
- AdminJS runs on top of the Express instance used by Nest; you may secure the `/admin` route (e.g., with auth guards or middleware) for production.
- If you prefer more customization, you can add resource-specific `options` when registering resources in `src/main.ts`.
