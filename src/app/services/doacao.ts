// src/app/services/doacao.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, NovoAnimal, Abrigo, Usuario } from '../models/Animal.model';

const API = 'http://localhost:5000';

// Payload exato que o POST /usuarios aceita
export interface NovoUsuario {
  nome: string;
  cpf: string;       // 11 dígitos numéricos sem máscara
  telefone: string;  // 11 dígitos numéricos sem máscara
  email: string;
  endereco: string;  // string simples, até 60 chars
}

@Injectable({ providedIn: 'root' })
export class DoacaoService {
  constructor(private http: HttpClient) {}

  // ── ANIMAIS ──────────────────────────────────────────────────────────────

  getAnimais(especie?: string, nome?: string): Observable<Animal[]> {
    let params = new HttpParams();
    if (especie) params = params.set('especie', especie);
    if (nome)    params = params.set('nome', nome);
    return this.http.get<Animal[]>(`${API}/animais`, { params });
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${API}/animais/${id}`);
  }

  // POST /animais — envia apenas: nome, especie, idade (sem id, sem campos extras)
  cadastrarAnimal(animal: NovoAnimal): Observable<any> {
    const payload = {
      nome:    animal.nome,
      especie: animal.especie,
      idade:   animal.idade,
    };
    return this.http.post(`${API}/animais`, payload);
  }

  atualizarAnimal(id: number, dados: Partial<Animal>): Observable<any> {
    return this.http.put(`${API}/animais/${id}`, dados);
  }

  deletarAnimal(id: number): Observable<any> {
    return this.http.delete(`${API}/animais/${id}`);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${API}/categorias`);
  }

  // ── USUÁRIOS ─────────────────────────────────────────────────────────────

  getUsuarios(nome?: string, cpf?: string): Observable<Usuario[]> {
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    if (cpf)  params = params.set('cpf', cpf);
    return this.http.get<Usuario[]>(`${API}/usuarios`, { params });
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API}/usuarios/${id}`);
  }

  // POST /usuarios — envia exatamente os campos que o Flask valida
  cadastrarUsuario(usuario: NovoUsuario): Observable<any> {
    const payload: NovoUsuario = {
      nome:     usuario.nome,
      cpf:      usuario.cpf.replace(/\D/g, ''),       // garante só dígitos
      telefone: usuario.telefone.replace(/\D/g, ''),   // garante só dígitos
      email:    usuario.email,
      endereco: usuario.endereco.slice(0, 60),          // garante máx 60 chars
    };
    return this.http.post(`${API}/usuarios`, payload);
  }

  // PUT /usuarios/:id — sem validações tão rígidas, mas mantemos a limpeza
  atualizarUsuario(id: number, dados: Partial<NovoUsuario>): Observable<any> {
    const payload: Partial<NovoUsuario> = { ...dados };
    if (payload.cpf)      payload.cpf      = payload.cpf.replace(/\D/g, '');
    if (payload.telefone) payload.telefone = payload.telefone.replace(/\D/g, '');
    if (payload.endereco) payload.endereco = payload.endereco.slice(0, 60);
    return this.http.put(`${API}/usuarios/${id}`, payload);
  }

  deletarUsuario(id: number): Observable<any> {
    return this.http.delete(`${API}/usuarios/${id}`);
  }

  // ── ABRIGOS ──────────────────────────────────────────────────────────────

  getAbrigos(): Observable<Abrigo[]> {
    return this.http.get<Abrigo[]>(`${API}/abrigos`);
  }

  getAbrigoById(id: number): Observable<Abrigo> {
    return this.http.get<Abrigo>(`${API}/abrigos/${id}`);
  }

  atualizarAbrigo(id: number, dados: Partial<Abrigo>): Observable<any> {
    return this.http.put(`${API}/abrigos/${id}`, dados);
  }

  deletarAbrigo(id: number): Observable<any> {
    return this.http.delete(`${API}/abrigos/${id}`);
  }
}