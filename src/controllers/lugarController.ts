import { Request, Response } from 'express';
import { LugarService } from '../services/lugarService';

const lugarService = new LugarService();

export class LugarController {
  // Cria um registro de lugar
  async criarLugar(req: Request, res: Response) {
    const { nome, descricao, categoriaId, latitude, longitude } = req.body;

    const lugar = await lugarService.criarLugar(nome, descricao, Number(categoriaId), latitude, longitude);

    res.status(201).json({ status: 'success', data: lugar });
  }

  // Lista vários lugares, suportando query params para paginação (?pagina=1&limite=10)
  async listarLugares(req: Request, res: Response) {
    const pagina = req.query.pagina ? Number(req.query.pagina) : 1;
    const limite = req.query.limite ? Number(req.query.limite) : 10;

    const lugares = await lugarService.listarLugares(pagina, limite);

    res.status(200).json({ status: 'success', data: lugares });
  }

  // Traz detalhes de um único lugar pela URL (/:id)
  async buscarLugar(req: Request, res: Response) {
    const id = Number(req.params.id);

    const lugar = await lugarService.buscarLugarPorId(id);

    res.status(200).json({ status: 'success', data: lugar });
  }

  // Atualiza um lugar existente
  async atualizarLugar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const dados = req.body; // Pode conter nome, descricao, categoriaId, etc.

    // Converte categoriaId para número, caso seja enviado
    if (dados.categoriaId) {
      dados.categoriaId = Number(dados.categoriaId);
    }

    const lugar = await lugarService.atualizarLugar(id, dados);

    res.status(200).json({ status: 'success', data: lugar });
  }

  // Exclui um lugar
  async deletarLugar(req: Request, res: Response) {
    const id = Number(req.params.id);

    const resposta = await lugarService.deletarLugar(id);

    res.status(200).json({ status: 'success', data: resposta });
  }

  // --- CONTROLES DE GALERIA ---

  // Vincula uma URL de foto a um lugar existente
  async adicionarFoto(req: Request, res: Response) {
    const lugarId = Number(req.params.id);
    const { urlFoto } = req.body;

    const foto = await lugarService.adicionarFoto(lugarId, urlFoto);

    res.status(201).json({ status: 'success', data: foto });
  }

  // Apaga a foto pelo ID (a rota pode ser algo como DELETE /galeria/:idFoto)
  async removerFoto(req: Request, res: Response) {
    const idFoto = Number(req.params.idFoto);

    const resposta = await lugarService.removerFoto(idFoto);

    res.status(200).json({ status: 'success', data: resposta });
  }
}
