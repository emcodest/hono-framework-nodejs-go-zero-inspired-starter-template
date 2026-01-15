import { Context, Next } from 'hono';

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);
    return c.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      500
    );
  }
}