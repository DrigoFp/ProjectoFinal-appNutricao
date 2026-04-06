import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { MetasService } from '../services/metas';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private metasService = inject(MetasService);
  private router = inject(Router);
  private routerSubscription?: Subscription;

  searchTerm: string = '';

  // pequisa alimentos filtro
  get alimentosFiltrados() {
    if (!this.searchTerm) return this.alimentosDB;
    return this.alimentosDB.filter((a) =>
      a.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
  // Estado
  registosHoje: any[] = [];
  alimentosDB: any[] = [];
  exibirFormAlimento = false;
  carregando = true;

  // Formulário
  selectedFoodId = '';
  grams = 100;
  kcal = 0;
  protein = 0;
  carbs = 0;
  fat = 0;
  fiber = 0;

  // Estrutura das metas ligada ao Signal do Service
  metasDiarias = [
    { nome: 'Calorias', atual: 0, objetivo: 0, unidade: 'kcal', cor: '#2ecc71' },
    { nome: 'Proteína', atual: 0, objetivo: 0, unidade: 'g', cor: '#3498db' },
    { nome: 'Carboidratos', atual: 0, objetivo: 0, unidade: 'g', cor: '#f1c40f' },
    { nome: 'Gordura', atual: 0, objetivo: 0, unidade: 'g', cor: '#e74c3c' },
    { nome: 'Fibra', atual: 0, objetivo: 0, unidade: 'g', cor: '#9b59b6' },
  ];

  async ngOnInit() {
    await this.iniciar();

    // Escuta mudanças de rota para atualizar dados quando o user volta dos Goals
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) => event instanceof NavigationEnd && event.urlAfterRedirects === '/dashboard',
        ),
      )
      .subscribe(() => {
        this.atualizarDadosDoDia();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async iniciar() {
    this.carregando = true;
    try {
      const user = await this.metasService.getSessionUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.alimentosDB = await this.metasService.listarAlimentosBase();
      await this.atualizarDadosDoDia();
    } catch (error) {
      console.error('Erro ao iniciar dashboard:', error);
    } finally {
      this.carregando = false;
    }
  }

  async atualizarDadosDoDia() {
    try {
      const user = await this.metasService.getSessionUser();
      if (!user) return;

      const hoje = new Date().toLocaleDateString('en-CA');

      // 1. Tenta carregar metas de hoje
      const responseMacros = await this.metasService.buscarMacrosPorDia(hoje);
      const metasHoje = responseMacros?.data || responseMacros;

      if (metasHoje && metasHoje.kcal_goal) {
        // Atualiza o Signal do Service com dados de HOJE
        this.metasService.metasAtuais.set({
          kcal: metasHoje.kcal_goal,
          protein: metasHoje.protein_goal,
          carbs: metasHoje.carbs_goal,
          fat: metasHoje.fat_goal,
          fiber: metasHoje.fiber_goal,
        });
      } else {
        // Fallback para o perfil se não houver metas para hoje
        const { data: perfil } = await this.metasService.getProfile(user.id);
        if (perfil) {
          this.metasService.metasAtuais.set({
            kcal: perfil.kcal_goal || 2000,
            protein: perfil.protein_goal || 150,
            carbs: perfil.carbs_goal || 250,
            fat: perfil.fat_goal || 70,
            fiber: perfil.fiber_goal || 30,
          });
        }
      }

      // Sincroniza o array metasDiarias com o Signal
      const metasService = this.metasService.metasAtuais();
      this.metasDiarias[0].objetivo = metasService.kcal;
      this.metasDiarias[1].objetivo = metasService.protein;
      this.metasDiarias[2].objetivo = metasService.carbs;
      this.metasDiarias[3].objetivo = metasService.fat;
      this.metasDiarias[4].objetivo = metasService.fiber;

      // 2. Atualiza consumos (barras)
      this.registosHoje = await this.metasService.buscarRegistosDetalhadosHoje(user.id, hoje);
      const totais = await this.metasService.buscarTotaisDoDia();

      this.metasDiarias[0].atual = Math.round(totais.kcal || 0);
      this.metasDiarias[1].atual = Math.round(totais.protein || 0);
      this.metasDiarias[2].atual = Math.round(totais.carbs || 0);
      this.metasDiarias[3].atual = Math.round(totais.fat || 0);
      this.metasDiarias[4].atual = Math.round(totais.fiber || 0);
    } catch (e) {
      console.error('Erro ao atualizar dados:', e);
    }
  }

  // --- MÉTODOS DE AÇÃO ---

  calcularValores() {
    const alimento = this.alimentosDB.find((a) => a.id === this.selectedFoodId);
    if (!alimento) return;

    const f = this.grams / 100;
    this.kcal = Math.round(alimento.kcal_per_100g * f);
    this.protein = Math.round(alimento.protein_per_100g * f);
    this.carbs = Math.round(alimento.carbs_per_100g * f);
    this.fat = Math.round(alimento.fat_per_100g * f);
    this.fiber = Math.round(alimento.fiber_per_100g * f);
  }

  async onSalvarAlimento() {
    // 1. Validação de segurança: se não houver ID, não envia
    if (!this.selectedFoodId || this.selectedFoodId === '') {
      alert('Por favor, seleciona um alimento da lista primeiro!');
      return;
    }

    try {
      console.log('A enviar alimento ID:', this.selectedFoodId);

      await this.metasService.adicionarAlimento({
        grams: this.grams,
        kcal: this.kcal,
        protein: this.protein,
        carbs: this.carbs,
        fat: this.fat,
        fiber: this.fiber,
        food_id: this.selectedFoodId,
      });

      await this.atualizarDadosDoDia();
      this.exibirFormAlimento = false;
      this.selectedFoodId = '';
      this.grams = 100;
    } catch (error) {
      console.error('Erro ao guardar alimento:', error);
      alert('Erro técnico ao guardar: verifica se o alimento selecionado é válido.');
    }
  }

  async onApagarRegisto(id: string) {
    try {
      await this.metasService.apagarAlimento(id);
      await this.atualizarDadosDoDia();
    } catch (e) {
      console.error(e);
    }
  }

  async onApagarUltimo() {
    try {
      const user = await this.metasService.getSessionUser();
      if (!user) return;

      const hoje = new Date().toLocaleDateString('en-CA');
      const { data } = await this.metasService.buscarUltimoRegistoHoje(user.id, hoje);

      if (data && data.length > 0) {
        await this.metasService.apagarAlimento(data[0].id);
        await this.atualizarDadosDoDia();
      }
    } catch (e) {
      console.error(e);
    }
  }

  get saudacao(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  toggleForm() {
    this.exibirFormAlimento = !this.exibirFormAlimento;
    if (!this.exibirFormAlimento) {
      this.searchTerm = ''; // Limpa quando fecha
    }
  }

  trackByRegisto(index: number, item: any) {
    return item?.id ?? index;
  }
}
