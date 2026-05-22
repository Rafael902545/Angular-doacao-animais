// src/app/components/animal-form/animal-form.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoacaoService } from '../../services/doacao';
import { ToastService } from '../../services/toast';
import { Animal, NovoAnimal, ESPECIES } from '../../models/Animal.model';

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

  animal: Partial<Animal> = { nome: '', especie: undefined, idade: undefined };

  constructor(
    private doacao: DoacaoService,
    private toast:  ToastService,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.modoEdicao = true;
      this.animalId   = Number(id);
      this.doacao.getAnimalById(this.animalId).subscribe({
        next:  (a) => (this.animal = { ...a }),
        error: ()  => this.toast.show('Erro ao carregar animal.', 'erro'),
      });
    }
  }

  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }

  onNomeBlur(): void {
    if (this.animal.nome) {
      this.animal.nome = this.toTitleCase(this.animal.nome.trim());
    }
  }

  private validar(): boolean {
    this.erros = {};
    const nome = this.animal.nome?.trim() ?? '';

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

    if (!this.animal.especie)
      this.erros['especie'] = 'Espécie é obrigatória.';

    if (this.animal.idade === undefined || this.animal.idade === null || String(this.animal.idade) === '')
      this.erros['idade'] = 'Idade é obrigatória.';
    else if (!Number.isInteger(Number(this.animal.idade)) || Number(this.animal.idade) < 0)
      this.erros['idade'] = 'Idade deve ser um número inteiro positivo.';

    return Object.keys(this.erros).length === 0;
  }

  salvar(): void {
    if (!this.validar()) return;
    this.salvando = true;

    // A API não gera ID — enviamos um para o JSON
    const payload: NovoAnimal = {
      id:      this.animal.id ?? Date.now(),
      nome:    this.toTitleCase(this.animal.nome!.trim()),
      especie: this.animal.especie!,
      idade:   Number(this.animal.idade),
    };

    const request$ = this.modoEdicao && this.animalId
      ? this.doacao.atualizarAnimal(this.animalId, payload)
      : this.doacao.cadastrarAnimal(payload);

    request$.subscribe({
      next: () => {
        const acao = this.modoEdicao ? 'atualizado' : 'cadastrado';
        this.toast.show(`${payload.nome} ${acao} com sucesso!`, 'ok');
        this.router.navigate(['/animais']);
      },
      error: (err) => {
        const msg = err?.error?.erro || err?.error?.Mensagem || 'Erro ao salvar. Verifique os dados.';
        this.toast.show(msg, 'erro');
        this.salvando = false;
      },
    });
  }

  voltar(): void { this.router.navigate(['/animais']); }
}