import { Hono } from 'hono';
import { UserHandler } from '../handler/user.handler';
import { HealthHandler } from '../handler/health.handler';
import { IndexHandler } from '../handler/index.handler';
import type { ServiceContext } from '../svc/service-context';

export function registerRoutes(app: Hono, svcCtx: ServiceContext) {
  const userHandler = new UserHandler(svcCtx);
  const healthHandler = new HealthHandler(svcCtx);
  const indexHandler = new IndexHandler(svcCtx);

  // Index Page
  app.get('/', (c) => indexHandler.get(c));
  // Health check
  app.get('/health', (c) => healthHandler.check(c));

  // User routes
  app.post('/api/users', (c) => userHandler.create(c));
  app.get('/api/users', (c) => userHandler.list(c));
  app.get('/api/users/:id', (c) => userHandler.get(c));
  app.delete('/api/users/:id', (c) => userHandler.delete(c));
}
