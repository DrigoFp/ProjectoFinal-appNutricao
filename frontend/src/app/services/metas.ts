import { Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class MetasService {
  private supabase: SupabaseClient;

  metasAtuais = signal({
    kcal: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    fiber: 30
  });

  constructor() {
    this.supabase = supabase;
  }

  private getHojeLocal(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  // --- AUTENTICAÇÃO ---
  async getUser() {
    return await this.supabase.auth.getUser();
  }

  async getSessionUser() {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.user ?? null;
  }

  // --- PERFIL ---
  async getProfile(userId: string) {
    return await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  }

  async updateProfile(profileData: any) {
    return await this.supabase
      .from('profiles')
      .upsert(profileData);
  }

  // --- ALIMENTOS & REGISTOS ---
  async listarAlimentosBase() {
    const { data, error } = await this.supabase
      .from('foods')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  async adicionarAlimento(dados: any) {
    const user = await this.getSessionUser();
    if (!user) throw new Error('Não autenticado');
    
    const { data, error } = await this.supabase
      .from('food_entries')
      .insert([{
        user_id: user.id,
        date: this.getHojeLocal(),
        total_kcal: Number(dados.kcal),
        total_protein: Number(dados.protein),
        total_carbs: Number(dados.carbs),
        total_fat: Number(dados.fat),
        total_fiber: Number(dados.fiber),
        grams: Number(dados.grams),
        food_id: dados.food_id,
      }])
      .select().single();
      
    if (error) throw error;
    return data;
  }

async buscarTotaisDoDia() {
  const user = await this.getSessionUser();
  if (!user) return { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  const hoje = new Date().toLocaleDateString('en-CA'); 

  const { data, error } = await this.supabase
    .from('food_entries')
    .select('total_kcal, total_protein, total_carbs, total_fat, total_fiber')
    .eq('user_id', user.id)
    .eq('date', hoje); // Filtro rigoroso por data
    
  if (error || !data) {
    console.error('Erro ao buscar totais:', error);
    return { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  }

  // 2. SOMA COM ARREDONDAMENTO
  return data.reduce((acc, curr) => {
    return {
      kcal: Math.round(acc.kcal + (Number(curr.total_kcal) || 0)),
      protein: Number((acc.protein + (Number(curr.total_protein) || 0)).toFixed(1)),
      carbs: Number((acc.carbs + (Number(curr.total_carbs) || 0)).toFixed(1)),
      fat: Number((acc.fat + (Number(curr.total_fat) || 0)).toFixed(1)),
      fiber: Number((acc.fiber + (Number(curr.total_fiber) || 0)).toFixed(1)),
    };
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

  async buscarRegistosDetalhadosHoje(userId: string, date: string) {
    const { data, error } = await this.supabase
      .from('food_entries')
      .select('id, grams, total_kcal, total_protein, total_carbs, total_fat, total_fiber, foods:food_id(name)')
      .eq('user_id', userId)
      .eq('date', date)
      .order('id', { ascending: false });
    if (error) throw error;
    return data;
  }

  async buscarUltimoRegistoHoje(userId: string, dataHoje: string) {
    return await this.supabase
      .from('food_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('date', dataHoje)
      .order('id', { ascending: false })
      .limit(1);
  }

  async apagarAlimento(id: string) {
    const { error } = await this.supabase.from('food_entries').delete().eq('id', id);
    if (error) throw error;
  }

  // --- METAS DIÁRIAS (daily_goals) ---

  async guardarMacros(dados: any) {
    const user = await this.getSessionUser();
    if (!user) throw new Error('Não autenticado');
    
    const hoje = this.getHojeLocal();

    // Faz UPSERT para garantir que se o dia já existir, ele apenas atualiza os valores
    const { error } = await this.supabase.from('daily_goals').upsert({
      user_id: user.id,
      day: hoje,
      kcal_goal: Number(dados.calories),
      protein_goal: Number(dados.protein),
      carbs_goal: Number(dados.carbs),
      fat_goal: Number(dados.fat),
      fiber_goal: Number(dados.fiber),
    }, { onConflict: 'user_id, day' }); 

    if (error) {
      console.error('Erro no Supabase:', error);
      throw error;
    }
  }

  async buscarMacrosPorDia(data: string) {
    const user = await this.getSessionUser();
    if (!user) return { data: null };

    return await this.supabase
      .from('daily_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('day', data)
      .maybeSingle();
  }

  // --- HISTÓRICO & CHECKLIST ---

  async buscarHistoricoResumo() {
    const user = await this.getSessionUser();
    if (!user) throw new Error('Não autenticado');
    const { data, error } = await this.supabase
      .from('food_entries')
      .select('date, total_kcal, total_protein, total_carbs, total_fat')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

async buscarHistorico() {
  const user = await this.getSessionUser();
  if (!user) return [];

  const { data, error } = await this.supabase
    .from('food_entries')
    .select(`
      *,
      foods ( name )
    `) // Isto traz o nome do alimento automaticamente se as tabelas estiverem ligadas
    .eq('user_id', user.id)
    .order('date', { ascending: false }); // Do mais recente para o mais antigo

  if (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
  return data;
}

  async logout() {
    await this.supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
  }

  async listarMetas() {
    const { data, error } = await this.supabase.from('metas').select('*').order('id', { ascending: false });
    if (error) throw error;
    return data;
  }

  async adicionarMeta(descricao: string) {
    const user = await this.getSessionUser();
    if (!user) return;
    const { error } = await this.supabase.from('metas').insert([{ descricao, user_id: user.id, concluida: false }]);
    if (error) throw error;
  }

  async atualizarMetaChecklist(id: string, concluida: boolean) {
    const { error } = await this.supabase.from('metas').update({ concluida }).eq('id', id);
    if (error) throw error;
  }

  async apagarMeta(id: string) {
    const { error } = await this.supabase.from('metas').delete().eq('id', id);
    if (error) throw error;
  }
}