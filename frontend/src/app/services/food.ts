import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Food {
  private http = inject(HttpClient); // injectar o tradutor
  private apiUrl = 'https://projectofinal-appnutricao.onrender.com/food-entries'; // endereço do render para deixar a backend a funcionar

  // Função para ir buscar os registos de um utilizador específico
  getEntries(userId: string) {
    // Isto vai gerar: .../food-entries/user/ID_DO_USER
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  // Função para apagar um registo pelo ID
  deleteEntry(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
