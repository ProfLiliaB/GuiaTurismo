import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import prisma from '../prisma';

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.usuarioId;

  if (!id) {
    throw new AppError('Não autorizado.', 401);
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id }
  });

  if (!usuario || !usuario.isAdmin) {
    throw new AppError('Acesso negado. Apenas administradores podem realizar esta ação.', 403);
  }

  next();
}
