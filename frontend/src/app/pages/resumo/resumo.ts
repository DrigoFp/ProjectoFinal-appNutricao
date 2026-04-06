import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasService } from '../../services/metas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.css',
})
export class Resumo implements OnInit {
  private metasService = inject(MetasService);
  private router = inject(Router);

  historico: any[] = [];
  carregando: boolean = true;

  async ngOnInit() {
    try {
      const user = await this.metasService.getSessionUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      // 1. Vai buscar todos os registos de comida do utilizador
      const dadosRaw = await this.metasService.buscarHistoricoResumo();
      
      if (dadosRaw && dadosRaw.length > 0) {
        // 2. AGRUPAR POR DATA: Somar tudo o que pertence ao mesmo dia
        const agrupado = dadosRaw.reduce((acc: any, curr: any) => {
          // Usamos split('T')[0] para garantir que pegamos apenas a data YYYY-MM-DD
          const dataChave = curr.date; 
          
          if (!acc[dataChave]) {
            acc[dataChave] = {
              date: dataChave,
              total_kcal: 0,
              total_protein: 0,
              total_carbs: 0,
              total_fat: 0,
              contagem: 0
            };
          }

          acc[dataChave].total_kcal += Number(curr.total_kcal || 0);
          acc[dataChave].total_protein += Number(curr.total_protein || 0);
          acc[dataChave].total_carbs += Number(curr.total_carbs || 0);
          acc[dataChave].total_fat += Number(curr.total_fat || 0);
          acc[dataChave].contagem += 1;

          return acc;
        }, {});

        // 3. Converter para Array, formatar data para PT e arredondar
        this.historico = Object.values(agrupado).map((item: any) => ({
          ...item,
          displayDate: new Date(item.date).toLocaleDateString('pt-PT', { timeZone: 'UTC' }),
          total_kcal: Math.round(item.total_kcal),
          total_protein: Math.round(item.total_protein),
          total_carbs: Math.round(item.total_carbs),
          total_fat: Math.round(item.total_fat)
        }));
      }
      
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      this.carregando = false;
    }
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}