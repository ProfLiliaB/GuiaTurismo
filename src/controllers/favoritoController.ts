import { Request, Response } from 'express';
import { FavoritoService } from '../services/favoritoService';
import { AppError } from '../utils/AppError';

const favoritoService = new FavoritoService();

export class FavoritoController {
  // Recebe a requisição para favoritar um lugar
  async favoritar(req: Request, res: Response) {
    const usuarioId = req.usuarioId; // Injetado pelo middleware de autenticação
    const lugarId = Number(req.params.lugarId);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado.', 401);
    }

    const favorito = await favoritoService.favoritarLugar(usuarioId, lugarId);

    res.status(201).json({ status: 'success', data: favorito });
  }

  // Recebe a requisição para desfavoritar um lugar
  async desfavoritar(req: Request, res: Response) {
    const usuarioId = req.usuarioId;
    const lugarId = Number(req.params.lugarId);

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado.', 401);
    }

    const resposta = await favoritoService.desfavoritarLugar(usuarioId, lugarId);

    res.status(200).json({ status: 'success', data: resposta });
  }

  // Recebe a requisição para listar os favoritos do usuário
  async listarFavoritosUsuario(req: Request, res: Response) {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      throw new AppError('Usuário não autenticado.', 401);
    }

    const favoritos = await favoritoService.listarFavoritosPorUsuario(usuarioId);

    res.status(200).json({ status: 'success', data: favoritos });
  }
}
