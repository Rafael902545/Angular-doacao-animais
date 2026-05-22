import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastService, ToastState } from './toast';

// ── Suite ────────────────────────────────────────────────────────────────────

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Estado inicial ─────────────────────────────────────────────────────────

  it('deve iniciar com estado invisível e sem mensagem', () => {
    const state: ToastState = service.state();
    expect(state.visivel).toBeFalse();
    expect(state.mensagem).toBe('');
    expect(state.tipo).toBe('');
  });

  // ── show() ─────────────────────────────────────────────────────────────────

  describe('show()', () => {
    it('deve exibir o toast com mensagem e tipo "ok"', fakeAsync(() => {
      service.show('Salvo com sucesso!', 'ok');

      const state = service.state();
      expect(state.visivel).toBeTrue();
      expect(state.mensagem).toBe('Salvo com sucesso!');
      expect(state.tipo).toBe('ok');

      tick(3500);
    }));

    it('deve exibir o toast com mensagem e tipo "erro"', fakeAsync(() => {
      service.show('Algo deu errado.', 'erro');

      const state = service.state();
      expect(state.visivel).toBeTrue();
      expect(state.mensagem).toBe('Algo deu errado.');
      expect(state.tipo).toBe('erro');

      tick(3500);
    }));

    it('deve usar tipo vazio como padrão quando o tipo não é informado', fakeAsync(() => {
      service.show('Mensagem neutra');

      const state = service.state();
      expect(state.tipo).toBe('');
      expect(state.visivel).toBeTrue();

      tick(3500);
    }));

    // ── Auto-hide ────────────────────────────────────────────────────────────

    it('deve esconder o toast automaticamente após 3500ms', fakeAsync(() => {
      service.show('Temporário', 'ok');

      expect(service.state().visivel).toBeTrue();

      tick(3500);

      const state = service.state();
      expect(state.visivel).toBeFalse();
      expect(state.mensagem).toBe('');
      expect(state.tipo).toBe('');
    }));

    it('não deve esconder o toast antes de 3500ms', fakeAsync(() => {
      service.show('Ainda visível', 'ok');

      tick(3499);
      expect(service.state().visivel).toBeTrue();

      tick(1); // completa os 3500ms
    }));

    // ── Debounce / chamadas consecutivas ─────────────────────────────────────

    it('deve reiniciar o timer quando show() é chamado novamente antes do timeout', fakeAsync(() => {
      service.show('Primeira mensagem', 'ok');
      tick(2000);

      // segunda chamada antes dos 3500ms iniciais
      service.show('Segunda mensagem', 'erro');
      expect(service.state().mensagem).toBe('Segunda mensagem');
      expect(service.state().tipo).toBe('erro');

      // apenas 3500ms a partir da segunda chamada devem ocultar
      tick(3499);
      expect(service.state().visivel).toBeTrue();

      tick(1);
      expect(service.state().visivel).toBeFalse();
    }));

    it('deve substituir a mensagem anterior imediatamente ao chamar show() novamente', fakeAsync(() => {
      service.show('Mensagem A', 'ok');
      service.show('Mensagem B', 'erro');

      expect(service.state().mensagem).toBe('Mensagem B');
      expect(service.state().tipo).toBe('erro');

      tick(3500);
    }));
  });
});