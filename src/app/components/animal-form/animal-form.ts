// src/app/components/animal-form/animal-form.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoacaoService } from '../../services/doacao';
import { ToastService } from '../../services/toast';
import { Especie, ESPECIES } from '../../models/Animal.model';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './animal-form.html',
  styleUrl: './animal-form.scss',
})
export class AnimalFormComponent implements OnInit {
  modoEdicao = false;
  animalId: number | null = null;
  salvando   = false;
  erros: Record<string, string> = {};

  readonly especies = ESPECIES;

  // Campos separados — evita enviar objeto com campos extras à API
  nome:    string         = '';
  especie: Especie | null = null;
  idade:   number | null  = null;

  constructor(
    private doacao: DoacaoService,
    private toast:  ToastService,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // A rota é /animais/:id/editar — o paramMap tem 'id'
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && idParam !== 'novo') {
      this.modoEdicao = true;
      this.animalId   = Number(idParam);

      this.doacao.getAnimalById(this.animalId).subscribe({
        next: (a) => {
          this.nome    = a.nome;
          this.especie = a.especie;
          this.idade   = a.idade;
        },
        error: () => {
          this.toast.show('Animal não encontrado.', 'erro');
          this.router.navigate(['/animais']);
        },
      });
    }
  }

  onNomeBlur(): void {
    this.nome = this.toTitleCase(this.nome.trim());
  }

  private toTitleCase(str: string): string {
    return str
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }

  private validar(): boolean {
    this.erros = {};

    const nome = this.nome.trim();
    if (!nome)
      this.erros['nome'] = 'Nome é obrigatório.';
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome))
      this.erros['nome'] = 'Nome deve conter apenas letras.';
    else if (nome.length < 2)
      this.erros['nome'] = 'Mínimo 2 caracteres.';
    else if (nome.length > 20)
      this.erros['nome'] = 'Máximo 20 caracteres.';
    else if (nome !== this.toTitleCase(nome))
      this.erros['nome'] = 'Cada palavra deve começar com letra maiúscula.';

    if (!this.especie)
      this.erros['especie'] = 'Espécie é obrigatória.';

    if (this.idade === null || this.idade === undefined || String(this.idade) === '')
      this.erros['idade'] = 'Idade é obrigatória.';
    else if (!Number.isInteger(Number(this.idade)) || Number(this.idade) < 0)
      this.erros['idade'] = 'Idade deve ser um número inteiro positivo.';

    return Object.keys(this.erros).length === 0;
  }

  salvar(): void {
    if (!this.validar()) return;
    this.salvando = true;

    const nome  = this.toTitleCase(this.nome.trim());
    const idade = Number(this.idade);

    if (this.modoEdicao && this.animalId) {
      // PUT /animais/:id
      this.doacao.atualizarAnimal(this.animalId, {
        nome,
        especie: this.especie!,
        idade,
      }).subscribe({
        next:  () => { this.toast.show(`${nome} atualizado!`, 'ok'); this.router.navigate(['/animais']); },
        error: (err) => { this.exibirErro(err); this.salvando = false; },
      });
    } else {
      // POST /animais — não envia id
      this.doacao.cadastrarAnimal({
        nome,
        especie: this.especie!,
        idade,
      }).subscribe({
        next:  () => { this.toast.show(`${nome} cadastrado!`, 'ok'); this.router.navigate(['/animais']); },
        error: (err) => { this.exibirErro(err); this.salvando = false; },
      });
    }
  }

  private exibirErro(err: any): void {
    const msg =
      err?.error?.erro ||
      err?.error?.Mensagem ||
      'Erro ao salvar. Verifique os dados e tente novamente.';
    this.toast.show(msg, 'erro');
  }

  voltar(): void {
    this.router.navigate(['/animais']);
  }
}