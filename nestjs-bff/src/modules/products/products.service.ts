import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaProduct } from '../../medusa/types';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductResponseDto, ProductsListResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';

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

  async getAdminProducts(
    query: GetProductsDto,
    authHeader: string,
  ): Promise<ProductsListResponseDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }

    const response = await this.medusaService.adminRequest<ProductsResponse>('/products', {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      query: {
        offset: query.offset ?? 0,
        limit: query.limit ?? 20,
        q: query.search,
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

  async createProduct(dto: CreateProductDto, authHeader: string): Promise<ProductResponseDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }

    const response = await this.medusaService.adminRequest<SingleProductResponse>('/products', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: {
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        handle: dto.handle,
        is_giftcard: dto.is_giftcard,
        status: dto.status,
        thumbnail: dto.thumbnail,
        images: dto.images?.map((url) => ({ url })),
        collection_id: dto.collection_id,
        categories: dto.categories?.map((id) => ({ id })),
        options: dto.options?.map((opt) => ({
          title: opt.title,
          values: opt.values,
        })),
        variants: dto.variants?.map((variant) => ({
          title: variant.title,
          sku: variant.sku,
          inventory_quantity: variant.inventory_quantity,
          allow_backorder: variant.allow_backorder,
          manage_inventory: variant.manage_inventory,
          prices: variant.prices,
          options: variant.options,
        })),
        metadata: dto.metadata,
      },
    });

    return { product: this.transformProduct(response.product) };
  }

  async updateProduct(
    id: string,
    dto: Partial<CreateProductDto>,
    authHeader: string,
  ): Promise<ProductResponseDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }

    const response = await this.medusaService.adminRequest<SingleProductResponse>(
      `/products/${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: {
          title: dto.title,
          subtitle: dto.subtitle,
          description: dto.description,
          handle: dto.handle,
          status: dto.status,
          thumbnail: dto.thumbnail,
          images: dto.images?.map((url) => ({ url })),
          collection_id: dto.collection_id,
          metadata: dto.metadata,
        },
      },
    );

    return { product: this.transformProduct(response.product) };
  }

  async deleteProduct(id: string, authHeader: string): Promise<{ id: string; deleted: boolean }> {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }

    await this.medusaService.adminRequest(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
      },
    });

    return { id, deleted: true };
  }

  async updateProductCategories(
    id: string,
    categoryIds: string[],
    authHeader: string,
  ): Promise<ProductResponseDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }

    const response = await this.medusaService.adminRequest<SingleProductResponse>(
      `/products/${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: {
          categories: categoryIds.map((catId) => ({ id: catId })),
        },
      },
    );

    return { product: this.transformProduct(response.product) };
  }

  async getProductsByCategory(
    categoryId: string,
    query: GetProductsDto,
  ): Promise<ProductsListResponseDto> {
    const response = await this.medusaService.storeRequest<ProductsResponse>('/products', {
      query: {
        offset: query.offset,
        limit: query.limit,
        category_id: categoryId,
      },
    });

    return {
      products: response.products.map(this.transformProduct),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  async getProductsByCollection(
    collectionId: string,
    query: GetProductsDto,
  ): Promise<ProductsListResponseDto> {
    const response = await this.medusaService.storeRequest<ProductsResponse>('/products', {
      query: {
        offset: query.offset,
        limit: query.limit,
        collection_id: collectionId,
      },
    });

    return {
      products: response.products.map(this.transformProduct),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  private transformProduct(product: MedusaProduct) {
    return {
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.handle,
      thumbnail: product.thumbnail,
      images:
        product.images?.map((img) => ({
          id: img.id,
          url: img.url,
        })) || [],
      options:
        product.options?.map((opt) => ({
          id: opt.id,
          title: opt.title,
          values: opt.values?.map((v) => v.value) || [],
        })) || [],
      variants:
        product.variants?.map((variant) => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          inventoryQuantity: variant.inventory_quantity,
          prices:
            variant.prices?.map((price) => ({
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
      categories:
        product.categories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          handle: cat.handle,
        })) || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }
}
