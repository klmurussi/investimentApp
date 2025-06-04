"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const fastify_1 = __importDefault(require("fastify"));
const client_routes_1 = require("./routes/client.routes");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const app = (0, fastify_1.default)({ logger: true });
async function main() {
    try {
        app.register(client_routes_1.clientRoutes, { prefix: '/clients' });
        // Rota para ativos fixos
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
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
    finally {
        await exports.prisma.$disconnect();
    }
}
main();
