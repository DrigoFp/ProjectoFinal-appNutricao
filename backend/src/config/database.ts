import pg from "pg"; // O pg é o driver oficial para ligar ao PostgreSQL em Node.js.
import dotenv from "dotenv"; // Carrega as variáveis do ficheiro .env para process.env dentro do node. Sem isto, o Node não saberia onde está a base de dados.

dotenv.config(); // Node le o ficheiro .env databaseURl ou outros.

const { Pool } = pg; // Pool é gestor de ligações, mantém várias ligações abertas e distribui queries por elas

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // DATABASE_URL vem do .env, contém o endereço completo da base de dados
}); // Pool usa essa URL para se ligar ao PostgreSQL
