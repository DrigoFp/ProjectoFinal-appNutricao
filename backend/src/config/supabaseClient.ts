// Ligação entre o backend e o supabase

import { createClient } from "@supabase/supabase-js"; //traz a função que permite criar a ligação ao Supabase.
import dotenv from "dotenv"; // carrega variaveis de ambiente

dotenv.config();

export const supabase = createClient( // cria o cliente supabase
  process.env.SUPABASE_URL!, // diz onde está a base de dados
  process.env.SUPABASE_KEY! //  é a chave de acesso anon key 
);
// o ! é para dizer ao TS que pode confiar porque existe 