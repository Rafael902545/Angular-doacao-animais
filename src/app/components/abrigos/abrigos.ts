// src/app/components/abrigos/abrigos.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { DoacaoService } from '../../services/doacao';
import { ToastService } from '../../services/toast';
import { Abrigo } from '../../models/Animal.model';

@Component({
  selector: 'app-abrigos',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './abrigos.html',
  styleUrl: './abrigos.scss',
})
export class AbrigosComponent implements OnInit {
  abrigos: Abrigo[]          = [];
  carregando                  = true;
  abrigoParaDeletar: Abrigo | null = null;

  constructor(
    private doacao: DoacaoService,
    private toast:  ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.doacao.getAbrigos().subscribe({
      next:  (abs) => { this.abrigos = abs; this.carregando = false; },
      error: ()    => { this.toast.show('Erro ao carregar abrigos.', 'erro'); this.carregando = false; },
    });
  }

  verAnimaisDoAbrigo(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/animais'], { queryParams: { abrigo_id: id } });
  }

  editarAbrigo(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/abrigos', id, 'editar']);
  }

  confirmarDeletar(event: Event, abrigo: Abrigo): void {
    event.stopPropagation();
    this.abrigoParaDeletar = abrigo;
  }

  cancelarDeletar(): void { this.abrigoParaDeletar = null; }

  deletarAbrigo(): void {
    if (!this.abrigoParaDeletar) return;
    this.doacao.deletarAbrigo(this.abrigoParaDeletar.id).subscribe({
      next:  () => {
        this.toast.show(`${this.abrigoParaDeletar!.nome} removido.`, 'ok');
        this.abrigos = this.abrigos.filter((a) => a.id !== this.abrigoParaDeletar!.id);
        this.abrigoParaDeletar = null;
      },
      error: () => { this.toast.show('Erro ao remover abrigo.', 'erro'); this.abrigoParaDeletar = null; },
    });
  }
}