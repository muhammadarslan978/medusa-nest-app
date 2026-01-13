import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3001',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000',
      authCors:
        process.env.AUTH_CORS || 'http://localhost:3001,http://localhost:9000',
      jwtSecret:
        process.env.JWT_SECRET || 'supersecret-jwt-key-change-in-production',
      cookieSecret:
        process.env.COOKIE_SECRET ||
        'supersecret-cookie-key-change-in-production',
    },
  },
  admin: {
    disable: false,
    backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
  },
  modules: [
    {
      resolve: '@medusajs/medusa/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],
});
