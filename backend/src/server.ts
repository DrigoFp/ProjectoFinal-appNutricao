// Cria o servidor principal (a API) de backend, recebe pedidos do frontend, fala com o Supabase e devolve respostas em JSON
// Arranca o servidor
// Configura middlewares
// Lê o .env
// Liga rotas
// Escuta pedidos na porta 3000

import express from 'express'; // cria o servidor e as rotas
import cors from 'cors'; // ligação front back
import dotenv from 'dotenv'; // le as variaveis de ambiente
import testRoutes from "./routes/testRoutes.js";
import foodEntriesRoutes from "./routes/foodEntriesRoutes.js";
import { getDailyEntries } from './routes/getDailyEntries.js';
import { createFoodEntry } from './routes/createFoodEntry.js';


// Carrega as variáveis do ficheiro .env
dotenv.config();

const app = express(); // cria aplicação express
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite acessos externos, qualquer site ou aplicação pode tentar fazer pedidos ao servidor.
app.use(express.json()); // Permite receber dados em formato JSON

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Nutrição Ativa! 🌱');
});

// ligar rotas
app.use(testRoutes); // api principal o servidor express, este usa conjunto de rotas (testRoutes) dentro da aplicação principal. Liga essas rotas ao servidor

app.use("/food-entries", foodEntriesRoutes); // é a API que é ligada ao servidor para ter a rota da entrada de comida

app.get("/food-entries/today/:userId", getDailyEntries); // API rota GET, tem parâmetro dinâmico da URL e função

app.post("/food-entries", createFoodEntry); // rota para criar uma entrada de alimento


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});