# Medusa v2 + NestJS BFF Architecture

A production-ready e-commerce backend setup with **Medusa v2** as the headless commerce engine and **NestJS** as the Backend-for-Frontend (BFF) layer.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   NestJS BFF    │────▶│  Medusa v2      │
│   (Next.js)     │     │   (Port 3001)   │     │  (Port 9000)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   PostgreSQL    │
                                               │   + Redis       │
                                               └─────────────────┘
```

## Project Structure

```
medusa-nest/
├── medusa-backend/          # Medusa v2 E-commerce Backend
│   ├── src/
│   │   ├── api/             # Custom API routes
│   │   └── scripts/         # Seed scripts
│   ├── medusa-config.ts     # Medusa configuration
│   └── package.json
│
├── nestjs-bff/              # NestJS Backend-for-Frontend
│   ├── src/
│   │   ├── common/          # Shared utilities, filters, interceptors
│   │   ├── config/          # Configuration module
│   │   ├── medusa/          # Medusa SDK integration
│   │   └── modules/
│   │       ├── auth/        # Customer authentication
│   │       ├── cart/        # Shopping cart
│   │       ├── checkout/    # Checkout flow
│   │       ├── health/      # Health checks
│   │       ├── orders/      # Order management
│   │       └── products/    # Product catalog
│   └── package.json
│
├── docker-compose.yml       # Docker setup for development
└── README.md
```

## Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** & **Docker Compose** (for containerized setup)
- **PostgreSQL** 16+ (if running locally)
- **Redis** 7+ (if running locally)

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Clone and navigate to the project
cd medusa-nest

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

This will start:

- **PostgreSQL** on port `5432`
- **Redis** on port `6379`
- **Medusa Backend** on port `9000`
- **NestJS BFF** on port `3001`

## Manual Setup

### 1. Set Up Medusa Backend

```bash
cd medusa-backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

Medusa will be available at `http://localhost:9000`

### 2. Set Up NestJS BFF

```bash
cd nestjs-bff

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run start:dev
```

BFF will be available at `http://localhost:3001`

## API Documentation

Once the NestJS BFF is running, access the Swagger documentation at:

**http://localhost:3001/docs**

### Available Endpoints

| Module   | Endpoint                                         | Description           |
| -------- | ------------------------------------------------ | --------------------- |
| Products | `GET /api/v1/products`                           | List all products     |
| Products | `GET /api/v1/products/:id`                       | Get product by ID     |
| Products | `GET /api/v1/products/handle/:h`                 | Get product by handle |
| Cart     | `POST /api/v1/cart`                              | Create new cart       |
| Cart     | `GET /api/v1/cart/:id`                           | Get cart by ID        |
| Cart     | `POST /api/v1/cart/:id/line-items`               | Add item to cart      |
| Cart     | `PUT /api/v1/cart/:id/line-items/:itemId`        | Update line item      |
| Cart     | `DELETE /api/v1/cart/:id/line-items/:itemId`     | Remove line item      |
| Checkout | `GET /api/v1/checkout/:cartId/shipping-options`  | Get shipping options  |
| Checkout | `POST /api/v1/checkout/:cartId/shipping-address` | Set shipping address  |
| Checkout | `POST /api/v1/checkout/:cartId/complete`         | Complete checkout     |
| Auth     | `POST /api/v1/auth/register`                     | Register customer     |
| Auth     | `POST /api/v1/auth/login`                        | Login customer        |
| Auth     | `GET /api/v1/auth/me`                            | Get current customer  |
| Orders   | `GET /api/v1/orders`                             | Get customer orders   |
| Orders   | `GET /api/v1/orders/:id`                         | Get order by ID       |
| Health   | `GET /api/v1/health`                             | Health check          |

## Environment Variables

### Medusa Backend (.env)

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
COOKIE_SECRET=your-super-secret-cookie-key-min-32-chars
STORE_CORS=http://localhost:3001
ADMIN_CORS=http://localhost:9000
```

### NestJS BFF (.env)

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=your-publishable-key
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=debug
```

## Development

### Running Tests

```bash
# NestJS BFF tests
cd nestjs-bff
npm run test
npm run test:cov  # with coverage
```

### Linting & Formatting

```bash
cd nestjs-bff
npm run lint
npm run format
```

### Building for Production

```bash
# Medusa Backend
cd medusa-backend
npm run build

# NestJS BFF
cd nestjs-bff
npm run build
npm run start:prod
```

## Key Features

### NestJS BFF Features

- **TypeScript** with strict mode
- **Swagger/OpenAPI** documentation
- **Class-validator** for DTO validation
- **Global exception filters** for consistent error responses
- **Request logging** interceptor
- **Response transformation** interceptor
- **Health checks** for production readiness
- **Environment-based configuration**

### Security

- **Helmet** for HTTP security headers
- **CORS** configuration
- **Input validation** on all endpoints
- **Error sanitization** (no stack traces in production)

## Extending the BFF

### Adding a New Module

1. Create module folder in `src/modules/`
2. Create controller, service, and DTOs
3. Register module in `app.module.ts`

Example:

```typescript
// src/modules/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
```

### Using the Medusa Service

```typescript
import { MedusaService } from '../../medusa/medusa.service';

@Injectable()
export class YourService {
  constructor(private readonly medusaService: MedusaService) {}

  async getData() {
    return this.medusaService.storeRequest('/your-endpoint');
  }
}
```

## Troubleshooting

### Common Issues

1. **Database connection failed**

   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` in `.env`

2. **Redis connection failed**

   - Ensure Redis is running
   - Check `REDIS_URL` in `.env`

3. **Medusa API errors in BFF**

   - Verify `MEDUSA_BACKEND_URL` is correct
   - Check if Medusa is running and healthy

4. **CORS errors**
   - Update `CORS_ORIGINS` in BFF `.env`
   - Update `STORE_CORS` in Medusa `.env`

## License

MIT
