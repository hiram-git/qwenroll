import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => '📋 QwenRoll API - Sistema de Nómina Panamá')
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen(3000);

console.log(`🦊 API server running at http://${app.server?.hostname}:${app.server?.port}`);
