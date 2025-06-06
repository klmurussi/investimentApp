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

const createAssetBodySchema = z.object({
  name: z.string().min(3, 'Nome do ativo deve ter no mínimo 3 caracteres.'),
  value: z.number().positive('Quantidade deve ser um número positivo.'),
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

  // POST /clients/:id/assets 
  fastify.post('/clients/:id/assets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: clientID } = request.params as { id: string };
      const { name, value } = createAssetBodySchema.parse(request.body);

      const clientExists = await fastify.prisma.client.findUnique({
        where: { id: clientID },
        select: { id: true },
      });

      if (!clientExists) {
        return reply.status(404).send({ message: 'Cliente não encontrado para adicionar o ativo.' });
      }

      const newAsset = await fastify.prisma.asset.create({
        data: { name, value, clientID,
          include: {
            client: {
              select: { name: true },
            },
          } ,
        }
      });

      return reply.status(201).send(newAsset);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Erro de validação', errors: error.errors });
      }
      fastify.log.error(`Erro ao criar ativo para o cliente:`, error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });

  // GET /clients/:id/assets 
  fastify.get('/clients/:id/assets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: clientID } = request.params as { id: string };

      const clientExists = await fastify.prisma.client.findUnique({
        where: { id: clientID },
        select: { id: true },
      });
      if (!clientExists) {
        return reply.status(404).send({ message: 'Cliente não encontrado para listar os ativos.' });
      }

      const assets = await fastify.prisma.asset.findMany({
        where: { clientID: clientID },
        include: {
          client: { 
            select: { name: true },
          },
        },
        orderBy: { name: 'asc' }, 
      });

      const simplifiedAssets = assets.map(alloc => ({
        name: alloc.name,
        value: alloc.value,
        clientName: alloc.client ? alloc.client.name : 'Cliente Desconhecido',
        id: alloc.id,
      }));

      return reply.send(simplifiedAssets);
    } catch (error: any) {
      fastify.log.error(`Erro ao listar ativos do cliente`, error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}