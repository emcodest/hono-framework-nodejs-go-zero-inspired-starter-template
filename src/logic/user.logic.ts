import type { ServiceContext } from '../svc/service-context';
import type { CreateUserRequest, User, ApiResponse } from '../types';

export class UserLogic {
  constructor(private ctx: ServiceContext) {}

  async createUser(req: CreateUserRequest): Promise<ApiResponse<User>> {
    // Validation
    if (!req.email || !req.username) {
      return {
        success: false,
        error: 'Email and username are required',
      };
    }

    // Check if user exists
    const existing = await this.ctx.userModel.findByEmail(req.email);
    if (existing) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Business logic
    const user = await this.ctx.userModel.create({
      username: req.username,
      email: req.email,
    });

    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const user = await this.ctx.userModel.findById(id);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  async listUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.ctx.userModel.list();
    
    return {
      success: true,
      data: users,
    };
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    const deleted = await this.ctx.userModel.delete(id);
    
    if (!deleted) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
