import { defineConfig } from 'drizzle-kit';
import { config } from '@qwenroll/config';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
  verbose: true,
  strict: true,
});
