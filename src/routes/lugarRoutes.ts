import { Router } from 'express';
import { LugarController } from '../controllers/lugarController';
import { authMiddleware } from '../middlewares/authMiddleware';

const lugarRoutes = Router();
const lugarController = new LugarController();

// Rotas públicas (abertas para o aplicativo listar os destinos livremente)
lugarRoutes.get('/lugares', lugarController.listarLugares);
lugarRoutes.get('/lugares/:id', lugarController.buscarLugar);

// As rotas a partir daqui precisam de um Token JWT válido (Autenticação)
lugarRoutes.use(authMiddleware);

// Rotas de criação e edição de Lugar
lugarRoutes.post('/lugares', lugarController.criarLugar);
lugarRoutes.put('/lugares/:id', lugarController.atualizarLugar);
lugarRoutes.delete('/lugares/:id', lugarController.deletarLugar);

// Rotas de Galeria associadas ao lugar
lugarRoutes.post('/lugares/:id/galeria', lugarController.adicionarFoto);
lugarRoutes.delete('/galeria/:idFoto', lugarController.removerFoto);

export { lugarRoutes };
