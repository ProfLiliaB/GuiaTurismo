import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// Middleware global de tratamento de erros
export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Verifica se é um erro conhecido da aplicação (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Se não for um erro conhecido, exibe no console para debug e retorna erro 500
  console.error('Erro Interno no Servidor:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
