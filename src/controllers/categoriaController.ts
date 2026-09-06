import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoriaService';

const categoriaService = new CategoriaService();

export class CategoriaController {
  async criar(req: Request, res: Response) {
    const { nome, descricao } = req.body;

    const categoria = await categoriaService.criar(nome, descricao);

    res.status(201).json({
      status: 'success',
      data: categoria,
    });
  }

  async listar(req: Request, res: Response) {
    const categorias = await categoriaService.listar();

    res.status(200).json({
      status: 'success',
      data: categorias,
    });
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const categoria = await categoriaService.atualizar(Number(id), nome, descricao);

    res.status(200).json({
      status: 'success',
      data: categoria,
    });
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;

    const resposta = await categoriaService.deletar(Number(id));

    res.status(200).json({
      status: 'success',
      data: resposta,
    });
  }
}
