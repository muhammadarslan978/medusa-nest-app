import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  ListCategoriesQueryDto,
} from './dto/category.dto';

interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  is_active: boolean;
  is_internal: boolean;
  rank: number;
  parent_category_id?: string;
  parent_category?: MedusaCategory;
  category_children?: MedusaCategory[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface CategoriesListResponse {
  product_categories: MedusaCategory[];
  count: number;
  offset: number;
  limit: number;
}

interface SingleCategoryResponse {
  product_category: MedusaCategory;
}

interface DeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly medusaService: MedusaService) {}

  /**
   * Validates the authorization header
   */
  private validateAuth(authHeader: string): void {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Valid Bearer token is required');
    }
  }

  /**
   * Creates request options for Medusa API calls
   */
  private createRequestOptions(
    authHeader: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    body?: Record<string, unknown>,
  ) {
    return {
      method,
      headers: { Authorization: authHeader },
      ...(body && { body }),
    };
  }

  /**
   * Transforms Medusa category to response DTO
   */
  private transformCategory(category: MedusaCategory): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      handle: category.handle,
      description: category.description,
      is_active: category.is_active,
      is_internal: category.is_internal,
      rank: category.rank,
      parent_category_id: category.parent_category_id,
      parent_category: category.parent_category
        ? {
            id: category.parent_category.id,
            name: category.parent_category.name,
            handle: category.parent_category.handle,
          }
        : undefined,
      category_children:
        category.category_children?.map((child) => ({
          id: child.id,
          name: child.name,
          handle: child.handle,
          is_active: child.is_active,
        })) || [],
      metadata: category.metadata,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  /**
   * List all product categories
   */
  async listCategories(
    query: ListCategoriesQueryDto,
    authHeader: string,
  ): Promise<{
    categories: CategoryResponseDto[];
    count: number;
    offset: number;
    limit: number;
  }> {
    this.validateAuth(authHeader);

    const queryParams: Record<string, string | number | boolean | undefined> = {
      offset: query.offset ?? 0,
      limit: query.limit ?? 50,
    };

    if (query.q) {
      queryParams.q = query.q;
    }

    if (query.parent_category_id) {
      queryParams.parent_category_id = query.parent_category_id;
    }

    if (query.include_descendants_tree) {
      queryParams.include_descendants_tree = true;
    }

    const response = await this.medusaService.adminRequest<CategoriesListResponse>(
      '/product-categories',
      {
        ...this.createRequestOptions(authHeader),
        query: queryParams,
      },
    );

    return {
      categories: response.product_categories.map((cat) => this.transformCategory(cat)),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string, authHeader: string): Promise<CategoryResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcat_')) {
      throw new BadRequestException('Invalid category ID format');
    }

    try {
      const response = await this.medusaService.adminRequest<SingleCategoryResponse>(
        `/product-categories/${id}`,
        this.createRequestOptions(authHeader),
      );

      return this.transformCategory(response.product_category);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Create a new product category
   */
  async createCategory(dto: CreateCategoryDto, authHeader: string): Promise<CategoryResponseDto> {
    this.validateAuth(authHeader);

    if (!dto.name?.trim()) {
      throw new BadRequestException('Category name is required');
    }

    const body: Record<string, unknown> = {
      name: dto.name.trim(),
      is_active: dto.is_active ?? true,
      is_internal: dto.is_internal ?? false,
    };

    if (dto.handle) {
      body.handle = dto.handle.toLowerCase().replace(/\s+/g, '-');
    }

    if (dto.description) {
      body.description = dto.description;
    }

    if (dto.parent_category_id) {
      body.parent_category_id = dto.parent_category_id;
    }

    if (dto.metadata) {
      body.metadata = dto.metadata;
    }

    const response = await this.medusaService.adminRequest<SingleCategoryResponse>(
      '/product-categories',
      this.createRequestOptions(authHeader, 'POST', body),
    );

    return this.transformCategory(response.product_category);
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
    authHeader: string,
  ): Promise<CategoryResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcat_')) {
      throw new BadRequestException('Invalid category ID format');
    }

    const body: Record<string, unknown> = {};

    if (dto.name !== undefined) {
      body.name = dto.name.trim();
    }

    if (dto.handle !== undefined) {
      body.handle = dto.handle.toLowerCase().replace(/\s+/g, '-');
    }

    if (dto.description !== undefined) {
      body.description = dto.description;
    }

    if (dto.is_active !== undefined) {
      body.is_active = dto.is_active;
    }

    if (dto.is_internal !== undefined) {
      body.is_internal = dto.is_internal;
    }

    if (dto.parent_category_id !== undefined) {
      body.parent_category_id = dto.parent_category_id;
    }

    if (dto.rank !== undefined) {
      body.rank = dto.rank;
    }

    if (dto.metadata !== undefined) {
      body.metadata = dto.metadata;
    }

    try {
      const response = await this.medusaService.adminRequest<SingleCategoryResponse>(
        `/product-categories/${id}`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformCategory(response.product_category);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string, authHeader: string): Promise<{ id: string; deleted: boolean }> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcat_')) {
      throw new BadRequestException('Invalid category ID format');
    }

    try {
      const response = await this.medusaService.adminRequest<DeleteResponse>(
        `/product-categories/${id}`,
        this.createRequestOptions(authHeader, 'DELETE'),
      );

      return {
        id: response.id,
        deleted: response.deleted,
      };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(authHeader: string): Promise<CategoryResponseDto[]> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<CategoriesListResponse>(
      '/product-categories',
      {
        ...this.createRequestOptions(authHeader),
        query: {
          parent_category_id: 'null',
          include_descendants_tree: true,
          limit: 100,
        },
      },
    );

    return response.product_categories.map((cat) => this.transformCategory(cat));
  }
}
