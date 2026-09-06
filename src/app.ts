import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middlewares/errorMiddleware';
// importa as rotas da aplicação
import { usuarioRoutes } from './routes/usuarioRoutes';
import { categoriaRoutes } from './routes/categoriaRoutes';
import { lugarRoutes } from './routes/lugarRoutes';
import { favoritoRoutes } from './routes/favoritoRoutes';
// importa o swagger-ui-express para servir a documentação da API
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

// Configurações de Segurança
app.use(helmet()); // Adiciona cabeçalhos HTTP para segurança
app.use(cors()); // Permite requisições de outras origens

// Limite de requisições para evitar ataques de Força Bruta e DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por `window`
  message: 'Requisições excessivas, tente novamente mais tarde.'
});
app.use(limiter);

// Permite que a API entenda requisições no formato JSON
app.use(express.json());

// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cadastro de Rotas
app.use(usuarioRoutes);
app.use(categoriaRoutes);
app.use(lugarRoutes);
app.use(favoritoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API Guia de Turismo rodando!' });
});

// Middleware de tratamento de erros
app.use(errorMiddleware);

export default app;
