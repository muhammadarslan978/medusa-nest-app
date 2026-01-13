import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import { MedusaCustomer } from '../../medusa/types';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';

interface CustomerResponse {
  customer: MedusaCustomer;
}

interface AuthResponse {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly medusaService: MedusaService) {}

  async register(dto: RegisterCustomerDto) {
    const response = await this.medusaService.storeRequest<CustomerResponse>(
      '/customers',
      {
        method: 'POST',
        body: {
          email: dto.email,
          password: dto.password,
          first_name: dto.firstName,
          last_name: dto.lastName,
          phone: dto.phone,
        },
      },
    );

    return {
      customer: this.transformCustomer(response.customer),
      message: 'Registration successful',
    };
  }

  async login(dto: LoginCustomerDto) {
    const response = await this.medusaService.storeRequest<AuthResponse>(
      '/auth/customer/emailpass',
      {
        method: 'POST',
        body: {
          email: dto.email,
          password: dto.password,
        },
      },
    );

    return {
      token: response.token,
      message: 'Login successful',
    };
  }

  async getProfile(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const response = await this.medusaService.storeRequest<CustomerResponse>(
      '/customers/me',
      {
        headers: {
          Authorization: authHeader,
        },
      },
    );

    return {
      customer: this.transformCustomer(response.customer),
    };
  }

  async logout(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    await this.medusaService.storeRequest(
      '/auth/session',
      {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
        },
      },
    );

    return {
      message: 'Logout successful',
    };
  }

  private transformCustomer(customer: MedusaCustomer) {
    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      phone: customer.phone,
      hasAccount: customer.has_account,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    };
  }
}
