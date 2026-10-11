import { Router } from 'express';
import { LugarController } from '../controllers/lugarController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadFoto } from '../middlewares/uploadMiddleware';

const lugarRoutes = Router();
const lugarController = new LugarController();

// Rotas públicas (abertas para o aplicativo listar os destinos livremente)
lugarRoutes.get('/lugares', lugarController.listarLugares);
lugarRoutes.get('/lugares/:id', lugarController.buscarLugar);

// Rotas de criação e edição de Lugar (exigem Token)
lugarRoutes.post('/lugares', authMiddleware, lugarController.criarLugar);
lugarRoutes.put('/lugares/:id', authMiddleware, lugarController.atualizarLugar);
lugarRoutes.delete('/lugares/:id', authMiddleware, lugarController.deletarLugar);

// Rotas de Galeria associadas ao lugar (exigem Token e suportam upload de arquivo 'foto' ou envio de 'urlFoto')
lugarRoutes.post('/lugares/:id/galeria', authMiddleware, uploadFoto.single('foto'), lugarController.adicionarFoto);
lugarRoutes.delete('/galeria/:idFoto', authMiddleware, lugarController.removerFoto);

export { lugarRoutes };
