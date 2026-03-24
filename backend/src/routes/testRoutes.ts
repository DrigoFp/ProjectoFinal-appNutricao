// Ficheiro onde defino as minhas rotas
// Caminhos
// Métodos
// Lógica de resposta/ função
// Uma extenção para encaixar no servidor
// Todas as rotas precisam de caminho, método e função

import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";

const router = Router();

router.get("/test-db", async (req, res) => {
  const { data, error } = await supabase.from("foods").select("*").limit(5);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Ligação ao Supabase OK!", foods: data });
});

export default router; // exporto as minhas rotas
