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

  listaMetas = signal<any[]>([]);
  novaMeta = signal('');
  carregando = signal(false);

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

  async carregarTudo() {
    this.carregando.set(true);

    // 1. Carregar Checklist (Sempre funciona se houver metas)
    try {
      const metas = await this.metasService.listarMetas();
      this.listaMetas.set(metas || []);
    } catch (e) {
      console.error('Erro checklist:', e);
    }

    // 2. Carregar Macros de hoje
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const { data: macros } = await this.metasService.buscarMacrosPorDia(hoje);

      if (macros) {
        this.goalsForm.patchValue({
          calories: macros.kcal_goal,
          protein: macros.protein_goal,
          carbs: macros.carbs_goal,
          fat: macros.fat_goal,
          fiber: macros.fiber_goal,
        });
      }
    } catch (e) {
      console.error('Erro macros:', e);
    }

    this.carregando.set(false);
  }

  async adicionar() {
    const descricao = this.novaMeta().trim();
    if (!descricao) return;

    try {
      this.carregando.set(true);
      console.log('A tentar adicionar tarefa:', descricao);

      await this.metasService.adicionarMeta(descricao);

      this.novaMeta.set(''); // Limpa o input
      await this.carregarTudo(); // Força a atualização da lista

      console.log('Tarefa adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      alert('Erro ao guardar a tarefa. Verifica a consola.');
    } finally {
      this.carregando.set(false);
    }
  }

// No goals.ts, dentro da classe Goals:

async alternarStatus(meta: any) {
  try {
    // 1. Chamamos o serviço para atualizar no Supabase
    await this.metasService.atualizarMeta(meta.id, !meta.concluida);
    
    // 2. Recarregamos os dados para a lista atualizar no ecrã
    await this.carregarTudo(); 
    
    console.log('Status da meta atualizado!');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    alert('Não foi possível atualizar a tarefa.');
  }
}
  
  async excluir(id: string) {
    await this.metasService.apagarMeta(id);
    this.carregarTudo();
  }

  async saveGoals() {
    if (this.goalsForm.valid) {
      try {
        await this.metasService.guardarMacros(this.goalsForm.value);
        alert('✅ Guardado!');
      } catch (e) {
        alert('❌ Erro ao guardar');
      }
    }
  }
}
