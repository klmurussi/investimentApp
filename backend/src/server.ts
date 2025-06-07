import Fastify from 'fastify';
import cors from '@fastify/cors';
import { clientRoutes } from './routes/client.routes';
import { assetRoutes } from './routes/assets.routes';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const fastify = Fastify({
  logger: true, 
});

const PORT = 5000;

fastify.register(cors, {
  origin: '*', // Permitir todas as origens para desenvolvimento. MUDAR EM PRODUÇÃO!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

fastify.decorate('prisma', prisma);

fastify.get('/test-db-connection', async (request, reply) => {
  try {
    await fastify.prisma.$connect(); 
    await fastify.prisma.$disconnect(); 
    return reply.send({ status: 'OK', message: 'Conexão com o banco de dados bem-sucedida!' });
  } catch (e: any) {
    fastify.log.error('Falha na conexão com o banco de dados:', e.message || e, e.stack);
    return reply.status(500).send({ status: 'ERROR', message: 'Falha ao conectar com o banco de dados', error: e.message });
  }
});

fastify.register(clientRoutes);
fastify.register(assetRoutes);

fastify.addHook('onClose', async (instance) => {
  await instance.prisma.$disconnect();
});

fastify.get('/', async (request, reply) => {
  return { message: 'Backend está rodando com Fastify!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();