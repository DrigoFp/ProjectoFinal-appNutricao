// Recebe pedidos do Front ou Postman, valida, insere nova entrada e devolve em json

import { Request, Response } from "express"; // tipos do Express
import { supabase } from "../config/supabaseClient.js"; // cliente criado no supabaseClient.ts

export const createFoodEntry = async (req: Request, res: Response) => { // recebe pedido HTTP, devolve resposta HTTP, assincrino porque faz chamadas a BD
  try {
    const { // extrai os dados em baxio do body
      user_id,
      food_id,
      grams,
      date,
      total_kcal,
      total_protein,
      total_carbs,
      total_fat,
      total_fiber,
    } = req.body;

    const { data, error } = await supabase 
      .from("food_entries") // insere na tabela food_entries
      .insert([ // Insere um novo registo com os dados recebidos
        {
          user_id,
          food_id,
          grams,
          date,
          total_kcal,
          total_protein,
          total_carbs,
          total_fat,
          total_fiber,
        },
      ])
      .select(); // diz ao supabase depois de inserires, devolve-me o registo criado.

    if (error) throw error;

    return res.status(201).json(data[0]); // devolve a resposta
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({ error: "Erro ao processar pedido" });
  }
};
