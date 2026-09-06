import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Rotas públicas (não exigem token de autenticação)
usuarioRoutes.post('/usuarios', usuarioController.criar);
usuarioRoutes.post('/login', usuarioController.login);

import { adminMiddleware } from '../middlewares/adminMiddleware';

// Rotas protegidas (exigem token)
usuarioRoutes.get('/usuarios/perfil', authMiddleware, usuarioController.perfil);
usuarioRoutes.put('/usuarios', authMiddleware, usuarioController.atualizar);
usuarioRoutes.delete('/usuarios', authMiddleware, usuarioController.deletar);

// Rotas de Admin
usuarioRoutes.get('/usuarios', authMiddleware, adminMiddleware, usuarioController.listar);

export { usuarioRoutes };
