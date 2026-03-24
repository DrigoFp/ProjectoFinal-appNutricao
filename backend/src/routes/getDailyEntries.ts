// Rota de leitura GET
// Vais buscar todas as entradas alimentares do utilizador no dia de hoje
// Calcular os totais nutricionais do dia
// Devolver tudo num JSON organizado

import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js"; // Usa o cliente que já criaste

export const getDailyEntries = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    // Consulta ao Supabase seguindo os requisitos do projeto
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);

    if (error) throw error;

    const entries = data || [];

    // Cálculo dos totais (mantém a tua lógica do reduce)
    const totals = entries.reduce((acc, entry) => {
      acc.kcal += Number(entry.total_kcal || 0);
      acc.protein += Number(entry.total_protein || 0);
      acc.carbs += Number(entry.total_carbs || 0);
      acc.fat += Number(entry.total_fat || 0);
      acc.fiber += Number(entry.total_fiber || 0);
      return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    return res.json({ date: today, entries, totals });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro interno ao buscar entradas" });
  }
};