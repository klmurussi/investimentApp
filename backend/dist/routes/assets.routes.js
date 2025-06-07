"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = assetRoutes;
const zod_1 = require("zod");
const listAllAssetsQuerySchema = zod_1.z.object({
    nameSearch: zod_1.z.string().optional(),
    clientNameSearch: zod_1.z.string().optional(),
    clientStatusFilter: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
    clientId: zod_1.z.string().uuid('ID do cliente inválido.').optional(),
});
// Schema para criar um Asset (POST /assets)
// ATENÇÃO: Campos 'assetName' e 'quantity' foram alterados para 'name' e 'value' para corresponder ao schema.prisma
const createAssetBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome do ativo deve ter no mínimo 3 caracteres.'), // ALTERADO: de assetName para name
    value: zod_1.z.number().positive('Valor deve ser um número positivo.'), // ALTERADO: de quantity para value
    clientID: zod_1.z.string().uuid('ID do cliente inválido.'),
});
async function assetRoutes(fastify) {
    // GET /assets
    fastify.get('/assets', async (request, reply) => {
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ message: 'Erro de validação na query', errors: error.errors });
            }
            fastify.log.error('Erro ao listar todos os ativos:', error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
    // GET /assets/:clientID
    fastify.get('/assets/:clientID', async (request, reply) => {
        try {
            const { clientID } = request.params;
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
        }
        catch (error) {
            fastify.log.error(`Erro ao listar ativos do cliente`, error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
    // POST /assets/:clientID
    fastify.post('/assets', async (request, reply) => {
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
