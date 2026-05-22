import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { DoacaoService } from './doacao';
import { Animal, NovoAnimal, Abrigo, Usuario } from '../models/Animal.model';

const API = 'http://localhost:5000';

// ── Fixtures ────────────────────────────────────────────────────────────────

const mockAnimal: Animal = {
  id: 1,
  nome: 'Rex',
  especie: 'Cachorro',
  idade: 3,
  descricao: 'Brincalhão',
  abrigo_id: 1,
};

const mockNovoAnimal: NovoAnimal = {
  nome: 'Mimi',
  especie: 'Gato',
  idade: 2,
  descricao: 'Tranquila',
  abrigo_id: 1,
};

const mockUsuario: Usuario = {
  id: 1,
  nome: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao@email.com',
};

const mockAbrigo: Abrigo = {
  id: 1,
  nome: 'Abrigo Esperança',
  endereco: 'Rua das Flores, 123',
  telefone: '(11) 99999-9999',
};

// ── Suite ────────────────────────────────────────────────────────────────────

describe('DoacaoService', () => {
  let service: DoacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DoacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // garante que não ficaram requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── ANIMAIS ───────────────────────────────────────────────────────────────

  describe('getAnimais()', () => {
    it('deve buscar todos os animais sem filtros', () => {
      service.getAnimais().subscribe((animais) => {
        expect(animais).toEqual([mockAnimal]);
      });

      const req = httpMock.expectOne(`${API}/animais`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);
      req.flush([mockAnimal]);
    });

    it('deve enviar query param "especie" quando informado', () => {
      service.getAnimais('Cachorro').subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${API}/animais` && r.params.get('especie') === 'Cachorro'
      );
      expect(req.request.method).toBe('GET');
      req.flush([mockAnimal]);
    });

    it('deve enviar query param "nome" quando informado', () => {
      service.getAnimais(undefined, 'Rex').subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${API}/animais` && r.params.get('nome') === 'Rex'
      );
      req.flush([mockAnimal]);
    });

    it('deve enviar ambos os params quando especie e nome são informados', () => {
      service.getAnimais('Cachorro', 'Rex').subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${API}/animais` &&
          r.params.get('especie') === 'Cachorro' &&
          r.params.get('nome') === 'Rex'
      );
      req.flush([mockAnimal]);
    });
  });

  describe('getAnimalById()', () => {
    it('deve buscar um animal pelo id', () => {
      service.getAnimalById(1).subscribe((animal) => {
        expect(animal).toEqual(mockAnimal);
      });

      const req = httpMock.expectOne(`${API}/animais/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAnimal);
    });
  });

  describe('cadastrarAnimal()', () => {
    it('deve fazer POST com os dados do novo animal', () => {
      service.cadastrarAnimal(mockNovoAnimal).subscribe((res) => {
        expect(res).toEqual({ id: 2, ...mockNovoAnimal });
      });

      const req = httpMock.expectOne(`${API}/animais`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockNovoAnimal);
      req.flush({ id: 2, ...mockNovoAnimal });
    });
  });

  describe('atualizarAnimal()', () => {
    it('deve fazer PUT com os dados parciais do animal', () => {
      const patch: Partial<Animal> = { nome: 'Bolinha' };

      service.atualizarAnimal(1, patch).subscribe((res) => {
        expect(res).toEqual({ ...mockAnimal, ...patch });
      });

      const req = httpMock.expectOne(`${API}/animais/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(patch);
      req.flush({ ...mockAnimal, ...patch });
    });
  });

  describe('deletarAnimal()', () => {
    it('deve fazer DELETE para o animal informado', () => {
      service.deletarAnimal(1).subscribe((res) => {
        expect(res).toEqual({ message: 'Deletado com sucesso' });
      });

      const req = httpMock.expectOne(`${API}/animais/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deletado com sucesso' });
    });
  });

  describe('getCategorias()', () => {
    it('deve retornar a lista de categorias', () => {
      const categorias = ['Cachorro', 'Gato', 'Pássaro'];

      service.getCategorias().subscribe((res) => {
        expect(res).toEqual(categorias);
      });

      const req = httpMock.expectOne(`${API}/categorias`);
      expect(req.request.method).toBe('GET');
      req.flush(categorias);
    });
  });

  // ── USUÁRIOS ──────────────────────────────────────────────────────────────

  describe('getUsuarios()', () => {
    it('deve buscar todos os usuários sem filtros', () => {
      service.getUsuarios().subscribe((usuarios) => {
        expect(usuarios).toEqual([mockUsuario]);
      });

      const req = httpMock.expectOne(`${API}/usuarios`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys()).toEqual([]);
      req.flush([mockUsuario]);
    });

    it('deve enviar query param "nome" quando informado', () => {
      service.getUsuarios('João').subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${API}/usuarios` && r.params.get('nome') === 'João'
      );
      req.flush([mockUsuario]);
    });

    it('deve enviar query param "cpf" quando informado', () => {
      service.getUsuarios(undefined, '123.456.789-00').subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${API}/usuarios` &&
          r.params.get('cpf') === '123.456.789-00'
      );
      req.flush([mockUsuario]);
    });
  });

  describe('getUsuarioById()', () => {
    it('deve buscar um usuário pelo id', () => {
      service.getUsuarioById(1).subscribe((usuario) => {
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(`${API}/usuarios/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });
  });

  describe('cadastrarUsuario()', () => {
    it('deve fazer POST com os dados do novo usuário', () => {
      service.cadastrarUsuario(mockUsuario).subscribe();

      const req = httpMock.expectOne(`${API}/usuarios`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUsuario);
      req.flush({ id: 1, ...mockUsuario });
    });
  });

  describe('atualizarUsuario()', () => {
    it('deve fazer PUT com os dados parciais do usuário', () => {
      const patch: Partial<Usuario> = { email: 'novo@email.com' };

      service.atualizarUsuario(1, patch).subscribe();

      const req = httpMock.expectOne(`${API}/usuarios/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(patch);
      req.flush({ ...mockUsuario, ...patch });
    });
  });

  describe('deletarUsuario()', () => {
    it('deve fazer DELETE para o usuário informado', () => {
      service.deletarUsuario(1).subscribe();

      const req = httpMock.expectOne(`${API}/usuarios/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deletado com sucesso' });
    });
  });

  // ── ABRIGOS ───────────────────────────────────────────────────────────────

  describe('getAbrigos()', () => {
    it('deve retornar a lista de abrigos', () => {
      service.getAbrigos().subscribe((abrigos) => {
        expect(abrigos).toEqual([mockAbrigo]);
      });

      const req = httpMock.expectOne(`${API}/abrigos`);
      expect(req.request.method).toBe('GET');
      req.flush([mockAbrigo]);
    });
  });

  describe('getAbrigoById()', () => {
    it('deve buscar um abrigo pelo id', () => {
      service.getAbrigoById(1).subscribe((abrigo) => {
        expect(abrigo).toEqual(mockAbrigo);
      });

      const req = httpMock.expectOne(`${API}/abrigos/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAbrigo);
    });
  });

  describe('atualizarAbrigo()', () => {
    it('deve fazer PUT com os dados parciais do abrigo', () => {
      const patch: Partial<Abrigo> = { telefone: '(11) 88888-8888' };

      service.atualizarAbrigo(1, patch).subscribe();

      const req = httpMock.expectOne(`${API}/abrigos/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(patch);
      req.flush({ ...mockAbrigo, ...patch });
    });
  });

  describe('deletarAbrigo()', () => {
    it('deve fazer DELETE para o abrigo informado', () => {
      service.deletarAbrigo(1).subscribe();

      const req = httpMock.expectOne(`${API}/abrigos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Deletado com sucesso' });
    });
  });
});