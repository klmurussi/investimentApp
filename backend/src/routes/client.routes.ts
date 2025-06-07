import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const createClientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  email: z.string().email('Email inválido.'), 
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export async function clientRoutes(fastify: FastifyInstance) {
  // GET /clients
  fastify.get('/clients', async (request:FastifyRequest, reply:FastifyReply) => {
    try {
      const { search } = request.query as { search?: string };
      const clients = await fastify.prisma.client.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search} },
              ],
            }
          : {},
        orderBy: { name: 'asc' },
      });
      return reply.send(clients);
    } catch (error) {
      console.error('Erro ao listar clientes (detalhes):', error);
      fastify.log.error('Erro ao listar clientes:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  })

  // POST /clients
  fastify.post('/clients', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, status } = createClientSchema.parse(request.body);
      const client = await fastify.prisma.client.create({
        data: { name, email, status: status || 'ACTIVE' },
      });
      return reply.status(201).send(client);
    } catch (error:any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Erro de validação', errors: error.errors });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return reply.status(409).send({ message: 'Email já cadastrado.' });
      }
      fastify.log.error('Erro ao criar cliente:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor.', error });
    }
  });

  // GET /clients/:id 
  fastify.get('/clients/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };

      const client = await fastify.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }

      return reply.send(client);
    } catch (error: any) { 
      fastify.log.error(`Erro ao obter cliente`, error); 
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}