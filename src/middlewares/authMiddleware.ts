import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Estendendo o tipo Request do Express para podermos injetar o id do usuário nela
declare module 'express-serve-static-core' {
  interface Request {
    usuarioId?: number;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Pega o header de autorização (formato esperado: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não informado.', 401);
  }

  // Separa o "Bearer" do token em si
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    throw new AppError('Formato de token inválido.', 401);
  }

  const token = partes[1];
  const secret = process.env.JWT_SECRET || 'chave_secreta_padrao';

  try {
    // Verifica a validade do token
    const decoded = jwt.verify(token, secret) as { id: number };

    // Injeta o ID do usuário na requisição para que os controllers possam usar (ex: para saber quem está favoritando algo)
    req.usuarioId = decoded.id;

    // Passa para a próxima etapa (controller)
    return next();
  } catch (error) {
    throw new AppError('Token inválido.', 401);
  }
}
