import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MedusaRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}

interface MedusaErrorResponse {
  message?: string;
  type?: string;
}

@Injectable()
export class MedusaService {
  private readonly logger = new Logger(MedusaService.name);
  private readonly baseUrl: string;
  private readonly publishableKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('MEDUSA_BACKEND_URL', 'http://localhost:9000');
    this.publishableKey = this.configService.get<string>('MEDUSA_PUBLISHABLE_KEY', '');
  }

  private buildQueryString(query?: Record<string, string | number | boolean | undefined>): string {
    if (!query) return '';

    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async request<T>(endpoint: string, options: MedusaRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, query } = options;

    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(query)}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.publishableKey) {
      requestHeaders['x-publishable-api-key'] = this.publishableKey;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    this.logger.debug(`Medusa API Request: ${method} ${url}`);

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as MedusaErrorResponse;
        const errorMessage = errorData.message || `Medusa API error: ${response.status}`;

        this.logger.error(`Medusa API Error: ${errorMessage}`);
        this.logger.error(`Full error response: ${JSON.stringify(errorData)}`);
        this.logger.error(`Request URL: ${url}`);
        this.logger.error(`Request body: ${JSON.stringify(body)}`);

        throw new HttpException(
          {
            message: errorMessage,
            statusCode: response.status,
            error: errorData.type || 'Medusa API Error',
          },
          response.status,
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Medusa API Request Failed: ${errorMessage}`);

      throw new HttpException(
        {
          message: 'Failed to connect to Medusa backend',
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async storeRequest<T>(endpoint: string, options: MedusaRequestOptions = {}): Promise<T> {
    return this.request<T>(`/store${endpoint}`, options);
  }

  async adminRequest<T>(endpoint: string, options: MedusaRequestOptions = {}): Promise<T> {
    return this.request<T>(`/admin${endpoint}`, options);
  }
}
