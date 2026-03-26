import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-goals',
  imports: [ReactiveFormsModule],
  templateUrl: './goals.html',
  styleUrl: './goals.css',
  standalone: true,
})
export class Goals {
private fb = inject(FormBuilder); // "Injetamos" o construtor de formulários

  // Criamos o grupo de metas
  goalsForm: FormGroup = this.fb.group({
    calories: [2550, [Validators.required, Validators.min(0)]], // Valor inicial padrão e o uso de validação sem ter de usar o if, graças ao angular
    protein: [135, [Validators.required, Validators.min(0)]],
    carbs: [300, [Validators.required, Validators.min(0)]],
    fat: [80, [Validators.required, Validators.min(0)]],
    fiber: [35, [Validators.required, Validators.min(0)]],

  });

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