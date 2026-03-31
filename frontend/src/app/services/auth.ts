import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient; // vai guardar a ligação, o cliente;
  private userState = new BehaviorSubject<User | null>(null); // guarda o utilizador ou null = estado inicial da app

  constructor() {
    this.supabase = createClient(
      // Inicializa a ligação ao Supabase
      'https://kctjcjzeezvuuwgfcmxs.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdGpjanplZXp2dXV3Z2ZjbXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjIzMTcsImV4cCI6MjA4OTgzODMxN30.npnTG26uLteNro2APmmZG5DQsvWN25-R7M3u36OoW_8',
    );

    this.checkUser(); // Verifica se alguém está logado (localStorage)
  }

  // funcção que verifica se já existe user logado no localsotrage
  private async checkUser() {
    const { data } = await this.supabase.auth.getUser(); // espera até verificar dentro do supabase
    // Aqui enviamos o resultado para o nosso monitor (userState)
    // Se encontrou alguém, o userState passa a ter o User.
    // Se a gaveta estava vazia, continua null.
    this.userState.next(data.user);
  }

  get currentUser() {
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
