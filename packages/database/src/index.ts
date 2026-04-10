import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';
import { config } from '@qwenroll/config';

// Crear conexión para consultas
const client = postgres(config.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 5,
});

// Crear instancia de Drizzle ORM
export const db = drizzle(client, { schema });

// Exportar tipos y schemas
export * from './schema/index';
export type DbClient = typeof db;
