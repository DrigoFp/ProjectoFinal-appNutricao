import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient; // vai guardar a ligação, o cliente;
  private userState = new BehaviorSubject<User | null>(null); // guarda o utilizador ou null = estado inicial da app

constructor() {
  this.supabase = supabase;

  // 1. Verifica sessão inicial
  this.checkUser();

  // 2. Escuta mudanças de sessão (login, logout, refresh)
  this.supabase.auth.onAuthStateChange((event, session) => {
    this.userState.next(session?.user ?? null);
  });
}


async getSessionUser() {
  const { data: { user } } = await this.supabase.auth.getUser();
  return user;
}

  // funcção que verifica se já existe user logado no localsotrage
  private async checkUser() {
    const { data } = await this.supabase.auth.getUser(); // espera até verificar dentro do supabase
    // Aqui enviamos o resultado para o nosso monitor (userState)
    // Se encontrou alguém, o userState passa a ter o User.
    // Se a gaveta estava vazia, continua null.
    this.userState.next(data.user);
  }

  get user$() {
    return this.userState.asObservable();
  }

  // login
  async login(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
    if (error) {
      throw error; // se houver erro, notifica o componente
    }
    this.userState.next(data.user); // tudo ok, actualiza o monitor
    return data;
  }

  // SingUp

  async registar(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass
    });
    if (error){
      throw error;
    }
    return data;
  }

// SingOut

async logout (){
  await this.supabase.auth.signOut(); // pedimos ao supabase para invalidar a sessão
  this.userState.next(null); // avisamos o BehaviorS que o user é nulo
}
}
