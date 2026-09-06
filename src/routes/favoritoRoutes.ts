import { Router } from 'express';
import { FavoritoController } from '../controllers/favoritoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const favoritoRoutes = Router();
const favoritoController = new FavoritoController();

// Todas as rotas de favoritos exigem que o usuário esteja logado
favoritoRoutes.use(authMiddleware);

// Rota para listar os favoritos do próprio usuário
favoritoRoutes.get('/favoritos', favoritoController.listarFavoritosUsuario);

// Rota para favoritar um lugar específico
favoritoRoutes.post('/favoritos/:lugarId', favoritoController.favoritar);

// Rota para remover um lugar dos favoritos
favoritoRoutes.delete('/favoritos/:lugarId', favoritoController.desfavoritar);

export { favoritoRoutes };
