import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { UPLOADS_FOLDER } from './middlewares/uploadMiddleware';
// importa as rotas da aplicação
import { usuarioRoutes } from './routes/usuarioRoutes';
import { categoriaRoutes } from './routes/categoriaRoutes';
import { lugarRoutes } from './routes/lugarRoutes';
import { favoritoRoutes } from './routes/favoritoRoutes';
// importa o swagger-ui-express para servir a documentação da API
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

// Habilita o trust proxy para que o Express e o express-rate-limit reconheçam o IP real do cliente atrás do proxy reverso da Hostinger
app.set('trust proxy', 1);

// Configurações de Segurança
// crossOriginResourcePolicy: permite que clientes de origens diferentes (como o app mobile) acessem as fotos estáticas
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors()); // Permite requisições de outras origens

// Limite de requisições para evitar ataques de Força Bruta e DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por `window`
  message: 'Requisições excessivas, tente novamente mais tarde.'
});
app.use(limiter);

// Permite que a API entenda requisições no formato JSON e Form Urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos de upload publicamente
app.use('/uploads', express.static(UPLOADS_FOLDER));

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
