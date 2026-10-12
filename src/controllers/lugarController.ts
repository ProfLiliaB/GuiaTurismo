import { Request, Response } from 'express';
import { LugarService } from '../services/lugarService';
import { AppError } from '../utils/AppError';

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

    if (isNaN(id)) {
      throw new AppError('ID do lugar inválido.', 400);
    }

    const { nome, descricao, categoriaId, latitude, longitude } = req.body;

    // Filtra apenas os campos que podem ser atualizados na tabela (evita erro 500 ao enviar id, galeria, categoria, etc.)
    const dadosAtualizar: {
      nome?: string;
      descricao?: string;
      categoriaId?: number;
      latitude?: number;
      longitude?: number;
    } = {};

    if (nome !== undefined) dadosAtualizar.nome = String(nome);
    if (descricao !== undefined) dadosAtualizar.descricao = String(descricao);
    if (categoriaId !== undefined && !isNaN(Number(categoriaId))) dadosAtualizar.categoriaId = Number(categoriaId);
    if (latitude !== undefined && !isNaN(Number(latitude))) dadosAtualizar.latitude = Number(latitude);
    if (longitude !== undefined && !isNaN(Number(longitude))) dadosAtualizar.longitude = Number(longitude);

    const lugar = await lugarService.atualizarLugar(id, dadosAtualizar);
    res.status(200).json({ status: 'success', data: lugar });
  }


  // Exclui um lugar
  async deletarLugar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resposta = await lugarService.deletarLugar(id);
    res.status(200).json({ status: 'success', data: resposta });
  }

  // --- CONTROLES DE GALERIA ---

  // Adiciona uma foto ao lugar (suporta upload de arquivo físico ou URL em JSON)
  async adicionarFoto(req: Request, res: Response) {
    const lugarId = Number(req.params.id);

    if (isNaN(lugarId)) {
      throw new AppError('ID do lugar inválido.', 400);
    }

    let urlFoto: string | undefined;

    // Se o usuário fez upload de um arquivo físico
    if (req.file) {
      // Define a URL base (usa APP_URL se configurada no .env ou descobre pelo host da requisição)
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      urlFoto = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (req.body?.urlFoto && typeof req.body.urlFoto === 'string' && req.body.urlFoto.trim() !== '') {
      // Caso o usuário prefira enviar um link direto da web
      urlFoto = req.body.urlFoto.trim();
    }

    if (!urlFoto) {
      throw new AppError('Envie um arquivo de imagem no campo "foto" ou uma "urlFoto" no corpo da requisição.', 400);
    }

    const foto = await lugarService.adicionarFoto(lugarId, urlFoto);
    res.status(201).json({ status: 'success', data: foto });
  }

  // Apaga a foto pelo ID (a rota pode ser algo como DELETE /galeria/:idFoto)
  async removerFoto(req: Request, res: Response) {
    const idFoto = Number(req.params.idFoto);

    if (isNaN(idFoto)) {
      throw new AppError('ID da foto inválido.', 400);
    }

    const resposta = await lugarService.removerFoto(idFoto);

    res.status(200).json({ status: 'success', data: resposta });
  }
}

