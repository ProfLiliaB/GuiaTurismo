import { Router } from 'express';
import { FavoritoController } from '../controllers/favoritoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const favoritoRoutes = Router();
const favoritoController = new FavoritoController();

// Rota para listar os favoritos do próprio usuário
favoritoRoutes.get('/favoritos', authMiddleware, favoritoController.listarFavoritosUsuario);

// Rota para favoritar um lugar específico
favoritoRoutes.post('/favoritos/:lugarId', authMiddleware, favoritoController.favoritar);

// Rota para remover um lugar dos favoritos
favoritoRoutes.delete('/favoritos/:lugarId', authMiddleware, favoritoController.desfavoritar);

export { favoritoRoutes };
