// Ficheiro que define as rotas relacionadas com registos de alimentos consumidos.

import { Router } from "express"; // cria um mini-servidor dentro do Express do server.ts
import { supabase } from "../config/supabaseClient.js"; // Ligação à base de dados Supabase

const router = Router(); //  cria um mini-servidor

// Criar um registo de alimento consumido
router.post("/food-entries", async (req, res) => {
  try {
    const { user_id, food_id, grams } = req.body; // Receber dados do frontend

    // 1. Validar dados recebidos
    if (!user_id || !food_id || !grams) {
      return res.status(400).json({ error: "Faltam dados obrigatórios." });
    }

    // 2. Buscar alimento ao Supabase
    const { data: food, error: foodError } = await supabase
      .from("foods")
      .select("*")
      .eq("id", food_id)
      .single();

    if (foodError || !food) {
      // validação
      return res.status(404).json({ error: "Alimento não encontrado." });
    }

    // 3. Calcular valores nutricionais
    const factor = grams / 100;

    const total_kcal = Math.round(food.kcal_per_100g * factor);
    const total_protein = Math.round(food.protein_per_100g * factor);
    const total_carbs = Math.round(food.carbs_per_100g * factor);
    const total_fat = Math.round(food.fat_per_100g * factor);
    const total_fiber = Math.round(food.fiber_per_100g * factor);

    // 4. Inserir na tabela food_entries
    const { data: entry, error: entryError } = await supabase
      .from("food_entries")
      .insert([
        {
          user_id,
          food_id,
          grams,
          total_kcal,
          total_protein,
          total_carbs,
          total_fat,
          total_fiber,
        },
      ])
      .select()
      .single();

    if (entryError) {
      return res.status(500).json({ error: entryError.message });
    }

    // 5. Resposta final para o frontend
    res.status(201).json({
      message: "Entrada registada com sucesso!",
      entry,
    });
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({ error: "Erro ao processar pedido" });
  }

  // Obter todos os registos
  router.get("/food-entrie/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params; // Extrai o ID da URL

      const { data, error } = await supabase

        .from("food_entries")
        .select("*") // Seleciona todas as colunas
        .eq("user_id", userId); // Filtra apenas as linhas deste utilizador

      if (error) throw error;

      res.json(data); // Devolve a lista para o Angular
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });
});

export default router;
