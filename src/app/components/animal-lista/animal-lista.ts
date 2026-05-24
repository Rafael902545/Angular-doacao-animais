// src/app/components/animal-lista/animal-lista.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoacaoService } from '../../services/doacao';
import { ToastService } from '../../services/toast';
import { Animal, Especie, ESPECIES, ESPECIE_LABEL, ESPECIE_EMOJI } from '../../models/Animal.model';

@Component({
  selector: 'app-animal-lista',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './animal-lista.html',
  styleUrl: './animal-lista.scss',
})
export class AnimalListaComponent implements OnInit {
  animais: Animal[]          = [];
  animaisFiltrados: Animal[] = [];
  carregando = true;

  filtroNome    = '';
  filtroEspecie = '';

  animalParaDeletar: Animal | null = null;
  deletando = false;

  readonly especies = ESPECIES;

  constructor(
    private doacao: DoacaoService,
    private toast:  ToastService,
    private router: Router,
    private route:  ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filtroEspecie = params['especie'] || '';
      this.filtroNome    = params['nome']    || '';
      this.carregar();
    });
  }

  carregar(): void {
    this.carregando = true;
    this.doacao.getAnimais().subscribe({
      next:  (animais) => { this.animais = animais; this.filtrar(); this.carregando = false; },
      error: ()        => { this.toast.show('Erro ao carregar animais.', 'erro'); this.carregando = false; },
    });
  }

  filtrar(): void {
    this.animaisFiltrados = this.animais.filter((a) => {
      const matchEspecie = !this.filtroEspecie || a.especie === this.filtroEspecie;
      const matchNome    = !this.filtroNome    ||
        a.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      return matchEspecie && matchNome;
    });
  }

  selecionarEspecie(especie: string): void {
    this.filtroEspecie = this.filtroEspecie === especie ? '' : especie;
    this.filtrar();
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroEspecie = '';
    this.filtrar();
  }

  // Navega para o form de edição com o id do animal
  editar(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/animais', id, 'editar']);
  }

  confirmarDeletar(event: Event, animal: Animal): void {
    event.stopPropagation();
    this.animalParaDeletar = animal;
  }

  cancelarDeletar(): void {
    this.animalParaDeletar = null;
  }

  deletar(): void {
    if (!this.animalParaDeletar || this.deletando) return;
    this.deletando = true;

    this.doacao.deletarAnimal(this.animalParaDeletar.id).subscribe({
      next: () => {
        this.toast.show(`${this.animalParaDeletar!.nome} removido com sucesso.`, 'ok');
        // Remove localmente sem recarregar tudo
        this.animais = this.animais.filter((a) => a.id !== this.animalParaDeletar!.id);
        this.filtrar();
        this.animalParaDeletar = null;
        this.deletando = false;
      },
      error: () => {
        this.toast.show('Erro ao remover animal.', 'erro');
        this.animalParaDeletar = null;
        this.deletando = false;
      },
    });
  }

  getLabel(especie: string): string {
    return ESPECIE_LABEL[especie as Especie] ?? especie;
  }

  getEmoji(especie: string): string {
    return ESPECIE_EMOJI[especie as Especie] ?? '🐾';
  }
}