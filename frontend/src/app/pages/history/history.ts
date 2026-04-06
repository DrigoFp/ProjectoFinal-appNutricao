import { Component, OnInit } from '@angular/core';
import { MetasService } from '../../services/metas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {
  historico: any[] = [];

  constructor(private metasService: MetasService) {}

  async ngOnInit() {
    this.historico = await this.metasService.buscarHistorico();
  }

  // Função para agrupar registos por data no HTML
  get datasUnicas() {
    return [...new Set(this.historico.map(item => item.date))];
  }

  getRegistosPorData(data: string) {
    return this.historico.filter(item => item.date === data);
  }
}