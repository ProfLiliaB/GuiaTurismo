import { Router } from 'express';
import { CategoriaController } from '../controllers/categoriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

// Rotas públicas
categoriaRoutes.get('/categorias', categoriaController.listar);

// Rotas protegidas (apenas usuários logados podem gerenciar categorias)
// Aplica o middleware (passa pela verificação de login) em todas as rotas abaixo
categoriaRoutes.use('/categorias', authMiddleware); 
categoriaRoutes.post('/categorias', categoriaController.criar);
categoriaRoutes.put('/categorias/:id', categoriaController.atualizar);
categoriaRoutes.delete('/categorias/:id', categoriaController.deletar);

export { categoriaRoutes };
