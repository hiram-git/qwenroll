// Configuración del entorno para QwenRoll

export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/qwenroll',
  
  // API
  apiPort: parseInt(process.env.API_PORT || '3000', 10),
  apiHost: process.env.API_HOST || '0.0.0.0',
  
  // Auth
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type Config = typeof config;
