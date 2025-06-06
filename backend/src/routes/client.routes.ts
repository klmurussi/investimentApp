// backend/src/routes/client.routes.ts
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../server'; // Importe o prisma do server.ts

const clientSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'), // Usa a validação padrão de email do Zod
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

// Não é necessário exportar ClientInput, mas pode ser útil
// type ClientInput = z.infer<typeof clientSchema>;

export async function clientRoutes(app: FastifyInstance) {
  // List all clients
  app.get('/', async (request, reply) => {
    const clients = await prisma.client.findMany();
    return reply.send(clients);
  });

  // Create a new client
  app.post('/', async (request, reply) => {
    try {
      const { name, email, status } = clientSchema.parse(request.body);
      const client = await prisma.client.create({
        data: { name, email, status },
      });
      return reply.status(201).send(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: error.errors });
      }
      return reply.status(500).send({ message: 'Internal server error', error });
    }
  });

  // Update a client
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const { name, email, status } = clientSchema.partial().parse(request.body); // Permite atualizações parciais
      const client = await prisma.client.update({
        where: { id },
        data: { name, email, status },
      });
      return reply.send(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: error.errors });
      }
      return reply.status(500).send({ message: 'Internal server error', error });
    }
  });

  // Delete a client
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.client.delete({
        where: { id },
      });
      return reply.status(204).send(); // No content
    } catch (error) {
      // Handle cases where client not found, etc.
      return reply.status(500).send({ message: 'Internal server error', error });
    }
  });
}