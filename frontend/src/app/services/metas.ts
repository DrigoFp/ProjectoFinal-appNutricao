import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MetasService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getUser() {
    return await this.supabase.auth.getUser();
  }

  // CHECKLIST
  async listarMetas() {
    const { data, error } = await this.supabase
      .from('metas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

async adicionarMeta(descricao: string) {
  // 1. Forçar a obtenção do utilizador atual
  const { data: { user } } = await this.supabase.auth.getUser();

  if (!user) {
    console.error("Erro: Nenhum utilizador logado para adicionar meta");
    return;
  }

  // 2. Inserir explicitamente com o user_id
  const { error } = await this.supabase
    .from('metas')
    .insert([{ 
      descricao: descricao, 
      user_id: user.id, // <--- ESTE CAMPO É O QUE ATIVA A POLICY
      concluida: false 
    }]);

  if (error) throw error;
}

  async atualizarMeta(id: string, concluida: boolean) {
    const { error } = await this.supabase.from('metas').update({ concluida }).eq('id', id);
    if (error) throw error;
  }

  async apagarMeta(id: string) {
    const { error } = await this.supabase.from('metas').delete().eq('id', id);
    if (error) throw error;
  }

  // MACROS
  async guardarMacros(dados: any) {
    const { data: { user } } = await this.getUser();
    if (!user) throw new Error('Não autenticado');

    const { error } = await this.supabase.from('daily_goals').upsert({
      user_id: user.id,
      day: new Date().toISOString().split('T')[0],
      kcal_goal: dados.calories,
      protein_goal: dados.protein,
      carbs_goal: dados.carbs,
      fat_goal: dados.fat,
      fiber_goal: dados.fiber
    }, { onConflict: 'user_id, day' });

    if (error) throw error;
  }

  async buscarMacrosPorDia(data: string) {
    // maybeSingle evita o erro de "nenhum registo encontrado"
    return await this.supabase.from('daily_goals').select('*').eq('day', data).maybeSingle();
  }

  async buscarHistoricoResumo() {
    // 1. Ir buscar o utilizador para filtrar apenas os dados DELE
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Utilizador não autenticado');

    // 2. Procurar na tabela daily_summary
    const { data, error } = await this.supabase
      .from('daily_summary') 
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false }); // Ordenar do mais recente para o mais antigo

    if (error) throw error;
    return data;
  }

async adicionarAlimento(dados: any) {
  const { data: { user } } = await this.supabase.auth.getUser();
  if (!user) throw new Error('Utilizador não autenticado');

  const { error } = await this.supabase
    .from('food_entries')
    .insert([{
      user_id: user.id,
      date: new Date().toISOString().split('T')[0], // Grava a data de hoje (YYYY-MM-DD)
      total_kcal: dados.kcal,
      total_protein: dados.protein,
      total_carbs: dados.carbs,
      total_fat: dados.fat,
      total_fiber: dados.fiber,
      grams: dados.grams,
      food_id: dados.food_id || null // Se tiveres uma tabela de alimentos fixa
    }]);

  if (error) throw error;
}
async buscarTotaisDoDia() {
  const { data: { user } } = await this.supabase.auth.getUser();
  const hoje = new Date().toISOString().split('T')[0];

  const { data, error } = await this.supabase
    .from('food_entries')
    .select('total_kcal, total_protein, total_carbs, total_fat, total_fiber')
    .eq('user_id', user?.id)
    .eq('date', hoje);

  if (error) return null;

  // Somar todos os registos do dia
  return data.reduce((acc, curr) => ({
    kcal: acc.kcal + (curr.total_kcal || 0),
    protein: acc.protein + (curr.total_protein || 0),
    carbs: acc.carbs + (curr.total_carbs || 0),
    fat: acc.fat + (curr.total_fat || 0),
    fiber: acc.fiber + (curr.total_fiber || 0)
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

async listarAlimentosBase() {
  const { data, error } = await this.supabase
    .from('foods')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}
}