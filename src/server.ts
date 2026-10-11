import app from './app';

// Lê a porta das variáveis de ambiente ou usa 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
