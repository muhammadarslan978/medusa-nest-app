import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  CollectionResponseDto,
  ListCollectionsQueryDto,
  UpdateCollectionProductsDto,
} from './dto/collection.dto';

interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface CollectionsListResponse {
  collections: MedusaCollection[];
  count: number;
  offset: number;
  limit: number;
}

interface SingleCollectionResponse {
  collection: MedusaCollection;
}

interface DeleteResponse {
  id: string;
  object: string;
  deleted: boolean;
}

@Injectable()
export class CollectionsService {
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
   * Transforms Medusa collection to response DTO
   */
  private transformCollection(collection: MedusaCollection): CollectionResponseDto {
    return {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      metadata: collection.metadata,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
    };
  }

  /**
   * List all product collections
   */
  async listCollections(
    query: ListCollectionsQueryDto,
    authHeader: string,
  ): Promise<{
    collections: CollectionResponseDto[];
    count: number;
    offset: number;
    limit: number;
  }> {
    this.validateAuth(authHeader);

    const queryParams: Record<string, string | number | boolean | undefined> = {
      offset: query.offset ?? 0,
      limit: query.limit ?? 10,
    };

    if (query.q) {
      queryParams.q = query.q;
    }

    const response = await this.medusaService.adminRequest<CollectionsListResponse>(
      '/collections',
      {
        ...this.createRequestOptions(authHeader),
        query: queryParams,
      },
    );

    return {
      collections: response.collections.map((col) => this.transformCollection(col)),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single collection by ID
   */
  async getCollection(id: string, authHeader: string): Promise<CollectionResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcol_')) {
      throw new BadRequestException('Invalid collection ID format');
    }

    try {
      const response = await this.medusaService.adminRequest<SingleCollectionResponse>(
        `/collections/${id}`,
        this.createRequestOptions(authHeader),
      );

      return this.transformCollection(response.collection);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Create a new product collection
   */
  async createCollection(
    dto: CreateCollectionDto,
    authHeader: string,
  ): Promise<CollectionResponseDto> {
    this.validateAuth(authHeader);

    if (!dto.title?.trim()) {
      throw new BadRequestException('Collection title is required');
    }

    const body: Record<string, unknown> = {
      title: dto.title.trim(),
    };

    if (dto.handle) {
      body.handle = dto.handle.toLowerCase().replace(/\s+/g, '-');
    }

    if (dto.metadata) {
      body.metadata = dto.metadata;
    }

    const response = await this.medusaService.adminRequest<SingleCollectionResponse>(
      '/collections',
      this.createRequestOptions(authHeader, 'POST', body),
    );

    return this.transformCollection(response.collection);
  }

  /**
   * Update an existing collection
   */
  async updateCollection(
    id: string,
    dto: UpdateCollectionDto,
    authHeader: string,
  ): Promise<CollectionResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcol_')) {
      throw new BadRequestException('Invalid collection ID format');
    }

    const body: Record<string, unknown> = {};

    if (dto.title !== undefined) {
      body.title = dto.title.trim();
    }

    if (dto.handle !== undefined) {
      body.handle = dto.handle.toLowerCase().replace(/\s+/g, '-');
    }

    if (dto.metadata !== undefined) {
      body.metadata = dto.metadata;
    }

    try {
      const response = await this.medusaService.adminRequest<SingleCollectionResponse>(
        `/collections/${id}`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformCollection(response.collection);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Delete a collection
   */
  async deleteCollection(
    id: string,
    authHeader: string,
  ): Promise<{ id: string; deleted: boolean }> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcol_')) {
      throw new BadRequestException('Invalid collection ID format');
    }

    try {
      const response = await this.medusaService.adminRequest<DeleteResponse>(
        `/collections/${id}`,
        this.createRequestOptions(authHeader, 'DELETE'),
      );

      return {
        id: response.id,
        deleted: response.deleted,
      };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Update products in a collection (add/remove)
   */
  async updateCollectionProducts(
    id: string,
    dto: UpdateCollectionProductsDto,
    authHeader: string,
  ): Promise<CollectionResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('pcol_')) {
      throw new BadRequestException('Invalid collection ID format');
    }

    const body: Record<string, unknown> = {};

    if (dto.add?.length) {
      body.add = dto.add;
    }

    if (dto.remove?.length) {
      body.remove = dto.remove;
    }

    try {
      const response = await this.medusaService.adminRequest<SingleCollectionResponse>(
        `/collections/${id}/products`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformCollection(response.collection);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw error;
    }
  }
}
