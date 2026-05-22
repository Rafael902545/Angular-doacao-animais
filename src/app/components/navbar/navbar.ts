// src/app/components/navbar/navbar.ts

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  @ViewChild('buscaInput') buscaInput!: ElementRef<HTMLInputElement>;

  menuAberto  = false;
  buscaAberta = false;
  termoBusca  = '';

  constructor(private router: Router) {}

  toggleMenu():  void { this.menuAberto  = !this.menuAberto; }

  toggleBusca(): void {
    this.buscaAberta = !this.buscaAberta;
    if (this.buscaAberta) {
      setTimeout(() => this.buscaInput?.nativeElement.focus(), 150);
    } else {
      this.termoBusca = '';
    }
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      this.router.navigate(['/animais'], { queryParams: { nome: this.termoBusca.trim() } });
      this.toggleBusca();
    }
  }
}