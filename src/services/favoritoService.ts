import prisma from '../prisma';
import { AppError } from '../utils/AppError';

export class FavoritoService {
  // Adiciona um lugar aos favoritos do usuário
  async favoritarLugar(usuarioId: number, lugarId: number) {
    // Verifica se o lugar existe
    const lugarExiste = await prisma.lugar.findUnique({ where: { id: lugarId } });
    if (!lugarExiste) {
      throw new AppError('O lugar informado não existe.', 404);
    }

    // Verifica se o usuário já favoritou este lugar (para não duplicar)
    const favoritoExiste = await prisma.favorito.findUnique({
      where: {
        usuarioId_lugarId: {
          usuarioId,
          lugarId,
        },
      },
    });

    if (favoritoExiste) {
      throw new AppError('Este lugar já está favoritado.', 400);
    }

    // Cria a relação de favorito no banco
    const favorito = await prisma.favorito.create({
      data: {
        usuarioId,
        lugarId,
      },
    });

    return favorito;
  }

  // Remove um lugar dos favoritos do usuário
  async desfavoritarLugar(usuarioId: number, lugarId: number) {
    const favoritoExiste = await prisma.favorito.findUnique({
      where: {
        usuarioId_lugarId: {
          usuarioId,
          lugarId,
        },
      },
    });

    if (!favoritoExiste) {
      throw new AppError('Este lugar não consta na lista de favoritos.', 404);
    }

    // Remove a relação usando o identificador único composto
    await prisma.favorito.delete({
      where: {
        usuarioId_lugarId: {
          usuarioId,
          lugarId,
        },
      },
    });

    return { mensagem: 'Lugar removido dos favoritos.' };
  }

  // Lista todos os lugares favoritos de um usuário específico
  async listarFavoritosPorUsuario(usuarioId: number) {
    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId },
      include: {
        // Traz os dados do Lugar associado a este Favorito
        lugar: {
          include: {
            galeria: true,
            categoria: true,
          },
        },
      },
    });

    // Formata o retorno para enviar apenas a lista de lugares, limpando dados extras da tabela pivô
    return favoritos.map(fav => fav.lugar);
  }
}
