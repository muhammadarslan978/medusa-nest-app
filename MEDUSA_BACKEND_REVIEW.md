# Medusa Backend - Comprehensive Store Management Review

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MEDUSA v2 BACKEND (Port 9000)                   │
├─────────────────────────────────────────────────────────────────────┤
│  Admin Dashboard: http://localhost:9000/app                         │
│  Admin API:       http://localhost:9000/admin/*                     │
│  Store API:       http://localhost:9000/store/*                     │
│  Auth API:        http://localhost:9000/auth/*                      │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  PostgreSQL │      │    Redis    │      │    Redis    │
│  (Database) │      │   (Cache)   │      │ (Event Bus) │
│  Port 5432  │      │  Port 6379  │      │  Port 6379  │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 2. Project Structure

```
medusa-backend/
├── .env                    # Environment variables
├── .env.example            # Environment template
├── medusa-config.ts        # Main configuration
├── package.json            # Dependencies (Medusa v2.9.0+)
├── tsconfig.json           # TypeScript config
├── Dockerfile              # Container config
└── src/
    ├── api/
    │   └── store/
    │       └── custom/
    │           └── route.ts    # Custom API endpoint
    └── scripts/
        └── seed.ts             # Database seeding script
```

---

## 3. Configuration Details (`medusa-config.ts`)

| Setting           | Value                           | Purpose                      |
| ----------------- | ------------------------------- | ---------------------------- |
| **Database**      | PostgreSQL (via `DATABASE_URL`) | Primary data store           |
| **Redis**         | Enabled (via `REDIS_URL`)       | Cache + Event Bus            |
| **Store CORS**    | `localhost:3001`                | BFF access                   |
| **Admin CORS**    | `localhost:9000`                | Admin dashboard              |
| **Auth CORS**     | `localhost:3001,9000`           | Auth endpoints               |
| **JWT Secret**    | Environment variable            | Token signing                |
| **Cookie Secret** | Environment variable            | Session encryption           |
| **Admin UI**      | Enabled                         | Built-in dashboard at `/app` |

### Modules Enabled

| Module                             | Purpose                                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| `@medusajs/medusa/cache-redis`     | API response caching for performance                         |
| `@medusajs/medusa/event-bus-redis` | Async event handling (order.placed, inventory.updated, etc.) |

---

## 4. Store Configuration

### Current Store Details

| Property                  | Value                              |
| ------------------------- | ---------------------------------- |
| **Store ID**              | `store_01KERTP3FGS6J73FAWXTRAJ5C3` |
| **Name**                  | Medusa Store                       |
| **Default Sales Channel** | `sc_01KERTP3F6XYZVVPZQ7BJG1332`    |
| **Default Currency**      | EUR (€)                            |
| **Default Region**        | Not configured                     |
| **Default Location**      | Not configured                     |
| **Created At**            | 2026-01-12                         |

### Supported Currencies

The system supports **123 currencies** including:

- USD (US Dollar)
- EUR (Euro) - _Currently configured as default_
- GBP (British Pound)
- PKR (Pakistani Rupee)
- And 119 more...

---

## 5. Sales Channels

Sales channels represent different storefronts or marketplaces where products are sold.

| ID                              | Name                  | Status | Description       |
| ------------------------------- | --------------------- | ------ | ----------------- |
| `sc_01KERTP3F6XYZVVPZQ7BJG1332` | Default Sales Channel | Active | Created by Medusa |

### Sales Channel Use Cases

- **Website** - Main e-commerce storefront
- **Mobile App** - iOS/Android application
- **B2B Portal** - Wholesale customers
- **Marketplace** - Third-party platforms (Amazon, eBay)
- **POS** - Point of sale systems

### Multi-Store Architecture

Medusa v2 uses **Sales Channels** for multi-store functionality:

```
┌─────────────────────────────────────────────────────────────┐
│                    MEDUSA STORE                             │
├─────────────────────────────────────────────────────────────┤
│  Sales Channel: Website       → Products A, B, C            │
│  Sales Channel: Mobile App    → Products A, B               │
│  Sales Channel: B2B Portal    → Products C, D, E            │
│  Sales Channel: Marketplace   → Products A, D               │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. API Keys (Publishable)

| Title                       | Token (Redacted) | Type        | Linked Sales Channel  |
| --------------------------- | ---------------- | ----------- | --------------------- |
| Default Publishable API Key | `pk_bbe***936`   | Publishable | Default Sales Channel |
| Storefront API Key          | `pk_72e***33f`   | Publishable | Default Sales Channel |

### Usage

Include `x-publishable-api-key` header in Store API requests:

```bash
curl http://localhost:9000/store/products \
  -H "x-publishable-api-key: pk_72ee0112ea1beaadd6e17e5ca9382f49ae99ee875f26663eea92671c9a02b33f"
```

---

## 7. Products

### Current Products (3)

| Product         | Handle            | Variants | Options     | Status    |
| --------------- | ----------------- | -------- | ----------- | --------- |
| Premium T-Shirt | `premium-t-shirt` | 1        | Size, Color | Published |
| Another Product | `another-product` | 1        | Size        | Published |
| Classic Hoodie  | `classic-hoodie`  | 3        | Size, Color | Published |

### Product Structure

```
Product
├── title, description, handle
├── status (draft, proposed, published, rejected)
├── Options (Size, Color, Material, etc.)
│   └── Values (S, M, L, XL)
├── Variants
│   ├── title, sku, barcode
│   ├── Option combinations (S/Black, M/White)
│   └── Prices (per currency)
├── Images
├── Categories
└── Collections
```

---

## 8. Inventory Management

### Inventory Items (5)

| SKU          | Title         | Stocked Qty | Reserved Qty | Location Levels |
| ------------ | ------------- | ----------- | ------------ | --------------- |
| SHIRT-SM-BLK | Small / Black | 0           | 0            | None            |
| PROD-S       | Small         | 0           | 0            | None            |
| HOODIE-S-NAV | S / Navy      | 0           | 0            | None            |
| HOODIE-M-GRY | M / Gray      | 0           | 0            | None            |
| HOODIE-L-BLK | L / Black     | 0           | 0            | None            |

### Inventory Flow

```
Product Variant → Inventory Item → Location Levels → Stock Location
                                   (quantity per location)
```

### Stock Locations (1)

| Location  | Address                             | City      | Country       |
| --------- | ----------------------------------- | --------- | ------------- |
| Islamabad | Arslan town jhan syedha letrar road | Islamabad | Pakistan (PK) |

**Note:** Stock locations are warehouses/fulfillment centers where inventory is stored.

---

## 9. Regions

**Current Status:** ❌ Not configured

Regions define:

- **Currency** for the region
- **Tax rates** applicable
- **Countries** included
- **Payment providers** available
- **Shipping options** available

### Example Region Configuration

```json
{
  "name": "Pakistan",
  "currency_code": "pkr",
  "countries": ["pk"],
  "tax_rate": 17,
  "payment_providers": ["manual"],
  "fulfillment_providers": ["manual_manual"]
}
```

---

## 10. Shipping

### Shipping Options

**Current Status:** ❌ Not configured

### Shipping Profiles

Shipping profiles group products with similar shipping requirements.

### Fulfillment Providers

| Provider ID     | Status  |
| --------------- | ------- |
| `manual_manual` | Enabled |

This is the default manual fulfillment provider for handling orders manually.

---

## 11. Customers & Orders

| Entity             | Count |
| ------------------ | ----- |
| Customers          | 0     |
| Orders             | 0     |
| Product Categories | 0     |
| Collections        | 0     |

---

## 12. Authentication

### Admin Authentication

```bash
# Get admin token
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa.local","password":"supersecret123"}'

# Response
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Customer Authentication

```bash
# Register customer
curl -X POST http://localhost:9000/store/customers \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: <KEY>" \
  -d '{"email":"customer@example.com","password":"password123","first_name":"John","last_name":"Doe"}'

# Login customer
curl -X POST http://localhost:9000/auth/customer/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password123"}'
```

---

## 13. Admin API Endpoints

### Store Management

| Endpoint            | Method | Purpose               |
| ------------------- | ------ | --------------------- |
| `/admin/stores`     | GET    | List stores           |
| `/admin/stores/:id` | POST   | Update store settings |

### Sales Channels

| Endpoint                             | Method          | Purpose                 |
| ------------------------------------ | --------------- | ----------------------- |
| `/admin/sales-channels`              | GET/POST        | List/Create channels    |
| `/admin/sales-channels/:id`          | GET/POST/DELETE | Manage channel          |
| `/admin/sales-channels/:id/products` | POST            | Add products to channel |

### Products

| Endpoint                       | Method          | Purpose              |
| ------------------------------ | --------------- | -------------------- |
| `/admin/products`              | GET/POST        | List/Create products |
| `/admin/products/:id`          | GET/POST/DELETE | Manage product       |
| `/admin/products/:id/variants` | POST            | Add variants         |
| `/admin/products/:id/options`  | POST            | Add options          |

### Regions

| Endpoint                       | Method          | Purpose             |
| ------------------------------ | --------------- | ------------------- |
| `/admin/regions`               | GET/POST        | List/Create regions |
| `/admin/regions/:id`           | GET/POST/DELETE | Manage region       |
| `/admin/regions/:id/countries` | POST            | Add countries       |

### Inventory

| Endpoint                                     | Method   | Purpose                |
| -------------------------------------------- | -------- | ---------------------- |
| `/admin/inventory-items`                     | GET      | List inventory         |
| `/admin/inventory-items/:id`                 | GET/POST | Manage item            |
| `/admin/inventory-items/:id/location-levels` | POST     | Set stock per location |

### Stock Locations

| Endpoint                                    | Method          | Purpose               |
| ------------------------------------------- | --------------- | --------------------- |
| `/admin/stock-locations`                    | GET/POST        | List/Create locations |
| `/admin/stock-locations/:id`                | GET/POST/DELETE | Manage location       |
| `/admin/stock-locations/:id/sales-channels` | POST            | Link to sales channel |

### Shipping

| Endpoint                       | Method   | Purpose              |
| ------------------------------ | -------- | -------------------- |
| `/admin/shipping-options`      | GET/POST | List/Create shipping |
| `/admin/shipping-profiles`     | GET/POST | Manage profiles      |
| `/admin/fulfillment-providers` | GET      | List providers       |

### Customers

| Endpoint               | Method          | Purpose               |
| ---------------------- | --------------- | --------------------- |
| `/admin/customers`     | GET/POST        | List/Create customers |
| `/admin/customers/:id` | GET/POST/DELETE | Manage customer       |

### Orders

| Endpoint                         | Method | Purpose            |
| -------------------------------- | ------ | ------------------ |
| `/admin/orders`                  | GET    | List orders        |
| `/admin/orders/:id`              | GET    | Get order details  |
| `/admin/orders/:id/fulfillments` | POST   | Create fulfillment |
| `/admin/orders/:id/refunds`      | POST   | Process refund     |

---

## 14. Store API Endpoints (Customer-Facing)

| Endpoint                               | Method      | Purpose              |
| -------------------------------------- | ----------- | -------------------- |
| `/store/products`                      | GET         | List products        |
| `/store/products/:id`                  | GET         | Get product details  |
| `/store/collections`                   | GET         | List collections     |
| `/store/collections/:id`               | GET         | Get collection       |
| `/store/carts`                         | POST        | Create cart          |
| `/store/carts/:id`                     | GET/POST    | Get/Update cart      |
| `/store/carts/:id/line-items`          | POST        | Add item to cart     |
| `/store/carts/:id/line-items/:line_id` | POST/DELETE | Update/Remove item   |
| `/store/carts/:id/shipping-methods`    | POST        | Add shipping method  |
| `/store/carts/:id/payment-sessions`    | POST        | Initialize payment   |
| `/store/carts/:id/complete`            | POST        | Complete checkout    |
| `/store/customers`                     | POST        | Register customer    |
| `/store/customers/me`                  | GET/POST    | Get/Update profile   |
| `/store/orders`                        | GET         | List customer orders |
| `/store/orders/:id`                    | GET         | Get order details    |
| `/store/regions`                       | GET         | List regions         |
| `/store/shipping-options/:cart_id`     | GET         | Get shipping options |

---

## 15. Custom API Endpoint

Located at `src/api/store/custom/route.ts`:

```typescript
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.json({
    message: 'Medusa v2 API is running',
    timestamp: new Date().toISOString(),
  });
}
```

**Endpoint:** `GET /store/custom`

---

## 16. Current Status Summary

### ✅ Configured

| Component      | Details                        |
| -------------- | ------------------------------ |
| Database       | PostgreSQL connected           |
| Redis          | Cache + Event Bus enabled      |
| Admin User     | `admin@medusa.local`           |
| Store          | "Medusa Store" created         |
| Sales Channel  | "Default Sales Channel" active |
| API Keys       | 2 publishable keys created     |
| Stock Location | "Islamabad" created            |
| Products       | 3 products with variants       |
| Fulfillment    | Manual provider enabled        |

### ❌ Not Configured (Required for Checkout)

| Component              | Impact                               |
| ---------------------- | ------------------------------------ |
| **Regions**            | Cannot process orders without region |
| **Shipping Options**   | No delivery methods available        |
| **Payment Providers**  | Cannot accept payments               |
| **Inventory Levels**   | All products show 0 stock            |
| **Product Categories** | No product organization              |
| **Collections**        | No product grouping                  |

---

## 17. Recommended Next Steps

### Step 1: Create a Region

```bash
curl -X POST http://localhost:9000/admin/regions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pakistan",
    "currency_code": "pkr",
    "countries": ["pk"],
    "payment_providers": ["pp_system_default"],
    "fulfillment_providers": ["manual_manual"]
  }'
```

### Step 2: Link Stock Location to Sales Channel

```bash
curl -X POST http://localhost:9000/admin/stock-locations/<LOCATION_ID>/sales-channels \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "add": ["sc_01KERTP3F6XYZVVPZQ7BJG1332"]
  }'
```

### Step 3: Add Inventory Levels

```bash
curl -X POST http://localhost:9000/admin/inventory-items/<ITEM_ID>/location-levels \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "sloc_01KEY4R7TNCSDXKGTV2GMA6KFB",
    "stocked_quantity": 100
  }'
```

### Step 4: Create Shipping Option

```bash
curl -X POST http://localhost:9000/admin/shipping-options \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Shipping",
    "region_id": "<REGION_ID>",
    "provider_id": "manual_manual",
    "price_type": "flat_rate",
    "amount": 500
  }'
```

### Step 5: Add Products to Sales Channel

```bash
curl -X POST http://localhost:9000/admin/sales-channels/<CHANNEL_ID>/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "add": ["prod_01KEVF1CA5ES1J5D9GZJWWSFYQ"]
  }'
```

---

## 18. Environment Variables Reference

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key

# CORS
STORE_CORS=http://localhost:3001
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3001,http://localhost:9000

# Backend URL (for admin)
MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## 19. Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run database migrations
npm run db:migrate

# Generate migration
npm run db:generate

# Run seed script
npm run seed
```

---

_Generated on: January 14, 2026_
_Medusa Version: 2.9.0+_
