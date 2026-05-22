// src/app/services/toast.service.ts

import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'ok' | 'erro' | '';

export interface ToastState {
  mensagem: string;
  tipo: ToastTipo;
  visivel: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  state = signal<ToastState>({ mensagem: '', tipo: '', visivel: false });

  private timer: any;

  show(mensagem: string, tipo: ToastTipo = '') {
    clearTimeout(this.timer);
    this.state.set({ mensagem, tipo, visivel: true });
    this.timer = setTimeout(() => {
      this.state.set({ mensagem: '', tipo: '', visivel: false });
    }, 3500);
  }
}