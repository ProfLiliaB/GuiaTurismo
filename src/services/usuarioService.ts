import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export type DadosUsuario = {
  nome: string;
  email: string;
  senhaPlana: string;
  avatar?: string;
  cidade?: string;
  idade?: number;
  profissao?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  site?: string;
  telefone?: string;
};

export class UsuarioService {
  // Cria um novo usuário
  async criarUsuario(dados: DadosUsuario) {
    // Verifica se já existe um usuário com o mesmo email
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });

    if (usuarioExiste) {
      throw new AppError('Já existe um usuário com este email.', 400);
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashSenha = await bcrypt.hash(dados.senhaPlana, 10);

    // Salva o novo usuário no banco
    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: hashSenha,
        avatar: dados.avatar,
        cidade: dados.cidade,
        idade: dados.idade,
        profissao: dados.profissao,
        instagram: dados.instagram,
        facebook: dados.facebook,
        youtube: dados.youtube,
        site: dados.site,
        telefone: dados.telefone,
      },
    });

    // Retorna os dados principais por motivos de segurança
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  // Realiza o login do usuário e retorna um Token JWT
  async login(email: string, senhaPlana: string) {
    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new AppError('Email ou senha incorretos.', 401);
    }

    // Compara a senha enviada com a hash salva no banco
    const senhaValida = await bcrypt.compare(senhaPlana, usuario.senha);

    if (!senhaValida) {
      throw new AppError('Email ou senha incorretos.', 401);
    }

    // Gera um token JWT contendo o ID do usuário (válido por 1 dia)
    const secret = process.env.JWT_SECRET || 'chave_secreta_padrao';
    const token = jwt.sign({ id: usuario.id }, secret, { expiresIn: '1d' });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  // Lista todos os usuários (sem exibir a senha)
  async listarUsuarios() {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });
    return usuarios;
  }
}
