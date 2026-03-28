import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Food } from '../../services/food';

@Component({
  selector: 'app-goals',
  imports: [ReactiveFormsModule],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
  standalone: true,
})
export class Goals implements OnInit {
  private fb = inject(FormBuilder); // "Injectamos" o construtor de formulários
  private food = inject(Food);

  // 1. Criamos a variável (gaveta) para guardar a lista de comida
  foodEntries: any[] = [];

  // Criamos o grupo de metas
  goalsForm: FormGroup = this.fb.group({
    calories: [2550, [Validators.required, Validators.min(0)]], // Valor inicial padrão e o uso de validação sem ter de usar o if, graças ao angular
    protein: [135, [Validators.required, Validators.min(0)]],
    carbs: [300, [Validators.required, Validators.min(0)]],
    fat: [80, [Validators.required, Validators.min(0)]],
    fiber: [35, [Validators.required, Validators.min(0)]],
  });

  // O "despertador" do componente: corre assim que o ecrã carrega
  ngOnInit() {
    console.log('O componente Goals acordou! Vou pedir os dados ao serviço.');
    this.carregarDados();
  } // <--- FECHAMOS o ngOnInit aqui!

  // Função dedicada a pedir os dados ao serviço
  carregarDados() {
    const userId = '391467b0-6c0c-4090-b6c0-f74fd774826e'; // O ID que testaste

    // 1. Chamamos a função que criaste no serviço Food
    this.food.getEntries(userId).subscribe({
      // 2. Se tudo correr BEM, os dados chegam aqui:
      next: (dados) => {
        this.foodEntries = dados as any[];
        console.log('Sucesso! Recebemos isto do Render:', this.foodEntries);
      },
      // 3. Se houver um ERRO (ex: Render desligado), ele avisa aqui:
      error: (erro) => {
        console.error('Ops! Algo falhou na ligação ao Render:', erro);
      }
    });
  } // <--- FECHAMOS o carregarDados aqui!

  // Esta função é chamada quando clico no botão de Submit
  saveGoals() {
    if (this.goalsForm.valid) {
      // Se todos os validadores (required, min) passarem:
      console.log('Dados prontos para o Supabase:', this.goalsForm.value);
      alert('Metas guardadas com sucesso!');
    } else {
      // Se faltar algum campo ou houver números negativos:
      alert('Por favor, preenche todos os campos correctamente.');
    }
  } 
}