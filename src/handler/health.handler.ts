import { Context } from 'hono';
import type { ServiceContext } from '../svc/service-context';

export class HealthHandler {
  constructor(private svcCtx: ServiceContext) {}

  async check(c: Context) {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: this.svcCtx.config.env,
    });
  }
}