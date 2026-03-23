// Cria o servidor principal (a API) de backend, recebe pedidos do frontend, fala com o Supabase e devolve respostas em JSON
// Arranca o servidor
// Configura middlewares
// Lê o .env
// Liga rotas
// Escuta pedidos na porta 3000

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from "./routes/testRoutes.js"
import foodEntriesRoutes from "./routes/foodEntriesRoutes.js"


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

app.use(testRoutes); // api principal o servidor express, este usa conjunto de rotas (testRoutes) dentro da aplicação principal. Liga essas rotas ao servidor

app.use(foodEntriesRoutes); // é a API que é ligada ao servidor para ter a rota da entrada de comida

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});