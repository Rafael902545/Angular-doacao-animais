// src/app/components/perfil/perfil.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DoacaoService, NovoUsuario } from '../../services/doacao';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class PerfilComponent implements OnInit {
  // ID do usuário logado — troque pelo seu mecanismo de auth
  usuarioId: number | null = null;

  // Campos do formulário
  nome      = '';
  cpf       = '';
  telefone  = '';
  email     = '';

  // Campos de endereço (auxiliares — montam a string enviada à API)
  cep         = '';
  rua         = '';
  numero      = '';
  complemento = '';
  bairro      = '';
  cidade      = '';
  estado      = '';
  endereco    = ''; // string final enviada à API (máx 60 chars)

  salvando    = false;
  buscandoCep = false;
  cepOk       = false;
  cepErro     = false;
  erros: Record<string, string> = {};

  constructor(
    private doacao: DoacaoService,
    private toast:  ToastService,
    private http:   HttpClient,
  ) {}

  ngOnInit(): void {
    // Tenta carregar usuário de ID 1 como exemplo
    // Troque por seu serviço de autenticação real
    this.doacao.getUsuarioById(1).subscribe({
      next: (u) => {
        this.usuarioId = u.id ?? null;
        this.nome      = u.nome;
        this.cpf       = u.cpf;
        this.telefone  = u.telefone;
        this.email     = u.email;
        this.endereco  = u.endereco;
        this.rua       = u.endereco; // popula campo visual
      },
      error: () => {
        // Usuário ainda não existe — modo cadastro
        this.usuarioId = null;
      },
    });
  }

  // ── CEP ────────────────────────────────────────────────────────────────
  buscarCep(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    this.buscandoCep = true;
    this.cepOk       = false;
    this.cepErro     = false;

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (res) => {
        if (res.erro) {
          this.cepErro = true;
        } else {
          this.rua    = res.logradouro;
          this.bairro = res.bairro;
          this.cidade = res.localidade;
          this.estado = res.uf;
          this.cepOk  = true;
          this.montarEndereco();
        }
        this.buscandoCep = false;
      },
      error: () => { this.cepErro = true; this.buscandoCep = false; },
    });
  }

  montarEndereco(): void {
    const partes = [this.rua, this.numero, this.complemento, this.bairro, this.cidade, this.estado]
      .filter(Boolean)
      .join(', ');
    this.endereco = partes.slice(0, 60);
  }

  // ── Validação (espelha regras do Flask) ────────────────────────────────
  private validar(): boolean {
    this.erros = {};

    const nome = this.nome.trim();
    if (!nome)
      this.erros['nome'] = 'Nome é obrigatório.';
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome))
      this.erros['nome'] = 'Somente letras.';
    else if (nome.length < 2)
      this.erros['nome'] = 'Mínimo 2 caracteres.';
    else if (nome.length > 154)
      this.erros['nome'] = 'Máximo 154 caracteres.';

    const cpf = this.cpf.replace(/\D/g, '');
    if (!cpf)
      this.erros['cpf'] = 'CPF é obrigatório.';
    else if (cpf.length !== 11)
      this.erros['cpf'] = 'CPF deve ter exatamente 11 dígitos.';

    const tel = this.telefone.replace(/\D/g, '');
    if (!tel)
      this.erros['telefone'] = 'Telefone é obrigatório.';
    else if (tel.length !== 11)
      this.erros['telefone'] = 'Telefone deve ter 11 dígitos (com DDD).';

    if (!this.email)
      this.erros['email'] = 'E-mail é obrigatório.';
    else if (this.email.length > 256)
      this.erros['email'] = 'E-mail muito longo.';

    this.montarEndereco();
    if (!this.endereco)
      this.erros['endereco'] = 'Endereço é obrigatório.';
    else if (this.endereco.length > 60)
      this.erros['endereco'] = 'Endereço muito longo (máx 60 caracteres).';

    return Object.keys(this.erros).length === 0;
  }

  // ── Salvar ─────────────────────────────────────────────────────────────
  salvar(): void {
    if (!this.validar()) return;
    this.salvando = true;

    const payload: NovoUsuario = {
      nome:     this.nome.trim(),
      cpf:      this.cpf.replace(/\D/g, ''),
      telefone: this.telefone.replace(/\D/g, ''),
      email:    this.email.trim(),
      endereco: this.endereco,
    };

    const request$ = this.usuarioId
      ? this.doacao.atualizarUsuario(this.usuarioId, payload)  // PUT
      : this.doacao.cadastrarUsuario(payload);                  // POST

    request$.subscribe({
      next: (res) => {
        // Se o POST retornou um id, armazena para próximas edições
        if (!this.usuarioId && res?.id) this.usuarioId = res.id;
        this.toast.show('Cadastro salvo com sucesso!', 'ok');
        this.salvando = false;
      },
      error: (err) => {
        const msg =
          err?.error?.erro ||
          err?.error?.Mensagem ||
          'Erro ao salvar. Verifique os dados.';
        this.toast.show(msg, 'erro');
        this.salvando = false;
      },
    });
  }
}