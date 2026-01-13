# Medusa v2 Configuration & API Report

## Configuration Summary

### `medusa-config.ts` Analysis

| Setting           | Value                           | Purpose                                      |
| ----------------- | ------------------------------- | -------------------------------------------- |
| **Database**      | PostgreSQL via `DATABASE_URL`   | Primary data store for all commerce data     |
| **Redis**         | `REDIS_URL`                     | Caching and event bus                        |
| **Store CORS**    | `http://localhost:3001`         | Allows storefront (BFF) to access Store APIs |
| **Admin CORS**    | `http://localhost:9000`         | Allows admin dashboard access                |
| **Auth CORS**     | `localhost:3001,localhost:9000` | Authentication endpoints access              |
| **JWT Secret**    | Environment variable            | Token signing for authentication             |
| **Cookie Secret** | Environment variable            | Session cookie encryption                    |

### Modules Configured

1. **Cache Redis** (`@medusajs/medusa/cache-redis`)

   - Purpose: Caches frequently accessed data for performance
   - Reduces database load for product listings, regions, etc.

2. **Event Bus Redis** (`@medusajs/medusa/event-bus-redis`)
   - Purpose: Pub/sub system for async event handling
   - Used for: order notifications, inventory updates, webhooks

---

## Medusa v2 Default Store APIs

All Store APIs are prefixed with `/store`. Base URL: `http://localhost:9000/store`

### ⚠️ IMPORTANT: Publishable API Key Required

**All Store API requests require the `x-publishable-api-key` header.**

```bash
# Example request
curl http://localhost:9000/store/products \
  -H "x-publishable-api-key: pk_72ee0112ea1beaadd6e17e5ca9382f49ae99ee875f26663eea92671c9a02b33f"
```

**Your Publishable API Key:**

```
pk_72ee0112ea1beaadd6e17e5ca9382f49ae99ee875f26663eea92671c9a02b33f
```

**Setup Steps (already completed):**

1. Created admin user: `admin@medusa.local` / `supersecret123`
2. Created publishable API key via Admin API
3. Linked API key to "Default Sales Channel"

---

### 1. Authentication APIs

| Endpoint                                   | Method | Purpose                                                                  |
| ------------------------------------------ | ------ | ------------------------------------------------------------------------ |
| `/auth/customer/emailpass`                 | POST   | **Customer Login** - Authenticate with email/password, returns JWT token |
| `/auth/customer/emailpass/register`        | POST   | **Customer Registration** - Create new customer account                  |
| `/auth/customer/emailpass/reset-password`  | POST   | **Request Password Reset** - Sends reset email to customer               |
| `/auth/customer/emailpass/update-password` | POST   | **Update Password** - Set new password using reset token                 |
| `/auth/session`                            | DELETE | **Logout** - Invalidate current session                                  |
| `/auth/token/refresh`                      | POST   | **Refresh Token** - Get new access token                                 |

**Authentication Flow:**

```
1. Customer registers → POST /auth/customer/emailpass/register
2. Customer logs in → POST /auth/customer/emailpass (returns token)
3. Use token in Authorization header for protected endpoints
4. Token expires → POST /auth/token/refresh
5. Forgot password → POST /auth/customer/emailpass/reset-password
6. Reset password → POST /auth/customer/emailpass/update-password
```

---

### 2. Customer APIs

| Endpoint                            | Method | Purpose                                    |
| ----------------------------------- | ------ | ------------------------------------------ |
| `/store/customers`                  | POST   | Create customer (registration)             |
| `/store/customers/me`               | GET    | Get current authenticated customer profile |
| `/store/customers/me`               | POST   | Update customer profile                    |
| `/store/customers/me/addresses`     | GET    | List customer addresses                    |
| `/store/customers/me/addresses`     | POST   | Add new address                            |
| `/store/customers/me/addresses/:id` | POST   | Update address                             |
| `/store/customers/me/addresses/:id` | DELETE | Delete address                             |

---

### 3. Product APIs

| Endpoint              | Method | Purpose                                  |
| --------------------- | ------ | ---------------------------------------- |
| `/store/products`     | GET    | List products with filtering, pagination |
| `/store/products/:id` | GET    | Get single product by ID                 |

**Query Parameters for Products:**

- `limit`, `offset` - Pagination
- `q` - Search query
- `category_id[]` - Filter by categories
- `collection_id[]` - Filter by collections
- `tags[]` - Filter by tags
- `type_id[]` - Filter by product types
- `region_id` - Get prices for specific region
- `currency_code` - Get prices in specific currency

---

### 4. Cart APIs

| Endpoint                               | Method | Purpose                                        |
| -------------------------------------- | ------ | ---------------------------------------------- |
| `/store/carts`                         | POST   | **Create Cart** - Initialize new shopping cart |
| `/store/carts/:id`                     | GET    | Get cart by ID                                 |
| `/store/carts/:id`                     | POST   | Update cart (email, shipping address, etc.)    |
| `/store/carts/:id/line-items`          | POST   | **Add Item** - Add product variant to cart     |
| `/store/carts/:id/line-items/:line_id` | POST   | **Update Item** - Change quantity              |
| `/store/carts/:id/line-items/:line_id` | DELETE | **Remove Item** - Delete from cart             |
| `/store/carts/:id/shipping-methods`    | POST   | Select shipping method                         |
| `/store/carts/:id/payment-sessions`    | POST   | Initialize payment options                     |
| `/store/carts/:id/complete`            | POST   | **Complete Order** - Finalize checkout         |

**Cart Flow:**

```
1. Create cart → POST /store/carts
2. Add items → POST /store/carts/:id/line-items
3. Set shipping address → POST /store/carts/:id
4. Get shipping options → GET /store/shipping-options/:cart_id
5. Select shipping → POST /store/carts/:id/shipping-methods
6. Initialize payment → POST /store/carts/:id/payment-sessions
7. Complete order → POST /store/carts/:id/complete
```

---

### 5. Order APIs

| Endpoint                     | Method | Purpose                                 |
| ---------------------------- | ------ | --------------------------------------- |
| `/store/orders/:id`          | GET    | Get order by ID (for confirmation page) |
| `/store/customers/me/orders` | GET    | List customer's orders (requires auth)  |

---

### 6. Region APIs

| Endpoint             | Method | Purpose                                               |
| -------------------- | ------ | ----------------------------------------------------- |
| `/store/regions`     | GET    | List all regions                                      |
| `/store/regions/:id` | GET    | Get region details (countries, currencies, tax rates) |

**Purpose:** Regions define:

- Available countries
- Currency
- Tax rates
- Payment providers
- Fulfillment providers

---

### 7. Collection APIs

| Endpoint                 | Method | Purpose                  |
| ------------------------ | ------ | ------------------------ |
| `/store/collections`     | GET    | List product collections |
| `/store/collections/:id` | GET    | Get collection details   |

---

### 8. Product Category APIs

| Endpoint                        | Method | Purpose                        |
| ------------------------------- | ------ | ------------------------------ |
| `/store/product-categories`     | GET    | List categories (hierarchical) |
| `/store/product-categories/:id` | GET    | Get category with products     |

---

### 9. Shipping Options APIs

| Endpoint                           | Method | Purpose                                 |
| ---------------------------------- | ------ | --------------------------------------- |
| `/store/shipping-options/:cart_id` | GET    | Get available shipping options for cart |

---

### 10. Payment APIs

| Endpoint                                          | Method | Purpose                          |
| ------------------------------------------------- | ------ | -------------------------------- |
| `/store/payment-providers`                        | GET    | List available payment providers |
| `/store/payment-collections/:id`                  | GET    | Get payment collection details   |
| `/store/payment-collections/:id/payment-sessions` | POST   | Create payment session           |

---

### 11. Return APIs

| Endpoint                | Method | Purpose               |
| ----------------------- | ------ | --------------------- |
| `/store/returns`        | POST   | Create return request |
| `/store/return-reasons` | GET    | List return reasons   |

---

### 12. Currency APIs

| Endpoint            | Method | Purpose                   |
| ------------------- | ------ | ------------------------- |
| `/store/currencies` | GET    | List supported currencies |

---

## Custom API Endpoint

Your project includes a custom endpoint:

**File:** `src/api/store/custom/route.ts`

| Endpoint        | Method | Response                                                    |
| --------------- | ------ | ----------------------------------------------------------- |
| `/store/custom` | GET    | `{ message: "Medusa v2 API is running", timestamp: "..." }` |

---

## Security Considerations

1. **JWT Authentication**: All customer-specific endpoints require Bearer token
2. **CORS Configuration**: Properly configured for storefront and admin
3. **Secrets**: JWT and Cookie secrets should be 32+ characters in production
4. **HTTPS**: Use HTTPS in production for all API calls

---

## Environment Variables Required

| Variable        | Required | Description                       |
| --------------- | -------- | --------------------------------- |
| `DATABASE_URL`  | Yes      | PostgreSQL connection string      |
| `REDIS_URL`     | Yes      | Redis connection string           |
| `JWT_SECRET`    | Yes      | Min 32 chars, for token signing   |
| `COOKIE_SECRET` | Yes      | Min 32 chars, for session cookies |
| `STORE_CORS`    | Yes      | Storefront origin(s)              |
| `ADMIN_CORS`    | Yes      | Admin dashboard origin            |
| `AUTH_CORS`     | Yes      | Auth endpoints origins            |

---

## Summary

Your Medusa v2 backend provides a complete e-commerce API including:

- **Authentication**: Registration, login, password reset, token refresh
- **Customer Management**: Profile, addresses
- **Product Catalog**: Products, categories, collections, variants
- **Shopping Cart**: Full cart lifecycle management
- **Checkout**: Shipping, payments, order completion
- **Orders**: Order history and tracking
- **Returns**: Return request handling

The NestJS BFF acts as an intermediary layer that:

1. Transforms Medusa's snake_case responses to camelCase
2. Adds additional validation and error handling
3. Provides a cleaner API contract for frontend applications
4. Can add custom business logic and data aggregation
