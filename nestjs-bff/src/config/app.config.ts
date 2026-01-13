import { registerAs } from '@nestjs/config';

export interface AppConfigType {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  medusa: {
    backendUrl: string;
    publishableKey: string;
  };
  cors: {
    origins: string[];
  };
  logging: {
    level: string;
  };
}

export const appConfig = registerAs(
  'app',
  (): AppConfigType => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    medusa: {
      backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
      publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY || '',
    },
    cors: {
      origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    },
    logging: {
      level: process.env.LOG_LEVEL || 'debug',
    },
  }),
);
