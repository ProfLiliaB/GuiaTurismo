import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';

const usuarioService = new UsuarioService();

export class UsuarioController {
  // Lida com a requisição de criação de usuário
  async criar(req: Request, res: Response) {
    const { 
      nome, email, senha, 
      avatar, cidade, idade, profissao, 
      instagram, facebook, youtube, site, telefone 
    } = req.body;

    // A validação de erros assíncrono é tratada pelo pacote 'express-async-errors'
    const usuario = await usuarioService.criarUsuario({
      nome,
      email,
      senhaPlana: senha,
      avatar,
      cidade,
      idade: idade ? Number(idade) : undefined,
      profissao,
      instagram,
      facebook,
      youtube,
      site,
      telefone
    });

    res.status(201).json({
      status: 'success',
      data: usuario,
    });
  }

  // Lida com a requisição de login
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const authData = await usuarioService.login(email, senha);

    res.status(200).json({
      status: 'success',
      data: authData,
    });
  }

  // Lida com a requisição de listar usuários
  async listar(req: Request, res: Response) {
    const usuarios = await usuarioService.listarUsuarios();

    res.status(200).json({
      status: 'success',
      data: usuarios,
    });
  }
}
