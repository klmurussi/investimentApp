import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient, Prisma } from '@prisma/client'; 
import { z } from 'zod';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const listAllAssetsQuerySchema = z.object({
  nameSearch: z.string().optional(), 
  clientNameSearch: z.string().optional(),
  clientStatusFilter: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  clientId: z.string().uuid('ID do cliente inválido.').optional(), 
});

const createAssetBodySchema = z.object({
  name: z.string().min(3, 'Nome do ativo deve ter no mínimo 3 caracteres.'),
  value: z.number().positive('Valor deve ser um número positivo.'), 
  clientID: z.string().uuid('ID do cliente inválido.'),
});


export async function assetRoutes(fastify: FastifyInstance) {

  // GET /assets
  fastify.get('/assets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {

      const assets = await fastify.prisma.asset.findMany({
        orderBy: { name: 'asc' },
      });
      
      const simplifiedAssets = assets.map((asset) => ({ 
        id: asset.id,
        name: asset.name, 
        value: asset.value, 
      }));

      return reply.send(simplifiedAssets);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Erro de validação na query', errors: error.errors });
      }
      fastify.log.error('Erro ao listar todos os ativos:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });

  // GET /assets/:clientID
  fastify.get('/assets/:clientID', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { clientID } = request.params as { clientID: string };

      const clientExists = await fastify.prisma.client.findUnique({
        where: { id: clientID },
        select: { id: true, name: true },
      });
      if (!clientExists) {
        return reply.status(404).send({ message: 'Cliente não encontrado para listar os ativos.' });
      }

      const assets = await fastify.prisma.asset.findMany({
        where: { clientID: clientID },
        orderBy: { name: 'asc' },
      });

      const simplifiedAssets = assets.map((asset) => ({ 
        id: asset.id,
        name: asset.name,
        value: asset.value, 
      }));

      return reply.send(simplifiedAssets);

      } catch (error: any) {
        fastify.log.error(`Erro ao listar ativos do cliente`, error);
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
      }
  });

  // POST /assets
  fastify.post('/assets', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, value, clientID } = createAssetBodySchema.parse(request.body); 

      // const clientExists = await fastify.prisma.client.findUnique({
      //   where: { id: clientID },
      //   select: { id: true },
      // });

      // if (!clientExists) {
      //   return reply.status(404).send({ message: 'Cliente não encontrado. ID do cliente inválido.' });
      // }

      const newAsset = await fastify.prisma.asset.create({
        data: {
          name, 
          value, 
          clientID, 
          // client: { connect: { id: clientID } },
        },
      });

      return reply.status(201).send(newAsset);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        fastify.log.error('Erro de validação ao criar ativo:', error.errors);
        return reply.status(400).send({ message: 'Erro de validação', errors: error.errors });
      }
      if (error.code === 'P2003') { // Foreign key constraint failed
        return reply.status(400).send({ message: 'ID do cliente inválido ou não existente.' });
      }
      fastify.log.error('Erro ao criar ativo:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}