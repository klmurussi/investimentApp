"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = clientRoutes;
const zod_1 = require("zod");
const createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
    email: zod_1.z.string().email('Email inválido.'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
const updateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.').optional(),
    email: zod_1.z.string().email('Email inválido.').optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).partial();
async function clientRoutes(fastify) {
    // GET /clients
    fastify.get('/clients', async (request, reply) => {
        try {
            const { search } = request.query;
            const clients = await fastify.prisma.client.findMany({
                where: search
                    ? {
                        OR: [
                            { name: { contains: search } },
                        ],
                    }
                    : {},
                orderBy: { name: 'asc' },
            });
            return reply.send(clients);
        }
        catch (error) {
            console.error('Erro ao listar clientes (detalhes):', error);
            fastify.log.error('Erro ao listar clientes:', error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
    // GET /clients/:id
    fastify.get('/clients/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const client = await fastify.prisma.client.findUnique({
                where: { id },
            });
            if (!client) {
                return reply.status(404).send({ message: 'Cliente não encontrado.' });
            }
            return reply.send(client);
        }
        catch (error) {
            fastify.log.error('Erro ao buscar cliente.', error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
    // POST /clients
    fastify.post('/clients', async (request, reply) => {
        try {
            const { name, email, status } = createClientSchema.parse(request.body);
            const client = await fastify.prisma.client.create({
                data: { name, email, status: status || 'ACTIVE' },
            });
            return reply.status(201).send(client);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ message: 'Erro de validação', errors: error.errors });
            }
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return reply.status(409).send({ message: 'Email já cadastrado.' });
            }
            fastify.log.error('Erro ao criar cliente:', error);
            return reply.status(500).send({ message: 'Erro interno do servidor.', error });
        }
    });
    // PUT /clients/:id
    fastify.put('/clients/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const updateData = updateClientSchema.parse(request.body);
            const client = await fastify.prisma.client.update({
                where: { id },
                data: updateData,
            });
            return reply.send(client);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ message: 'Erro de validação', errors: error.errors });
            }
            if (error.code === 'P2025') {
                return reply.status(404).send({ message: 'Cliente não encontrado para atualização.' });
            }
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return reply.status(409).send({ message: 'Email já cadastrado para outro cliente.' });
            }
            fastify.log.error(`Erro ao atualizar cliente ${id}:`, error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
    // DELETE /clients/:id
    fastify.delete('/clients/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await fastify.prisma.client.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            if (error.code === 'P2025') {
                return reply.status(404).send({ message: 'Cliente não encontrado para exclusão.' });
            }
            fastify.log.error(`Erro ao deletar cliente ${id}:`, error);
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
}
