import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Rotas públicas (não exigem token de autenticação)
usuarioRoutes.post('/usuarios', usuarioController.criar);
usuarioRoutes.post('/login', usuarioController.login);

// Rotas protegidas (exigem token)
usuarioRoutes.get('/usuarios', authMiddleware, usuarioController.listar);

export { usuarioRoutes };
