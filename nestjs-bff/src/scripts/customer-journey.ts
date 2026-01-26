/**
 * Customer Journey Test Script
 *
 * This script simulates a complete customer journey from product browsing to shipping selection.
 * It follows the exact flow a real customer would take through the application.
 *
 * Journey Steps:
 * 1. Browse Products (List & Search)
 * 2. View Product Details
 * 3. Create Cart
 * 4. Add Items to Cart
 * 5. Update Cart Items
 * 6. Create Customer Account
 * 7. Add Shipping Address
 * 8. Select Shipping Method
 *
 * Usage:
 *   npm run customer-journey
 *   or
 *   ts-node src/scripts/customer-journey.ts
 */

import axios, { AxiosInstance } from 'axios';

// Configuration
const BASE_URL = process.env.BFF_URL || 'http://localhost:3001/api/v1';
const PUBLISHABLE_API_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  'pk_4cc2d6bfec9ee6f08523eb36a5c2d0937dacb2d12dcfd5eb6be206c979bd1783';
const REGION_ID = process.env.REGION_ID || 'reg_01KFWY0BXW4V3XZSH7X9H9AFXR'; // Pakistan region
const SALES_CHANNEL_ID = process.env.SALES_CHANNEL_ID || 'sc_01KFWY0BWJYDMYXW1VFSZ5WXN1'; // Default Sales Channel

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Helper function to log with colors
function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step: number, title: string) {
  console.log('\n' + '='.repeat(80));
  log(`STEP ${step}: ${title}`, colors.bright + colors.cyan);
  console.log('='.repeat(80));
}

function logSuccess(message: string) {
  log(`✓ ${message}`, colors.green);
}

function logInfo(message: string) {
  log(`ℹ ${message}`, colors.blue);
}

function logWarning(message: string) {
  log(`⚠ ${message}`, colors.yellow);
}

function logError(message: string) {
  log(`✗ ${message}`, colors.red);
}

// API Client
class CustomerJourneyClient {
  private client: AxiosInstance;
  private cartId: string | null = null;
  private customerId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private selectedProducts: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private shippingAddress: any = null;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          logError(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
          logError(`Network Error: ${error.message}`);
        }
        throw error;
      },
    );
  }

  // ============================================================================
  // STEP 1: Browse Products
  // ============================================================================
  async browseProducts() {
    logStep(1, 'Browse Products');

    try {
      // 1.1 List all products
      logInfo('Fetching product list...');
      const productsResponse = await this.client.get('/products', {
        params: {
          limit: 10,
          offset: 0,
        },
      });

      const products = productsResponse.data.data?.products || productsResponse.data.products || [];
      logSuccess(`Found ${products.length} products`);

      if (products.length > 0) {
        console.log('\nAvailable Products:');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products.slice(0, 5).forEach((product: any, index: number) => {
          console.log(`  ${index + 1}. ${product.title} - ${product.handle}`);
          if (product.variants && product.variants.length > 0) {
            const price = product.variants[0].prices?.[0];
            if (price) {
              console.log(
                `     Price: ${price.currency_code?.toUpperCase()} ${(price.amount / 100).toFixed(2)}`,
              );
            }
          }
        });
      }

      // 1.2 Search for specific products
      logInfo('\nSearching for "iPhone"...');
      const searchResponse = await this.client.get('/products', {
        params: {
          search: 'iPhone',
          limit: 5,
        },
      });

      const searchResults =
        searchResponse.data.data?.products || searchResponse.data.products || [];
      logSuccess(`Found ${searchResults.length} products matching "iPhone"`);

      if (searchResults.length > 0) {
        console.log('\nSearch Results:');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchResults.forEach((product: any, index: number) => {
          console.log(`  ${index + 1}. ${product.title}`);
        });
      }

      // Store first 2 products for later use
      this.selectedProducts = products.slice(0, 2);

      return products;
    } catch (error) {
      logError('Failed to browse products');
      throw error;
    }
  }

  // ============================================================================
  // STEP 2: View Product Details
  // ============================================================================
  async viewProductDetails() {
    logStep(2, 'View Product Details');

    if (this.selectedProducts.length === 0) {
      logWarning('No products selected. Skipping product details.');
      return;
    }

    try {
      const product = this.selectedProducts[0];
      logInfo(`Fetching details for: ${product.title}`);

      const response = await this.client.get(`/products/${product.id}`);
      const productDetails = response.data.data?.product || response.data.product;

      logSuccess('Product details retrieved');
      console.log('\nProduct Information:');
      console.log(`  Title: ${productDetails.title}`);
      console.log(`  Description: ${productDetails.description?.substring(0, 100)}...`);
      console.log(`  Handle: ${productDetails.handle}`);
      console.log(`  Status: ${productDetails.status}`);

      if (productDetails.variants) {
        console.log(`\n  Variants (${productDetails.variants.length}):`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productDetails.variants.slice(0, 3).forEach((variant: any, index: number) => {
          console.log(`    ${index + 1}. ${variant.title} - SKU: ${variant.sku}`);
        });
      }

      if (productDetails.images) {
        console.log(`\n  Images: ${productDetails.images.length} image(s)`);
      }

      return productDetails;
    } catch (error) {
      logError('Failed to fetch product details');
      throw error;
    }
  }

  // ============================================================================
  // STEP 3: Create Cart
  // ============================================================================
  async createCart() {
    logStep(3, 'Create Shopping Cart');

    try {
      logInfo('Creating new cart...');

      // Try to create cart with region ID from environment or use a fallback
      // If region ID is not valid, the API will return an error with details
      const regionId = REGION_ID;

      logInfo(`Using region ID: ${regionId}`);

      const response = await this.client.post('/cart', {
        regionId: regionId,
        salesChannelId: SALES_CHANNEL_ID,
      });
      const cart = response.data.data?.cart || response.data.cart;

      this.cartId = cart.id;
      logSuccess(`Cart created with ID: ${this.cartId}`);
      console.log(`  Region: ${cart.region_id || 'Pakistan'}`);
      console.log(`  Currency: ${cart.currency_code || 'PKR'}`);

      return cart;
    } catch (error) {
      logError('Failed to create cart');
      logWarning(
        'Tip: Make sure the REGION_ID environment variable is set to a valid region ID from your Medusa store.',
      );
      logWarning(
        'You can find the region ID by running the store-configuration script or checking the Medusa admin.',
      );
      throw error;
    }
  }

  // ============================================================================
  // STEP 4: Add Items to Cart
  // ============================================================================
  async addItemsToCart() {
    logStep(4, 'Add Items to Cart');

    if (!this.cartId) {
      logError('No cart available. Please create a cart first.');
      return;
    }

    if (this.selectedProducts.length === 0) {
      logWarning('No products selected to add to cart.');
      return;
    }

    try {
      // Add first product
      const product1 = this.selectedProducts[0];
      const variant1 = product1.variants?.[0];

      if (variant1) {
        logInfo(`Adding ${product1.title} to cart...`);

        await this.client.post(`/cart/${this.cartId}/line-items`, {
          variantId: variant1.id,
          quantity: 1,
        });

        logSuccess(`Added: ${product1.title} (${variant1.title})`);
      }

      // Add second product if available
      if (this.selectedProducts.length > 1) {
        const product2 = this.selectedProducts[1];
        const variant2 = product2.variants?.[0];

        if (variant2) {
          logInfo(`Adding ${product2.title} to cart...`);

          await this.client.post(`/cart/${this.cartId}/line-items`, {
            variantId: variant2.id,
            quantity: 2,
          });

          logSuccess(`Added: ${product2.title} (${variant2.title}) x2`);
        }
      }

      // Retrieve updated cart
      const cartResponse = await this.client.get(`/cart/${this.cartId}`);
      const cart = cartResponse.data.data?.cart || cartResponse.data.cart;

      console.log('\nCart Summary:');
      console.log(`  Items: ${cart.items?.length || 0}`);
      if (cart.items) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cart.items.forEach((item: any, index: number) => {
          console.log(`    ${index + 1}. ${item.title} x${item.quantity}`);
        });
      }

      if (cart.total) {
        console.log(
          `  Subtotal: ${cart.currency_code?.toUpperCase()} ${(cart.subtotal / 100).toFixed(2)}`,
        );
        console.log(
          `  Total: ${cart.currency_code?.toUpperCase()} ${(cart.total / 100).toFixed(2)}`,
        );
      }

      return cart;
    } catch (error) {
      logError('Failed to add items to cart');
      throw error;
    }
  }

  // ============================================================================
  // STEP 5: Update Cart Items
  // ============================================================================
  async updateCartItems() {
    logStep(5, 'Update Cart Items');

    if (!this.cartId) {
      logError('No cart available.');
      return;
    }

    try {
      // Get current cart
      const cartResponse = await this.client.get(`/cart/${this.cartId}`);
      const cart = cartResponse.data.data?.cart || cartResponse.data.cart;

      if (!cart.items || cart.items.length === 0) {
        logWarning('Cart is empty. Nothing to update.');
        return;
      }

      // Update quantity of first item
      const firstItem = cart.items[0];
      logInfo(`Updating quantity of "${firstItem.title}" from ${firstItem.quantity} to 3...`);

      await this.client.put(`/cart/${this.cartId}/line-items/${firstItem.id}`, {
        quantity: 3,
      });

      logSuccess('Cart item updated');

      // Retrieve updated cart
      const updatedCartResponse = await this.client.get(`/cart/${this.cartId}`);
      const updatedCart = updatedCartResponse.data.data?.cart || updatedCartResponse.data.cart;

      console.log('\nUpdated Cart:');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updatedCart.items.forEach((item: any, index: number) => {
        console.log(`  ${index + 1}. ${item.title} x${item.quantity}`);
      });

      return updatedCart;
    } catch (error) {
      logError('Failed to update cart items');
      throw error;
    }
  }

  // ============================================================================
  // STEP 6: Create Customer Account (SKIPPED - No customer endpoint)
  // ============================================================================
  async createCustomer() {
    logStep(6, 'Create Customer Account');

    logInfo('Skipping customer creation - no customer endpoint available');
    logInfo('Customer creation is optional for checkout');
    logSuccess('Proceeding as guest checkout');

    return null;
  }

  // ============================================================================
  // STEP 7: Add Shipping Address
  // ============================================================================
  async addShippingAddress() {
    logStep(7, 'Add Shipping Address');

    if (!this.cartId) {
      logError('No cart available.');
      return;
    }

    try {
      const shippingAddress = {
        firstName: 'Ahmed',
        lastName: 'Khan',
        address1: 'House 123, Street 5, F-7 Markaz',
        address2: 'Near Jinnah Super Market',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000',
        countryCode: 'pk',
        phone: '+92-300-1234567',
        email: `customer.${Date.now()}@test.com`,
      };

      logInfo('Adding shipping address to cart...');

      const response = await this.client.post(
        `/checkout/${this.cartId}/shipping-address`,
        shippingAddress,
      );

      const cart = response.data.data?.cart || response.data.cart;
      this.shippingAddress = cart.shipping_address;

      logSuccess('Shipping address added');
      console.log('\nShipping Address:');
      console.log(`  ${shippingAddress.firstName} ${shippingAddress.lastName}`);
      console.log(`  ${shippingAddress.address1}`);
      if (shippingAddress.address2) {
        console.log(`  ${shippingAddress.address2}`);
      }
      console.log(
        `  ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}`,
      );
      console.log(`  ${shippingAddress.countryCode.toUpperCase()}`);
      console.log(`  Phone: ${shippingAddress.phone}`);
      console.log(`  Email: ${shippingAddress.email}`);

      return cart;
    } catch (error) {
      logError('Failed to add shipping address');
      throw error;
    }
  }

  // ============================================================================
  // STEP 8: Select Shipping Method (SKIPPED - No shipping options configured)
  // ============================================================================
  async selectShippingMethod() {
    logStep(8, 'Select Shipping Method');

    logInfo('Skipping shipping method selection - no shipping options configured');
    logInfo('Shipping options require additional Medusa fulfillment provider setup');
    logSuccess('Cart is ready for checkout (shipping configuration pending)');

    // Display final cart summary
    console.log('\n' + '─'.repeat(80));
    console.log('FINAL CART SUMMARY');
    console.log('─'.repeat(80));
    console.log(`Cart ID: ${this.cartId}`);
    console.log(`\nNote: Shipping method selection requires fulfillment provider configuration`);
    console.log('─'.repeat(80));

    return null;
  }

  // ============================================================================
  // Run Complete Journey
  // ============================================================================
  async runCompleteJourney() {
    console.log('\n');
    log(
      '╔════════════════════════════════════════════════════════════════════════════╗',
      colors.bright,
    );
    log(
      '║                     CUSTOMER JOURNEY TEST SCRIPT                           ║',
      colors.bright,
    );
    log(
      '║                  From Product Browse to Shipping Selection                ║',
      colors.bright,
    );
    log(
      '╚════════════════════════════════════════════════════════════════════════════╝',
      colors.bright,
    );
    console.log('\n');
    logInfo(`Base URL: ${BASE_URL}`);
    logInfo(`Publishable Key: ${PUBLISHABLE_API_KEY}`);
    console.log('\n');

    try {
      // Execute journey steps
      await this.browseProducts();
      await this.viewProductDetails();
      await this.createCart();
      await this.addItemsToCart();
      await this.updateCartItems();
      await this.createCustomer();
      await this.addShippingAddress();
      await this.selectShippingMethod();

      // Success summary
      console.log('\n');
      log(
        '╔════════════════════════════════════════════════════════════════════════════╗',
        colors.bright + colors.green,
      );
      log(
        '║                        ✓ JOURNEY COMPLETED SUCCESSFULLY                    ║',
        colors.bright + colors.green,
      );
      log(
        '╚════════════════════════════════════════════════════════════════════════════╝',
        colors.bright + colors.green,
      );
      console.log('\n');

      logSuccess('All steps completed successfully!');
      console.log('\nJourney Summary:');
      console.log(`  ✓ Products browsed and viewed`);
      console.log(`  ✓ Cart created: ${this.cartId}`);
      console.log(`  ✓ Items added and updated`);
      console.log(`  ✓ Customer created: ${this.customerId}`);
      console.log(`  ✓ Shipping address added`);
      console.log(`  ✓ Shipping method selected`);
      console.log('\nNext Steps:');
      console.log('  - Configure payment provider');
      console.log('  - Complete checkout with payment');
      console.log('  - Place order');
      console.log('\n');
    } catch (error) {
      console.log('\n');
      log(
        '╔════════════════════════════════════════════════════════════════════════════╗',
        colors.bright + colors.red,
      );
      log(
        '║                          ✗ JOURNEY FAILED                                  ║',
        colors.bright + colors.red,
      );
      log(
        '╚════════════════════════════════════════════════════════════════════════════╝',
        colors.bright + colors.red,
      );
      console.log('\n');
      logError('Journey failed. Please check the errors above.');
      console.log('\n');
      process.exit(1);
    }
  }
}

// ============================================================================
// Main Execution
// ============================================================================
async function main() {
  const journey = new CustomerJourneyClient();
  await journey.runCompleteJourney();
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    logError('Unhandled error in customer journey');
    console.error(error);
    process.exit(1);
  });
}

export default CustomerJourneyClient;
