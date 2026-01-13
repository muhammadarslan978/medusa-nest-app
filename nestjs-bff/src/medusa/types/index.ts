export interface MedusaProduct {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  handle: string;
  is_giftcard: boolean;
  status: 'draft' | 'proposed' | 'published' | 'rejected';
  thumbnail: string | null;
  images: MedusaImage[];
  options: MedusaProductOption[];
  variants: MedusaProductVariant[];
  categories: MedusaProductCategory[];
  collection_id: string | null;
  collection: MedusaCollection | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export interface MedusaImage {
  id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface MedusaProductOption {
  id: string;
  title: string;
  values: MedusaProductOptionValue[];
  product_id: string;
}

export interface MedusaProductOptionValue {
  id: string;
  value: string;
  option_id: string;
}

export interface MedusaProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  prices: MedusaPrice[];
  options: MedusaProductOptionValue[];
  created_at: string;
  updated_at: string;
}

export interface MedusaPrice {
  id: string;
  currency_code: string;
  amount: number;
  min_quantity: number | null;
  max_quantity: number | null;
}

export interface MedusaProductCategory {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
}

export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
}

export interface MedusaCart {
  id: string;
  email: string | null;
  billing_address: MedusaAddress | null;
  shipping_address: MedusaAddress | null;
  items: MedusaLineItem[];
  region_id: string;
  region: MedusaRegion;
  discounts: MedusaDiscount[];
  gift_cards: MedusaGiftCard[];
  customer_id: string | null;
  payment_session: MedusaPaymentSession | null;
  payment_sessions: MedusaPaymentSession[];
  shipping_methods: MedusaShippingMethod[];
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface MedusaAddress {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country_code: string | null;
  phone: string | null;
}

export interface MedusaLineItem {
  id: string;
  cart_id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  total: number;
  variant_id: string;
  variant: MedusaProductVariant;
  product_id: string;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  countries: MedusaCountry[];
}

export interface MedusaCountry {
  id: string;
  iso_2: string;
  iso_3: string;
  name: string;
  display_name: string;
}

export interface MedusaDiscount {
  id: string;
  code: string;
}

export interface MedusaGiftCard {
  id: string;
  code: string;
  balance: number;
}

export interface MedusaPaymentSession {
  id: string;
  provider_id: string;
  status: string;
  data: Record<string, unknown>;
}

export interface MedusaShippingMethod {
  id: string;
  shipping_option_id: string;
  price: number;
}

export interface MedusaShippingOption {
  id: string;
  name: string;
  price_incl_tax: number;
  amount: number;
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  email: string;
  customer_id: string;
  billing_address: MedusaAddress;
  shipping_address: MedusaAddress;
  items: MedusaLineItem[];
  region: MedusaRegion;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  has_account: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedusaPaginatedResponse<T> {
  [key: string]: T[] | number | undefined;
  count?: number;
  offset?: number;
  limit?: number;
}
