import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetasService } from '../services/metas';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private metasService = inject(MetasService);

  // Mantemos os nomes amigáveis para o teu HTML/ngModel
  perfil = {
    full_name: '',
    goal_calories: 2000,
    goal_protein: 150,
    goal_carbs: 250,
    goal_fat: 70,
    goal_fiber: 30
  };

  carregando = true;

  async ngOnInit() {
    try {
      const user = await this.metasService.getSessionUser();
      if (user) {
        const { data, error } = await this.metasService.getProfile(user.id);
        if (data) {
          // MAPEAMENTO: Transformar o que vem da DB (kcal_goal) para o teu objeto (goal_calories)
          this.perfil = {
            full_name: data.full_name || '',
            goal_calories: data.kcal_goal || 2000,
            goal_protein: data.protein_goal || 150,
            goal_carbs: data.carbs_goal || 250,
            goal_fat: data.fat_goal || 70,
            goal_fiber: data.fiber_goal || 30
          };
        }
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      this.carregando = false;
    }
  }

  async guardarAlteracoes() {
    this.carregando = true;
    try {
      const user = await this.metasService.getSessionUser();
      if (user) {
        // MAPEAMENTO INVERSO: Preparar o objeto com os nomes exatos da DB
        const dadosParaGravar = {
          id: user.id,
          full_name: this.perfil.full_name,
          kcal_goal: Number(this.perfil.goal_calories),
          protein_goal: Number(this.perfil.goal_protein),
          carbs_goal: Number(this.perfil.goal_carbs),
          fat_goal: Number(this.perfil.goal_fat),
          fiber_goal: Number(this.perfil.goal_fiber),
          updated_at: new Date()
        };

        const { error } = await this.metasService.updateProfile(dadosParaGravar);
        
        if (error) throw error;
        alert('Metas atualizadas com sucesso! ✅');
      }
    } catch (err: any) {
      alert('Erro ao guardar dados: ' + (err.message || 'Erro desconhecido'));
      console.error(err);
    } finally {
      this.carregando = false;
    }
  }
}