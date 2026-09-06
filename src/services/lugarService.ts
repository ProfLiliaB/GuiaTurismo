import prisma from '../prisma';
import { AppError } from '../utils/AppError';

export class LugarService {
  // Cria um novo lugar turístico associado a uma categoria
  async criarLugar(nome: string, descricao: string, categoriaId: number, latitude?: number, longitude?: number) {
    // Verifica se a categoria existe antes de tentar associar
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw new AppError('A categoria informada não existe.', 404);
    }

    const lugar = await prisma.lugar.create({
      data: {
        nome,
        descricao,
        categoriaId,
        latitude,
        longitude,
      },
    });

    return lugar;
  }

  // Lista os lugares com paginação e traz a galeria e a categoria juntas (Relacionamentos)
  async listarLugares(pagina = 1, limite = 10) {
    const pular = (pagina - 1) * limite;

    const lugares = await prisma.lugar.findMany({
      skip: pular,
      take: limite,
      include: {
        categoria: {
          select: { nome: true },
        },
        galeria: true,
      },
      orderBy: {
        criadoEm: 'desc', // Traz os mais recentes primeiro
      },
    });

    return lugares;
  }

  // Busca detalhes de um único lugar pelo ID
  async buscarLugarPorId(id: number) {
    const lugar = await prisma.lugar.findUnique({
      where: { id },
      include: {
        categoria: true,
        galeria: true,
      },
    });

    if (!lugar) {
      throw new AppError('Lugar não encontrado.', 404);
    }

    return lugar;
  }

  // Atualiza as informações básicas de um lugar
  async atualizarLugar(id: number, dados: { nome?: string; descricao?: string; categoriaId?: number; latitude?: number; longitude?: number }) {
    const lugarExiste = await prisma.lugar.findUnique({ where: { id } });

    if (!lugarExiste) {
      throw new AppError('Lugar não encontrado.', 404);
    }

    if (dados.categoriaId) {
      const categoria = await prisma.categoria.findUnique({ where: { id: dados.categoriaId } });
      if (!categoria) throw new AppError('A categoria informada não existe.', 404);
    }

    const lugar = await prisma.lugar.update({
      where: { id },
      data: dados,
    });

    return lugar;
  }

  // Deleta um lugar. Pela configuração 'onDelete: Cascade', as fotos da galeria também serão apagadas no banco.
  async deletarLugar(id: number) {
    const lugarExiste = await prisma.lugar.findUnique({ where: { id } });

    if (!lugarExiste) {
      throw new AppError('Lugar não encontrado.', 404);
    }

    await prisma.lugar.delete({
      where: { id },
    });

    return { mensagem: 'Lugar deletado com sucesso.' };
  }

  // --- MÉTODOS DA GALERIA ---

  // Adiciona uma nova foto à galeria de um lugar
  async adicionarFoto(lugarId: number, urlFoto: string) {
    const lugarExiste = await prisma.lugar.findUnique({ where: { id: lugarId } });

    if (!lugarExiste) {
      throw new AppError('Lugar não encontrado para adicionar foto.', 404);
    }

    const foto = await prisma.galeria.create({
      data: {
        urlFoto,
        lugarId,
      },
    });

    return foto;
  }

  // Remove uma foto específica da galeria
  async removerFoto(idFoto: number) {
    const foto = await prisma.galeria.findUnique({ where: { id: idFoto } });

    if (!foto) {
      throw new AppError('Foto não encontrada na galeria.', 404);
    }

    await prisma.galeria.delete({
      where: { id: idFoto },
    });

    return { mensagem: 'Foto removida da galeria.' };
  }
}
