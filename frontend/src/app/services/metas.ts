import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; 
import { environment } from '../../environments/environment'; // Importação oficial

@Injectable({
  providedIn: 'root'
})
export class MetasService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Listar metas (O Supabase filtra automaticamente pelo user_id graças ao RLS do supabase)
  async listarMetas() {
    const { data, error } = await this.supabase
      .from('metas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Adicionar meta
  async adicionarMeta(descricao: string) {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    const { data, error } = await this.supabase
      .from('metas')
      .insert([{ 
        descricao, 
        user_id: user?.id 
      }]);
    
    if (error) throw error;
    return data;
  }

  // Atualizar (para o teu CRUD completo com a nova policy de UPDATE)
  async atualizarMeta(id: string, concluida: boolean) {
    const { error } = await this.supabase
      .from('metas')
      .update({ concluida })
      .eq('id', id);
    
    if (error) throw error;
  }

  // Apagar
  async apagarMeta(id: string) {
    const { error } = await this.supabase
      .from('metas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}