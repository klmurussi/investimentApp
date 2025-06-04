"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = clientRoutes;
const zod_1 = require("zod");
const server_1 = require("../server"); // Importe o prisma do server.ts
const clientSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters long'),
    email: zod_1.z.string().email('Invalid email address'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});
async function clientRoutes(app) {
    // List all clients
    app.get('/', async (request, reply) => {
        const clients = await server_1.prisma.client.findMany();
        return reply.send(clients);
    });
    // Create a new client
    app.post('/', async (request, reply) => {
        try {
            const { name, email, status } = clientSchema.parse(request.body);
            const client = await server_1.prisma.client.create({
                data: { name, email, status },
            });
            return reply.status(201).send(client);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ message: error.errors });
            }
            return reply.status(500).send({ message: 'Internal server error', error });
        }
    });
    // Update a client
    app.put('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const { name, email, status } = clientSchema.partial().parse(request.body); // Allow partial updates
            const client = await server_1.prisma.client.update({
                where: { id },
                data: { name, email, status },
            });
            return reply.send(client);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ message: error.errors });
            }
            return reply.status(500).send({ message: 'Internal server error', error });
        }
    });
    // Delete a client (optional, but good for completeness)
    app.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await server_1.prisma.client.delete({
                where: { id },
            });
            return reply.status(204).send(); // No content
        }
        catch (error) {
            return reply.status(500).send({ message: 'Internal server error', error });
        }
    });
}
