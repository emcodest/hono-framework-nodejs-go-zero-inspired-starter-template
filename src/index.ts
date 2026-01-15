import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { config } from './config/config';
import { ServiceContext } from './svc/service-context';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', errorHandler);

// Initialize service context
const svcCtx = new ServiceContext(config);

// Register routes
registerRoutes(app, svcCtx);

// Start server for Node.js
serve({
  fetch: app.fetch,
  port: config.port,
});

console.log(`Server running on http://localhost:${config.port}`);