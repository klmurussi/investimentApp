"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = assetRoutes;
const zod_1 = require("zod");
const createAssetSchema = zod_1.z.object({
    assetName: zod_1.z.string().min(3, 'Nome do ativo deve ter no mínimo 3 caracteres.'),
    quantity: zod_1.z.number().positive('Quantidade deve ser um número positivo.'),
    clientID: zod_1.z.string().uuid('ID do cliente inválido.'),
});
const searchAllocationsQuerySchema = zod_1.z.object({
    assetNameSearch: zod_1.z.string().optional(),
    clientNameSearch: zod_1.z.string().optional(),
    clientStatusFilter: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
async function assetRoutes(fastify) {
    // GET /assets 
    fastify.get('/assets', async (request, reply) => {
        try {
            const allocations = await fastify.prisma.allocation.findMany({
                include: {
                    client: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            const simplifiedAssets = allocations.map(alloc => ({
                assetName: alloc.assetName,
                value: alloc.quantity,
                clientName: alloc.client ? alloc.client.name : 'Cliente Desconhecido',
            }));
            return reply.send(simplifiedAssets);
        }
        catch (error) {
            fastify.log.error('Erro ao listar ativos:', error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
}
