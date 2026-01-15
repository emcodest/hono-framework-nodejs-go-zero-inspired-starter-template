import { Context } from 'hono';
import { UserLogic } from '../logic/user.logic';
import type { ServiceContext } from '../svc/service-context';
import type { CreateUserRequest } from '../types';

export class UserHandler {
  private logic: UserLogic;

  constructor(svcCtx: ServiceContext) {
    this.logic = new UserLogic(svcCtx);
  }

  async create(c: Context) {
    try {
      const body = await c.req.json<CreateUserRequest>();
      const result = await this.logic.createUser(body);
      
      return c.json(result, result.success ? 201 : 400);
    } catch (error) {
      return c.json({ success: false, error: 'Invalid request body' }, 400);
    }
  }

  async get(c: Context) {
    const id = c.req.param('id');
    const result = await this.logic.getUser(id);
    
    return c.json(result, result.success ? 200 : 404);
  }

  async list(c: Context) {
    const result = await this.logic.listUsers();
    return c.json(result);
  }

  async delete(c: Context) {
    const id = c.req.param('id');
    const result = await this.logic.deleteUser(id);
    
    return c.json(result, result.success ? 200 : 404);
  }
}