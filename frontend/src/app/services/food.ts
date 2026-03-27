import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Food {
  private http = inject(HttpClient); // injectar o tradutor
  private apiUrl = 'http://localhost:3000/food-entries'; // endereço do

  // Função para apagar um registo pelo ID
  deleteEntry(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
