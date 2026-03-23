import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite acessos externos
app.use(express.json()); // Permite receber dados em formato JSON

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Nutrição Ativa! 🌱');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});