import { Injectable, NotFoundException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaProduct } from '../../medusa/types';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductResponseDto, ProductsListResponseDto } from './dto/product-response.dto';

interface ProductsResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}

interface SingleProductResponse {
  product: MedusaProduct;
}

@Injectable()
export class ProductsService {
  constructor(private readonly medusaService: MedusaService) {}

  async getProducts(query: GetProductsDto): Promise<ProductsListResponseDto> {
    const response = await this.medusaService.storeRequest<ProductsResponse>('/products', {
      query: {
        offset: query.offset,
        limit: query.limit,
        q: query.search,
        collection_id: query.collectionId,
        category_id: query.categoryId,
      },
    });

    return {
      products: response.products.map(this.transformProduct),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getProduct(id: string): Promise<ProductResponseDto> {
    try {
      const response = await this.medusaService.storeRequest<SingleProductResponse>(
        `/products/${id}`,
      );
      return { product: this.transformProduct(response.product) };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getProductByHandle(handle: string): Promise<ProductResponseDto> {
    const response = await this.medusaService.storeRequest<ProductsResponse>('/products', {
      query: {
        handle,
        limit: 1,
      },
    });

    if (!response.products || response.products.length === 0) {
      throw new NotFoundException(`Product with handle ${handle} not found`);
    }

    return { product: this.transformProduct(response.products[0]) };
  }

  private transformProduct(product: MedusaProduct) {
    return {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.handle,
      thumbnail: product.thumbnail,
      images: product.images?.map((img) => ({
        id: img.id,
        url: img.url,
      })) || [],
      options: product.options?.map((opt) => ({
        id: opt.id,
        title: opt.title,
        values: opt.values?.map((v) => v.value) || [],
      })) || [],
      variants: product.variants?.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        inventoryQuantity: variant.inventory_quantity,
        prices: variant.prices?.map((price) => ({
          currencyCode: price.currency_code,
          amount: price.amount,
        })) || [],
      })) || [],
      collection: product.collection
        ? {
            id: product.collection.id,
            title: product.collection.title,
            handle: product.collection.handle,
          }
        : null,
      categories: product.categories?.map((cat) => ({
        id: cat.id,
        name: cat.name,
        handle: cat.handle,
      })) || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }
}
