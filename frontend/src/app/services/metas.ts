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

  
}