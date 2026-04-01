import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Injetamos as ferramentas
  private authService = inject(AuthService);
  private router = inject(Router);

  // verificar forca pass no registo
  larguraBarra: string = '0%';
  corBarra: string = '#e0e0e0';
  textoForca: string = '';
  temNumero: boolean = false;

  verificarForca(senha: string) {
    const senhaLimpa = senha.trim(); // aqui uso o .trim() para não deixar o utilizador meter espaços
    const tamanho = senhaLimpa.length; // Aqui uso o .length para verificar o tamanho
    this.temNumero = /\d/.test(senhaLimpa); // // Esta variável será verdadeira (true) se encontrar pelo menos um número

    if (tamanho === 0) {
      this.larguraBarra = '0%';
      this.textoForca = '';
    } else if (tamanho < 6) {
      this.larguraBarra = '33%';
      this.corBarra = '#ff4d4d'; // Vermelho 🔴
      this.textoForca = 'Fraca';
    } else if (tamanho >= 8 && this.temNumero) {
      // Só é forte se tiver 8+ caracteres E um número
      this.larguraBarra = '100%';
      this.corBarra = '#2ecc71'; // Verde 🟢
      this.textoForca = 'Forte';
    } else {
      this.larguraBarra = '66%';
      this.corBarra = '#ffcc00'; // Amarelo 🟡
      this.textoForca = 'Média';
    }
  }

  // A função para o formulário
  carregando = false;

  async aoSubmeterRegisto(email: string, pass: string) {
    // Assim que entra na função, dizemos que começou a carregar
    this.carregando = true;
    // Limpar e medir a pass
    const senhaLimpa = pass.trim();

    if (senhaLimpa.length === 0) {
      alert('A password não pode ser apenas espaços!');
      this.carregando = false;
      return;
    }
    const temNumero = /\d/.test(senhaLimpa);

    if (!temNumero) {
      alert('A password deve conter pelo menos um número!');
      this.carregando = false;
      return;
    }

    try {
      await this.authService.registar(email, pass);
      this.router.navigate(['/goals']);
    } catch (error) {
      console.error('Erro:', error);
      alert('Dados incorretos!');
    } finally {
      // O 'finally' corre sempre, quer dê certo ou erro.
      // Aqui dizemos que já terminou de processar.
      this.carregando = false;
    }
  }
}
