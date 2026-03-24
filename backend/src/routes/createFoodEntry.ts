import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js";

export const createFoodEntry = async (req: Request, res: Response) => {
  try {
    const { user_id, food_id, grams, date, total_kcal, total_protein, total_carbs, total_fat, total_fiber } = req.body;

    const { data, error } = await supabase
      .from('food_entries')
      .insert([{ user_id, food_id, grams, date, total_kcal, total_protein, total_carbs, total_fat, total_fiber }])
      .select();

    if (error) throw error;

    return res.status(201).json(data[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar entrada" });
  }
};