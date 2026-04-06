import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MetasService } from '../../services/metas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
})
export class Goals implements OnInit {
  private fb = inject(FormBuilder);
  private metasService = inject(MetasService);
  private router = inject(Router);

  listaMetas = signal<any[]>([]);
  novaMeta = signal('');
  carregando = signal(false);

  // Formulário reativo para as metas de macros do dia
  goalsForm: FormGroup = this.fb.group({
    calories: [0, [Validators.required, Validators.min(0)]],
    protein: [0, [Validators.required, Validators.min(0)]],
    carbs: [0, [Validators.required, Validators.min(0)]],
    fat: [0, [Validators.required, Validators.min(0)]],
    fiber: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.carregarTudo();
  }

private getHojeFormatado(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  async carregarTudo() {
    this.carregando.set(true);

    try {
      // 1. Carregar Checklist (Tarefas)
      const metas = await this.metasService.listarMetas();
      this.listaMetas.set(metas || []);

      // 2. Carregar Macros específicas de hoje (Tabela daily_goals)
      const hoje = this.getHojeFormatado();
      const response = await this.metasService.buscarMacrosPorDia(hoje);
      
      // Mapeamento: Ajustamos para os nomes reais da tua tabela (kcal_goal, etc)
      if (response && response.data) {
        const macros = response.data;
        this.goalsForm.patchValue({
          calories: macros.kcal_goal || 0,
          protein: macros.protein_goal || 0,
          carbs: macros.carbs_goal || 0,
          fat: macros.fat_goal || 0,
          fiber: macros.fiber_goal || 0,
        });
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      this.carregando.set(false);
    }
  }

  // --- Lógica da Checklist ---

  async adicionar() {
    const descricao = this.novaMeta().trim();
    if (!descricao) return;

    try {
      this.carregando.set(true);
      await this.metasService.adicionarMeta(descricao);
      this.novaMeta.set(''); 
      // Recarregar apenas a lista de metas para ser mais rápido
      const metas = await this.metasService.listarMetas();
      this.listaMetas.set(metas || []);
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      alert('Erro ao guardar a tarefa.');
    } finally {
      this.carregando.set(false);
    }
  }

  async alternarStatus(meta: any) {
    try {
      const novoStatus = !meta.concluida;
      await this.metasService.atualizarMetaChecklist(meta.id, novoStatus);
      // Atualização local simples para evitar flicker
      this.listaMetas.update(prev => 
        prev.map(m => m.id === meta.id ? { ...m, concluida: novoStatus } : m)
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }
  
  async excluir(id: string) {
    if (!confirm('Eliminar esta tarefa?')) return;
    try {
      await this.metasService.apagarMeta(id);
      this.listaMetas.update(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

async saveGoals() {
  if (this.goalsForm.valid) {
    try {
      this.carregando.set(true);
      
      // 1. Envia para a base de dados (Supabase)
      await this.metasService.guardarMacros(this.goalsForm.value);

      this.metasService.metasAtuais.set({
        kcal: this.goalsForm.value.calories,
        protein: this.goalsForm.value.protein,
        carbs: this.goalsForm.value.carbs,
        fat: this.goalsForm.value.fat,
        fiber: this.goalsForm.value.fiber
      });
      
      alert('Metas diárias atualizadas! ✅');
      
      // 3. Redireciona para o dashboard
      this.router.navigate(['/dashboard']); 
      
    } catch (e) {
      console.error('Erro ao guardar metas:', e);
      alert('Erro ao guardar metas.');
    } finally {
      this.carregando.set(false);
    }
  }
}
}