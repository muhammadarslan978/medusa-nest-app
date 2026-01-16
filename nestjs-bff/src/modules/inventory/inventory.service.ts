import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import {
  SetInventoryLevelDto,
  UpdateInventoryLevelDto,
  UpdateInventoryItemDto,
  InventoryItemResponseDto,
  ListInventoryItemsQueryDto,
  LocationLevelDto,
} from './dto/inventory.dto';

interface MedusaLocationLevel {
  id: string;
  location_id: string;
  inventory_item_id: string;
  stocked_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  incoming_quantity: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MedusaInventoryItem {
  id: string;
  sku?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  origin_country?: string;
  hs_code?: string;
  mid_code?: string;
  material?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  requires_shipping: boolean;
  reserved_quantity: number;
  stocked_quantity: number;
  location_levels?: MedusaLocationLevel[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface InventoryItemsListResponse {
  inventory_items: MedusaInventoryItem[];
  count: number;
  offset: number;
  limit: number;
}

interface SingleInventoryItemResponse {
  inventory_item: MedusaInventoryItem;
}

@Injectable()
export class InventoryService {
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
   * Transforms location level to response DTO
   */
  private transformLocationLevel(level: MedusaLocationLevel): LocationLevelDto {
    return {
      id: level.id,
      location_id: level.location_id,
      stocked_quantity: level.stocked_quantity,
      reserved_quantity: level.reserved_quantity,
      available_quantity: level.available_quantity,
      incoming_quantity: level.incoming_quantity,
      metadata: level.metadata,
    };
  }

  /**
   * Transforms Medusa inventory item to response DTO
   */
  private transformInventoryItem(item: MedusaInventoryItem): InventoryItemResponseDto {
    return {
      id: item.id,
      sku: item.sku,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
      origin_country: item.origin_country,
      hs_code: item.hs_code,
      requires_shipping: item.requires_shipping,
      material: item.material,
      weight: item.weight,
      length: item.length,
      height: item.height,
      width: item.width,
      reserved_quantity: item.reserved_quantity,
      stocked_quantity: item.stocked_quantity,
      location_levels: item.location_levels?.map((l) => this.transformLocationLevel(l)) || [],
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  /**
   * List all inventory items
   */
  async listInventoryItems(
    query: ListInventoryItemsQueryDto,
    authHeader: string,
  ): Promise<{
    inventory_items: InventoryItemResponseDto[];
    count: number;
    offset: number;
    limit: number;
  }> {
    this.validateAuth(authHeader);

    const queryParams: Record<string, string | number | boolean | undefined> = {
      offset: query.offset ?? 0,
      limit: query.limit ?? 20,
    };

    if (query.sku) {
      queryParams.sku = query.sku;
    }

    if (query.location_id) {
      queryParams.location_id = query.location_id;
    }

    if (query.q) {
      queryParams.q = query.q;
    }

    const response = await this.medusaService.adminRequest<InventoryItemsListResponse>(
      '/inventory-items',
      {
        ...this.createRequestOptions(authHeader),
        query: queryParams,
      },
    );

    return {
      inventory_items: response.inventory_items.map((item) => this.transformInventoryItem(item)),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single inventory item by ID
   */
  async getInventoryItem(id: string, authHeader: string): Promise<InventoryItemResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('iitem_')) {
      throw new BadRequestException('Invalid inventory item ID format');
    }

    try {
      const response = await this.medusaService.adminRequest<SingleInventoryItemResponse>(
        `/inventory-items/${id}`,
        this.createRequestOptions(authHeader),
      );

      return this.transformInventoryItem(response.inventory_item);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Inventory item with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Update an inventory item
   */
  async updateInventoryItem(
    id: string,
    dto: UpdateInventoryItemDto,
    authHeader: string,
  ): Promise<InventoryItemResponseDto> {
    this.validateAuth(authHeader);

    if (!id || !id.startsWith('iitem_')) {
      throw new BadRequestException('Invalid inventory item ID format');
    }

    const body: Record<string, unknown> = {};

    if (dto.sku !== undefined) body.sku = dto.sku;
    if (dto.title !== undefined) body.title = dto.title;
    if (dto.description !== undefined) body.description = dto.description;
    if (dto.thumbnail !== undefined) body.thumbnail = dto.thumbnail;
    if (dto.hs_code !== undefined) body.hs_code = dto.hs_code;
    if (dto.origin_country !== undefined) body.origin_country = dto.origin_country;
    if (dto.mid_code !== undefined) body.mid_code = dto.mid_code;
    if (dto.material !== undefined) body.material = dto.material;
    if (dto.weight !== undefined) body.weight = dto.weight;
    if (dto.length !== undefined) body.length = dto.length;
    if (dto.height !== undefined) body.height = dto.height;
    if (dto.width !== undefined) body.width = dto.width;
    if (dto.requires_shipping !== undefined) body.requires_shipping = dto.requires_shipping;

    try {
      const response = await this.medusaService.adminRequest<SingleInventoryItemResponse>(
        `/inventory-items/${id}`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformInventoryItem(response.inventory_item);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Inventory item with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Add inventory level at a stock location
   */
  async addLocationLevel(
    inventoryItemId: string,
    dto: SetInventoryLevelDto,
    authHeader: string,
  ): Promise<InventoryItemResponseDto> {
    this.validateAuth(authHeader);

    if (!inventoryItemId || !inventoryItemId.startsWith('iitem_')) {
      throw new BadRequestException('Invalid inventory item ID format');
    }

    if (!dto.location_id || !dto.location_id.startsWith('sloc_')) {
      throw new BadRequestException('Invalid stock location ID format');
    }

    const body: Record<string, unknown> = {
      location_id: dto.location_id,
      stocked_quantity: dto.stocked_quantity,
    };

    if (dto.incoming_quantity !== undefined) {
      body.incoming_quantity = dto.incoming_quantity;
    }

    try {
      const response = await this.medusaService.adminRequest<SingleInventoryItemResponse>(
        `/inventory-items/${inventoryItemId}/location-levels`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformInventoryItem(response.inventory_item);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException(`Inventory item with ID ${inventoryItemId} not found`);
      }
      throw error;
    }
  }

  /**
   * Update inventory level at a stock location
   */
  async updateLocationLevel(
    inventoryItemId: string,
    locationId: string,
    dto: UpdateInventoryLevelDto,
    authHeader: string,
  ): Promise<InventoryItemResponseDto> {
    this.validateAuth(authHeader);

    if (!inventoryItemId || !inventoryItemId.startsWith('iitem_')) {
      throw new BadRequestException('Invalid inventory item ID format');
    }

    if (!locationId || !locationId.startsWith('sloc_')) {
      throw new BadRequestException('Invalid stock location ID format');
    }

    const body: Record<string, unknown> = {};

    if (dto.stocked_quantity !== undefined) {
      body.stocked_quantity = dto.stocked_quantity;
    }

    if (dto.incoming_quantity !== undefined) {
      body.incoming_quantity = dto.incoming_quantity;
    }

    try {
      const response = await this.medusaService.adminRequest<SingleInventoryItemResponse>(
        `/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
        this.createRequestOptions(authHeader, 'POST', body),
      );

      return this.transformInventoryItem(response.inventory_item);
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException('Inventory item or location level not found');
      }
      throw error;
    }
  }

  /**
   * Delete inventory level at a stock location
   */
  async deleteLocationLevel(
    inventoryItemId: string,
    locationId: string,
    authHeader: string,
  ): Promise<{ id: string; location_id: string; deleted: boolean }> {
    this.validateAuth(authHeader);

    if (!inventoryItemId || !inventoryItemId.startsWith('iitem_')) {
      throw new BadRequestException('Invalid inventory item ID format');
    }

    if (!locationId || !locationId.startsWith('sloc_')) {
      throw new BadRequestException('Invalid stock location ID format');
    }

    try {
      await this.medusaService.adminRequest(
        `/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
        this.createRequestOptions(authHeader, 'DELETE'),
      );

      return {
        id: inventoryItemId,
        location_id: locationId,
        deleted: true,
      };
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        throw new NotFoundException('Inventory item or location level not found');
      }
      throw error;
    }
  }

  /**
   * Get inventory levels for a specific stock location
   */
  async getInventoryByLocation(
    locationId: string,
    authHeader: string,
  ): Promise<{
    inventory_items: InventoryItemResponseDto[];
    count: number;
  }> {
    this.validateAuth(authHeader);

    if (!locationId || !locationId.startsWith('sloc_')) {
      throw new BadRequestException('Invalid stock location ID format');
    }

    const response = await this.medusaService.adminRequest<InventoryItemsListResponse>(
      '/inventory-items',
      {
        ...this.createRequestOptions(authHeader),
        query: {
          location_id: locationId,
          limit: 100,
        },
      },
    );

    return {
      inventory_items: response.inventory_items.map((item) => this.transformInventoryItem(item)),
      count: response.count,
    };
  }
}
