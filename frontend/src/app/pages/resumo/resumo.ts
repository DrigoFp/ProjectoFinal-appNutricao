import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasService } from '../../services/metas';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.css',
})
export class Resumo implements OnInit {
  private metasService = inject(MetasService);
  historico: any[] = [];

  async ngOnInit() {
    try {
      this.historico = await this.metasService.buscarHistoricoResumo();
      console.log('Dados do histórico:', this.historico);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    }
  }
}
