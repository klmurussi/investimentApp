"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_routes_1 = require("./routes/client.routes");
const assets_routes_1 = require("./routes/assets.routes");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const fastify = (0, fastify_1.default)({
    logger: true,
});
const PORT = 5000;
fastify.register(cors_1.default, {
    origin: '*', // Permitir todas as origens para desenvolvimento. MUDAR EM PRODUÇÃO!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});
fastify.decorate('prisma', exports.prisma);
fastify.get('/test-db-connection', async (request, reply) => {
    try {
        await fastify.prisma.$connect();
        await fastify.prisma.$disconnect();
        return reply.send({ status: 'OK', message: 'Conexão com o banco de dados bem-sucedida!' });
    }
    catch (e) {
        fastify.log.error('Falha na conexão com o banco de dados:', e.message || e, e.stack);
        return reply.status(500).send({ status: 'ERROR', message: 'Falha ao conectar com o banco de dados', error: e.message });
    }
});
fastify.register(client_routes_1.clientRoutes);
fastify.register(assets_routes_1.assetRoutes);
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
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
