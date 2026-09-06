import prisma from '../prisma';
import { AppError } from '../utils/AppError';

export class CategoriaService {
  async criar(nome: string, descricao?: string) {
    const categoriaExiste = await prisma.categoria.findUnique({
      where: { nome },
    });

    if (categoriaExiste) {
      throw new AppError('Já existe uma categoria com este nome.', 400);
    }

    const categoria = await prisma.categoria.create({
      data: {
        nome,
        descricao,
      },
    });

    return categoria;
  }

  async listar() {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc', // Retorna em ordem alfabética
      },
    });
    return categorias;
  }

  async atualizar(id: number, nome: string, descricao?: string) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: {
        nome,
        descricao,
      },
    });

    return categoriaAtualizada;
  }

  async deletar(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    await prisma.categoria.delete({
      where: { id },
    });

    return { message: 'Categoria deletada com sucesso.' };
  }
}
