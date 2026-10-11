import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/AppError';

// Diretório onde os arquivos serão salvos (pasta uploads na raiz do projeto)
export const UPLOADS_FOLDER = path.resolve(process.cwd(), 'uploads');

// Garante que a pasta uploads exista
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

// Configuração de armazenamento no disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // Extrai a extensão do arquivo original (ex: .jpg)
    const extensao = path.extname(file.originalname).toLowerCase();
    // Gera um nome único com timestamp e número aleatório
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;
    cb(null, nomeUnico);
  },
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (extensoesPermitidas.includes(ext) && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Apenas imagens (JPG, JPEG, PNG, WEBP) são permitidas.', 400));
  }
};

// Middleware do Multer configurado
export const uploadFoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5 MB por foto
  },
});
