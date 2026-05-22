// src/app/components/home/home.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoacaoService } from '../../services/doacao';
import { Animal, Especie, ESPECIE_LABEL, ESPECIE_EMOJI, ESPECIES } from '../../models/Animal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  animaisDestaque: Animal[] = [];
  carregando = true;

  // Categorias com os valores exatos que a API aceita
  readonly categorias = ESPECIES;

  constructor(private doacao: DoacaoService, private router: Router) {}

  ngOnInit(): void {
    this.doacao.getAnimais().subscribe({
      next:  (animais) => { this.animaisDestaque = animais.slice(0, 4); this.carregando = false; },
      error: ()         => (this.carregando = false),
    });
  }

  verAnimal(id: number): void {
    this.router.navigate(['/animais', id]);
  }

  getLabel(especie: string): string {
    return ESPECIE_LABEL[especie as Especie] ?? especie;
  }

  getEmoji(especie: string): string {
    return ESPECIE_EMOJI[especie as Especie] ?? '🐾';
  }
}