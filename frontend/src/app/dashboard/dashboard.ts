import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetasService } from '../services/metas';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private metasService = inject(MetasService);
  alimentosDB: any[] = []; // Para guardar a lista do Supabase
  metasDiarias = [
    { nome: 'Calorias', atual: 0, objetivo: 2550, unidade: 'kcal', cor: '#2ecc71' },
    { nome: 'Proteína', atual: 0, objetivo: 135, unidade: 'g', cor: '#3498db' },
    { nome: 'Carboidratos', atual: 0, objetivo: 300, unidade: 'g', cor: '#f1c40f' },
    { nome: 'Gordura', atual: 0, objetivo: 70, unidade: 'g', cor: '#e74c3c' },
    { nome: 'Fibra', atual: 0, objetivo: 35, unidade: 'g', cor: '#9b59b6' },
  ];

  get saudacao(): string {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  get caloriasRestantes(): number {
    // Procura o item 'Calorias' no array de metas
    const metaCalorias = this.metasDiarias.find((m) => m.nome === 'Calorias');

    if (!metaCalorias) return 0;

    const resto = metaCalorias.objetivo - metaCalorias.atual;
    return resto > 0 ? resto : 0; // Se ultrapassar a meta, mostra 0
  }

  async onSalvarAlimento(form: any) {
    try {
      const novoAlimento = {
        grams: Number(form.grams),
        kcal: Number(form.kcal),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat),
        fiber: Number(form.fiber),
      };

      await this.metasService.adicionarAlimento(novoAlimento);

      alert('Alimento registado com sucesso! ✅');

      // REPETIR A LEITURA: Após gravar, recarregamos os totais para as barras subirem
      await this.atualizarDadosDoDia();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao guardar dados.');
    }
  }

  async ngOnInit() {
    this.alimentosDB = await this.metasService.listarAlimentosBase();
    await this.atualizarDadosDoDia();
  }

  async atualizarDadosDoDia() {
    try {
      const totais = await this.metasService.buscarTotaisDoDia();

      if (totais) {
        // Mapeamos os resultados do serviço para o nosso array de exibição
        this.metasDiarias = this.metasDiarias.map((meta) => {
          switch (meta.nome) {
            case 'Calorias':
              return { ...meta, atual: totais.kcal };
            case 'Proteína':
              return { ...meta, atual: totais.protein };
            case 'Carboidratos':
              return { ...meta, atual: totais.carbs };
            case 'Gordura':
              return { ...meta, atual: totais.fat };
            case 'Fibra':
              return { ...meta, atual: totais.fiber };
            default:
              return meta;
          }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
    }
  }
  // Função para quando escolhes um alimento na lista
  onSeleccionarAlimento(alimentoId: string, gramas: string, inputs: any) {
    const alimento = this.alimentosDB.find((a) => a.id === alimentoId);
    if (!alimento) return;

    const fator = Number(gramas) / 100; // Porque os teus dados são "per_100g"

    // Preenche os campos automaticamente para o utilizador ver
    inputs.k.value = Math.round(alimento.kcal_per_100g * fator);
    inputs.p.value = Math.round(alimento.protein_per_100g * fator);
    inputs.c.value = Math.round(alimento.carbs_per_100g * fator);
    inputs.f.value = Math.round(alimento.fat_per_100g * fator);
    inputs.fib.value = Math.round(alimento.fiber_per_100g * fator);
  }

  get estadoDoDia(): string {
  const metaCalorias = this.metasDiarias.find(m => m.nome === 'Calorias');
  if (!metaCalorias) return 'Em progresso 🏃‍♂️';
  
  return metaCalorias.atual >= metaCalorias.objetivo 
    ? 'Objetivo Atingido! 🎉' 
    : 'Em progresso 🏃‍♂️';
}
}
