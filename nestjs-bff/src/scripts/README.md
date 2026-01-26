# Customer Journey Test Script

This directory contains test scripts for simulating customer interactions with the NestJS BFF API.

## Customer Journey Script

The `customer-journey.ts` script simulates a complete customer shopping flow from browsing products to selecting shipping.

### Journey Steps

1. **Browse Products** - List and search for products
2. **View Product Details** - Get detailed information about a product
3. **Create Cart** - Initialize a new shopping cart
4. **Add Items to Cart** - Add products to the cart
5. **Update Cart Items** - Modify quantities
6. **Create Customer Account** - Register a new customer
7. **Add Shipping Address** - Set delivery address
8. **Select Shipping Method** - Choose shipping option

### Prerequisites

1. **Medusa Backend** must be running on `http://localhost:9000`
2. **NestJS BFF** must be running on `http://localhost:3001`
3. **Products** must be seeded in the database
4. **Shipping options** must be configured for the region

### Running the Script

```bash
# From the nestjs-bff directory
npm run customer-journey
```

Or directly with ts-node:

```bash
ts-node -r tsconfig-paths/register src/scripts/customer-journey.ts
```

### Environment Variables

The script uses the following environment variables (with defaults):

- `BFF_URL` - NestJS BFF base URL (default: `http://localhost:3001/api/v1`)
- `MEDUSA_PUBLISHABLE_KEY` - Medusa publishable API key (default: from your store configuration)

### Expected Output

The script will output colored console logs showing:

- ✓ Success messages in green
- ℹ Info messages in blue
- ⚠ Warning messages in yellow
- ✗ Error messages in red

### Example Output

```
╔════════════════════════════════════════════════════════════════════════════╗
║                     CUSTOMER JOURNEY TEST SCRIPT                           ║
║                  From Product Browse to Shipping Selection                ║
╚════════════════════════════════════════════════════════════════════════════╝

================================================================================
STEP 1: Browse Products
================================================================================
ℹ Fetching product list...
✓ Found 10 products

Available Products:
  1. iPhone 15 Pro Max - iphone-15-pro-max
     Price: PKR 549999.00
  2. iPhone 15 - iphone-15
     Price: PKR 379999.00
  ...

================================================================================
STEP 2: View Product Details
================================================================================
...

╔════════════════════════════════════════════════════════════════════════════╗
║                        ✓ JOURNEY COMPLETED SUCCESSFULLY                    ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Troubleshooting

**No products found:**

- Ensure products are seeded: `cd medusa-backend && npx medusa exec ./src/scripts/category-product-configuration.ts`

**No shipping options available:**

- Verify shipping options are configured in your region
- Check that the shipping address matches a configured region
- Run the store configuration script: `npx medusa exec ./src/scripts/store-configuration.ts`

**Cart creation fails:**

- Ensure the region and currency are properly configured
- Check that the sales channel is set up correctly

**Connection errors:**

- Verify Medusa backend is running on port 9000
- Verify NestJS BFF is running on port 3001
- Check network connectivity

### Next Steps

After this script completes successfully, the next steps in the customer journey would be:

1. **Payment Integration** - Configure payment provider (Stripe, PayPal, etc.)
2. **Complete Checkout** - Process payment and create order
3. **Order Confirmation** - Send confirmation email and update inventory

### Extending the Script

To add more steps to the journey:

1. Add a new method to the `CustomerJourneyClient` class
2. Call the method in the `runCompleteJourney()` method
3. Follow the existing pattern for logging and error handling

Example:

```typescript
async applyDiscountCode() {
  logStep(9, 'Apply Discount Code');

  try {
    logInfo('Applying discount code...');

    const response = await this.client.post(`/carts/${this.cartId}/discounts`, {
      code: 'WELCOME10',
    });

    logSuccess('Discount applied');
    return response.data;
  } catch (error) {
    logError('Failed to apply discount');
    throw error;
  }
}
```

### API Endpoints Used

The script calls the following NestJS BFF endpoints:

- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/carts` - Create cart
- `POST /api/v1/carts/:id/line-items` - Add item to cart
- `POST /api/v1/carts/:id/line-items/:item_id` - Update cart item
- `GET /api/v1/carts/:id` - Get cart
- `POST /api/v1/customers` - Create customer
- `POST /api/v1/carts/:id/shipping-address` - Add shipping address
- `GET /api/v1/carts/:id/shipping-options` - Get shipping options
- `POST /api/v1/carts/:id/shipping-methods` - Select shipping method

### Notes

- The script uses TypeScript with some type warnings due to dynamic API responses
- These warnings don't affect runtime behavior
- For production use, consider defining proper TypeScript interfaces for all API responses
- The script creates a new customer with a timestamped email on each run
- Cart IDs and customer IDs are logged for debugging purposes
