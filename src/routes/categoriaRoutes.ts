import { Router } from 'express';
import { CategoriaController } from '../controllers/categoriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

// Rotas públicas
categoriaRoutes.get('/categorias', categoriaController.listar);

// Rotas protegidas (apenas usuários logados podem gerenciar categorias)
categoriaRoutes.post('/categorias', authMiddleware, categoriaController.criar);
categoriaRoutes.put('/categorias/:id', authMiddleware, categoriaController.atualizar);
categoriaRoutes.delete('/categorias/:id', authMiddleware, categoriaController.deletar);

export { categoriaRoutes };
