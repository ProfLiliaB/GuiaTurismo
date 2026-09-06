import prisma from '../src/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando o preenchimento (seed) do banco de dados...');

  // 1. Limpa os dados existentes para evitar duplicação em múltiplos testes
  await prisma.favorito.deleteMany();
  await prisma.galeria.deleteMany();
  await prisma.lugar.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Cria Usuários de Teste
  const senhaPadrao = await bcrypt.hash('senha123', 10);
  
  const usuarioTeste = await prisma.usuario.create({
    data: {
      nome: 'Lilia',
      email: 'lilia@teste.com',
      senha: senhaPadrao,
      cidade: 'Ubatuba / SP',
      idade: 28,
      profissao: 'Desenvolvedora',
      telefone: '12999999999'
    }
  });

  // 3. Cria Categorias
  const categoriaPraias = await prisma.categoria.create({
    data: { nome: 'Praias', descricao: 'Destinos no litoral com mar e areia' }
  });

  const categoriaHistorico = await prisma.categoria.create({
    data: { nome: 'Pontos Históricos', descricao: 'Locais com riqueza cultural, histórica ou ambiental' }
  });

  const categoriaIlhas = await prisma.categoria.create({
    data: { nome: 'Ilhas e Parques', descricao: 'Áreas verdes e ilhas para contato direto com a natureza' }
  });

  // 4. Cria Lugares (Ubatuba)
  const tamar = await prisma.lugar.create({
    data: {
      nome: 'Projeto Tamar - Ubatuba',
      descricao: 'Base do projeto focada na conservação das tartarugas marinhas e educação ambiental.',
      latitude: -23.4502,
      longitude: -45.0645,
      categoriaId: categoriaHistorico.id
    }
  });

  const praiaGrande = await prisma.lugar.create({
    data: {
      nome: 'Praia Grande',
      descricao: 'Uma das praias mais movimentadas e famosas de Ubatuba, excelente para surf.',
      latitude: -23.4699,
      longitude: -45.0617,
      categoriaId: categoriaPraias.id
    }
  });

  const ilhaAnchieta = await prisma.lugar.create({
    data: {
      nome: 'Parque Estadual da Ilha Anchieta',
      descricao: 'Ilha com praias paradisíacas, trilhas e muita história envolvendo um antigo presídio.',
      latitude: -23.5411,
      longitude: -45.0457,
      categoriaId: categoriaIlhas.id
    }
  });

  // 5. Cria Fotos na Galeria para os lugares
  await prisma.galeria.createMany({
    data: [
      { urlFoto: 'https://exemplo.com/tamar1.jpg', lugarId: tamar.id },
      { urlFoto: 'https://exemplo.com/tamar2.jpg', lugarId: tamar.id },
      { urlFoto: 'https://exemplo.com/praiagrande1.jpg', lugarId: praiaGrande.id },
      { urlFoto: 'https://exemplo.com/ilha1.jpg', lugarId: ilhaAnchieta.id }
    ]
  });

  // 6. Vincula Favoritos
  await prisma.favorito.create({
    data: {
      usuarioId: usuarioTeste.id,
      lugarId: praiaGrande.id
    }
  });

  console.log('Seed concluído com sucesso!');
  console.log('Email para Login: lilia@teste.com');
  console.log('Senha para Login: senha123');
  console.log('------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
