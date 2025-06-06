// backend/src/server.ts
import Fastify from 'fastify';
import { clientRoutes } from './routes/client.routes';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const app = Fastify({ logger: true });

async function main() {
  try {
    app.register(clientRoutes, { prefix: '/clients' });

    app.get('/assets', async (request, reply) => {
      return reply.send([
        { name: 'Ação XYZ', value: 150.75 },
        { name: 'Fundo ABC', value: 2500.00 },
        { name: 'Tesouro Direto IPCA+', value: 1000.00 },
        { name: 'CDB Banco W', value: 500.00 },
      ]);
    });

    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://0.0.0.0:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  } finally {
    // Isso pode causar o erro 'PrismaClient is already disconnected' em dev,
    // mas é bom para um desligamento limpo em produção.
    // Em dev, o servidor é reiniciado pelo ts-node, então o disconnect é chamado repetidamente.
    // await prisma.$disconnect();
  }
}

main();