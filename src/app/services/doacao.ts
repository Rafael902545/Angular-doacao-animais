// src/app/services/doacao.ts
// Serviço principal — cobre todos os endpoints da API Flask

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal, NovoAnimal, Abrigo, Usuario } from '../models/Animal.model';

const API = 'http://localhost:5000';

@Injectable({ providedIn: 'root' })
export class DoacaoService {
  constructor(private http: HttpClient) {}

  // ── ANIMAIS ──────────────────────────────────────────────
  getAnimais(especie?: string, nome?: string): Observable<Animal[]> {
    let params = new HttpParams();
    if (especie) params = params.set('especie', especie);
    if (nome)    params = params.set('nome', nome);
    return this.http.get<Animal[]>(`${API}/animais`, { params });
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${API}/animais/${id}`);
  }

  cadastrarAnimal(animal: NovoAnimal): Observable<any> {
    return this.http.post(`${API}/animais`, animal);
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

  // ── USUÁRIOS ─────────────────────────────────────────────
  getUsuarios(nome?: string, cpf?: string): Observable<Usuario[]> {
    let params = new HttpParams();
    if (nome) params = params.set('nome', nome);
    if (cpf)  params = params.set('cpf', cpf);
    return this.http.get<Usuario[]>(`${API}/usuarios`, { params });
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API}/usuarios/${id}`);
  }

  cadastrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${API}/usuarios`, usuario);
  }

  atualizarUsuario(id: number, dados: Partial<Usuario>): Observable<any> {
    return this.http.put(`${API}/usuarios/${id}`, dados);
  }

  deletarUsuario(id: number): Observable<any> {
    return this.http.delete(`${API}/usuarios/${id}`);
  }

  // ── ABRIGOS ──────────────────────────────────────────────
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