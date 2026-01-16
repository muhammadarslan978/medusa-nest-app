# Store Configuration API Guide

This guide explains the Store Management APIs in the NestJS BFF and the correct order for configuring your e-commerce store.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Configuration Order](#configuration-order)
4. [API Reference](#api-reference)
5. [Complete Setup Example](#complete-setup-example)

---

## Overview

The Store module provides comprehensive APIs for managing all aspects of your Medusa store configuration. All endpoints require **admin authentication** via Bearer token.

### Base URL

```
http://localhost:3001/api/v1/store
```

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STORE CONFIGURATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Store Setup
┌─────────────┐
│   STORE     │ ──► Name, Default Settings, Supported Currencies
└─────────────┘

Step 2: Sales Channels
┌─────────────┐
│   SALES     │ ──► Web, Mobile, B2B, Marketplace channels
│  CHANNELS   │
└─────────────┘

Step 3: Regions
┌─────────────┐
│  REGIONS    │ ──► Geographic regions with currency & tax settings
└─────────────┘

Step 4: Stock Locations
┌─────────────┐
│   STOCK     │ ──► Warehouses, fulfillment centers
│ LOCATIONS   │ ──► Link to Sales Channels
└─────────────┘

Step 5: API Keys
┌─────────────┐
│  API KEYS   │ ──► Publishable keys for storefronts
└─────────────┘     Link to Sales Channels
```

---

## Authentication

All Store APIs require admin authentication. First, obtain a token:

```bash
# Get admin token from Medusa backend
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa.local","password":"supersecret123"}'

# Response
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

Use this token in all subsequent requests:

```bash
curl http://localhost:3001/api/v1/store \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## Configuration Order

Follow this order when setting up a new store:

### Step 1: Configure Store Settings

First, update your store name and add supported currencies.

```bash
# 1.1 Get current store details
GET /api/v1/store

# 1.2 Update store name
PUT /api/v1/store
{
  "name": "Rox Store"
}

# 1.3 Add currencies (e.g., USD, PKR)
POST /api/v1/store/currencies
{
  "currency_code": "usd",
  "is_default": false
}

POST /api/v1/store/currencies
{
  "currency_code": "pkr",
  "is_default": false
}
```

### Step 2: Create Sales Channels

Sales channels represent different storefronts where products are sold.

```bash
# 2.1 List existing sales channels
GET /api/v1/store/sales-channels

# 2.2 Create additional channels if needed
POST /api/v1/store/sales-channels
{
  "name": "Mobile App",
  "description": "iOS and Android mobile application"
}

POST /api/v1/store/sales-channels
{
  "name": "B2B Portal",
  "description": "Wholesale customer portal"
}
```

### Step 3: Create Regions

Regions define geographic areas with specific currency, tax, and shipping settings.

```bash
# 3.1 Create a region for Pakistan
POST /api/v1/store/regions
{
  "name": "Pakistan",
  "currency_code": "pkr",
  "countries": ["pk"],
  "automatic_taxes": true
}

# 3.2 Create a region for USA
POST /api/v1/store/regions
{
  "name": "United States",
  "currency_code": "usd",
  "countries": ["us"],
  "automatic_taxes": true
}
```

### Step 4: Create Stock Locations

Stock locations are warehouses or fulfillment centers where inventory is stored.

```bash
# 4.1 Create a stock location
POST /api/v1/store/stock-locations
{
  "name": "Main Warehouse",
  "address": {
    "address_1": "123 Warehouse Street",
    "city": "Islamabad",
    "country_code": "pk",
    "province": "Capital",
    "postal_code": "44000"
  }
}

# 4.2 Link stock location to sales channel
POST /api/v1/store/stock-locations/{location_id}/sales-channels
{
  "add": ["sc_01KF0HA17R96P1CSEW8SB5RVF4"]
}

```

### Step 5: Create API Keys

API keys are used by storefronts to access the Store API.

```bash
# 5.1 Create a publishable API key
POST /api/v1/store/api-keys
{
  "title": "Web Store Key",
  "type": "publishable"
}

# 5.2 Link API key to sales channel
POST /api/v1/store/api-keys/{api_key_id}/sales-channels
{
  "add": ["sc_01KERTP3F6XYZVVPZQ7BJG1332"]
}
```

### Step 6: Set Store Defaults

Finally, set the default region and location for the store.

```bash
PUT /api/v1/store
{
  "default_region_id": "<region_id>",
  "default_location_id": "<location_id>"
}
```

---

## API Reference

### Store APIs

| Method   | Endpoint                  | Description                |
| -------- | ------------------------- | -------------------------- |
| `GET`    | `/store`                  | Get store details          |
| `PUT`    | `/store`                  | Update store settings      |
| `POST`   | `/store/currencies`       | Add currency to store      |
| `DELETE` | `/store/currencies/:code` | Remove currency from store |

#### Get Store Details

```bash
GET /api/v1/store
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "store_01KERTP3FGS6J73FAWXTRAJ5C3",
    "name": "Rox Store",
    "default_sales_channel_id": "sc_01KERTP3F6XYZVVPZQ7BJG1332",
    "default_region_id": null,
    "default_location_id": null,
    "supported_currencies": [
      {
        "id": "stocur_01KERTP3FK632AT2P86WPMA90H",
        "currency_code": "eur",
        "is_default": true,
        "symbol": "€",
        "name": "Euro"
      }
    ],
    "created_at": "2026-01-12T10:05:36.110Z",
    "updated_at": "2026-01-12T10:05:36.110Z"
  }
}
```

#### Update Store

```bash
PUT /api/v1/store
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My New Store Name",
  "default_region_id": "reg_123",
  "default_location_id": "sloc_456"
}
```

---

### Sales Channel APIs

| Method   | Endpoint                             | Description             |
| -------- | ------------------------------------ | ----------------------- |
| `GET`    | `/store/sales-channels`              | List all sales channels |
| `GET`    | `/store/sales-channels/:id`          | Get a sales channel     |
| `POST`   | `/store/sales-channels`              | Create a sales channel  |
| `PUT`    | `/store/sales-channels/:id`          | Update a sales channel  |
| `DELETE` | `/store/sales-channels/:id`          | Delete a sales channel  |
| `POST`   | `/store/sales-channels/:id/products` | Add/remove products     |

#### Create Sales Channel

```bash
POST /api/v1/store/sales-channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mobile App",
  "description": "iOS and Android application",
  "is_disabled": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "sc_01NEW123456789",
    "name": "Mobile App",
    "description": "iOS and Android application",
    "is_disabled": false,
    "created_at": "2026-01-15T09:00:00.000Z",
    "updated_at": "2026-01-15T09:00:00.000Z"
  }
}
```

#### Add Products to Sales Channel

```bash
POST /api/v1/store/sales-channels/{id}/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "add": ["prod_123", "prod_456"],
  "remove": ["prod_789"]
}
```

---

### Region APIs

| Method   | Endpoint             | Description      |
| -------- | -------------------- | ---------------- |
| `GET`    | `/store/regions`     | List all regions |
| `GET`    | `/store/regions/:id` | Get a region     |
| `POST`   | `/store/regions`     | Create a region  |
| `PUT`    | `/store/regions/:id` | Update a region  |
| `DELETE` | `/store/regions/:id` | Delete a region  |

#### Create Region

```bash
POST /api/v1/store/regions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pakistan",
  "currency_code": "pkr",
  "countries": ["pk"],
  "automatic_taxes": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "reg_01NEW123456789",
    "name": "Pakistan",
    "currency_code": "pkr",
    "automatic_taxes": true,
    "countries": [{ "iso_2": "pk", "name": "Pakistan" }],
    "created_at": "2026-01-15T09:00:00.000Z",
    "updated_at": "2026-01-15T09:00:00.000Z"
  }
}
```

---

### Stock Location APIs

| Method   | Endpoint                                    | Description              |
| -------- | ------------------------------------------- | ------------------------ |
| `GET`    | `/store/stock-locations`                    | List all stock locations |
| `GET`    | `/store/stock-locations/:id`                | Get a stock location     |
| `POST`   | `/store/stock-locations`                    | Create a stock location  |
| `PUT`    | `/store/stock-locations/:id`                | Update a stock location  |
| `DELETE` | `/store/stock-locations/:id`                | Delete a stock location  |
| `POST`   | `/store/stock-locations/:id/sales-channels` | Link to sales channels   |

#### Create Stock Location

```bash
POST /api/v1/store/stock-locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Main Warehouse",
  "address": {
    "address_1": "123 Warehouse Street",
    "address_2": "Building A",
    "city": "Islamabad",
    "country_code": "pk",
    "province": "Capital",
    "postal_code": "44000",
    "phone": "+92-51-1234567"
  }
}
```

#### Link Stock Location to Sales Channels

```bash
POST /api/v1/store/stock-locations/{id}/sales-channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "add": ["sc_01KERTP3F6XYZVVPZQ7BJG1332"],
  "remove": []
}
```

---

### API Key APIs

| Method   | Endpoint                             | Description            |
| -------- | ------------------------------------ | ---------------------- |
| `GET`    | `/store/api-keys`                    | List all API keys      |
| `GET`    | `/store/api-keys/:id`                | Get an API key         |
| `POST`   | `/store/api-keys`                    | Create an API key      |
| `PUT`    | `/store/api-keys/:id`                | Update an API key      |
| `DELETE` | `/store/api-keys/:id`                | Delete an API key      |
| `POST`   | `/store/api-keys/:id/revoke`         | Revoke an API key      |
| `POST`   | `/store/api-keys/:id/sales-channels` | Link to sales channels |

#### Create API Key

```bash
POST /api/v1/store/api-keys
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Store Key",
  "type": "publishable"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "apk_01NEW123456789",
    "title": "Web Store Key",
    "token": "pk_abc123def456...",
    "redacted": "pk_abc***456",
    "type": "publishable",
    "sales_channels": [],
    "created_at": "2026-01-15T09:00:00.000Z",
    "updated_at": "2026-01-15T09:00:00.000Z"
  }
}
```

---

### Currency APIs

| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| `GET`  | `/store/currencies` | List all available currencies |

#### List Currencies

```bash
GET /api/v1/store/currencies
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "currencies": [
      {
        "code": "usd",
        "name": "US Dollar",
        "symbol": "$",
        "decimal_digits": 2
      },
      { "code": "eur", "name": "Euro", "symbol": "€", "decimal_digits": 2 },
      {
        "code": "pkr",
        "name": "Pakistani Rupee",
        "symbol": "₨",
        "decimal_digits": 0
      }
    ],
    "count": 123,
    "offset": 0,
    "limit": 200
  }
}
```

---

## Complete Setup Example

Here's a complete example of setting up a new store from scratch:

```bash
# Set your admin token
TOKEN="your_admin_token_here"
BASE_URL="http://localhost:3001/api/v1"

# ============================================================================
# STEP 1: Update Store Name
# ============================================================================
curl -X PUT "$BASE_URL/store" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Rox Store"}'

# ============================================================================
# STEP 2: Add Currencies
# ============================================================================
curl -X POST "$BASE_URL/store/currencies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currency_code": "usd", "is_default": false}'

curl -X POST "$BASE_URL/store/currencies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currency_code": "pkr", "is_default": false}'

# ============================================================================
# STEP 3: Create Region
# ============================================================================
REGION_RESPONSE=$(curl -s -X POST "$BASE_URL/store/regions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pakistan",
    "currency_code": "pkr",
    "countries": ["pk"],
    "automatic_taxes": true
  }')

REGION_ID=$(echo $REGION_RESPONSE | jq -r '.data.id')
echo "Created Region: $REGION_ID"

# ============================================================================
# STEP 4: Create Stock Location
# ============================================================================
LOCATION_RESPONSE=$(curl -s -X POST "$BASE_URL/store/stock-locations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "address": {
      "address_1": "123 Warehouse Street",
      "city": "Islamabad",
      "country_code": "pk",
      "province": "Capital",
      "postal_code": "44000"
    }
  }')

LOCATION_ID=$(echo $LOCATION_RESPONSE | jq -r '.data.id')
echo "Created Stock Location: $LOCATION_ID"

# ============================================================================
# STEP 5: Link Stock Location to Default Sales Channel
# ============================================================================
curl -X POST "$BASE_URL/store/stock-locations/$LOCATION_ID/sales-channels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"add": ["sc_01KERTP3F6XYZVVPZQ7BJG1332"]}'

# ============================================================================
# STEP 6: Create API Key for Storefront
# ============================================================================
API_KEY_RESPONSE=$(curl -s -X POST "$BASE_URL/store/api-keys" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Store Key",
    "type": "publishable"
  }')

API_KEY_ID=$(echo $API_KEY_RESPONSE | jq -r '.data.id')
API_KEY_TOKEN=$(echo $API_KEY_RESPONSE | jq -r '.data.token')
echo "Created API Key: $API_KEY_ID"
echo "Token: $API_KEY_TOKEN"

# ============================================================================
# STEP 7: Link API Key to Sales Channel
# ============================================================================
curl -X POST "$BASE_URL/store/api-keys/$API_KEY_ID/sales-channels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"add": ["sc_01KERTP3F6XYZVVPZQ7BJG1332"]}'

# ============================================================================
# STEP 8: Set Store Defaults
# ============================================================================
curl -X PUT "$BASE_URL/store" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"default_region_id\": \"$REGION_ID\",
    \"default_location_id\": \"$LOCATION_ID\"
  }"

echo "Store setup complete!"
```

---

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                           │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    STORE    │
                              │  (Rox Store)│
                              └──────┬──────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
    ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
    │  CURRENCIES │          │   REGIONS   │          │    SALES    │
    │ USD,EUR,PKR │          │ PK, US, EU  │          │  CHANNELS   │
    └─────────────┘          └──────┬──────┘          └──────┬──────┘
                                    │                        │
                                    │                        │
                                    ▼                        │
                             ┌─────────────┐                 │
                             │  COUNTRIES  │                 │
                             │  pk, us, de │                 │
                             └─────────────┘                 │
                                                             │
           ┌─────────────────────────────────────────────────┤
           │                                                 │
           ▼                                                 ▼
    ┌─────────────┐                                  ┌─────────────┐
    │    STOCK    │◄─────────────────────────────────│  API KEYS   │
    │  LOCATIONS  │      (linked via sales           │ publishable │
    │  Warehouse  │       channels)                  └─────────────┘
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  INVENTORY  │
    │   LEVELS    │
    └─────────────┘
```

---

## Error Handling

All endpoints return consistent error responses:

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Admin authorization header is required",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Region with ID reg_123 not found",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## Best Practices

1. **Always create regions before checkout** - Regions are required for cart/checkout to work
2. **Link stock locations to sales channels** - Products won't show inventory without this
3. **Create separate API keys per storefront** - Better security and tracking
4. **Use meaningful names** - Makes management easier in the admin dashboard
5. **Set store defaults** - Improves customer experience with pre-selected options

---

_Generated on: January 15, 2026_
_NestJS BFF Version: 1.0.0_
