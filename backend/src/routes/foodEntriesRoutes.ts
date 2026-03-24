import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";

const router = Router();

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

    if (foodError || !food) { // validação
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
});

export default router;
