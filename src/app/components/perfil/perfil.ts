// src/app/components/perfil/perfil.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DoacaoService } from '../../services/doacao';
import { ToastService } from '../../services/toast';
import { Usuario } from '../../models/Animal.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class PerfilComponent implements OnInit {
  // Troque pelo id do usuário logado conforme sua lógica de auth
  readonly usuarioId = 1;

  usuario: Usuario = { nome: '', cpf: '', telefone: '', email: '', endereco: '' };

  // Campos auxiliares para busca de CEP (não são enviados à API — só preenchem `endereco`)
  cep         = '';
  rua         = '';
  numero      = '';
  complemento = '';
  bairro      = '';
  cidade      = '';
  estado      = '';

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
    this.doacao.getUsuarioById(this.usuarioId).subscribe({
      next: (u) => {
        this.usuario  = { ...u };
        // Tenta popular os campos visuais se endereco já veio preenchido
        this.rua = u.endereco ?? '';
      },
      error: () => this.toast.show('Erro ao carregar perfil.', 'erro'),
    });
  }

  // ── Busca CEP e preenche campos visuais ────────────────────────────────
  buscarCep(): void {
    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    this.buscandoCep = true; this.cepOk = false; this.cepErro = false;

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (res) => {
        if (res.erro) { this.cepErro = true; }
        else {
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

  // Monta a string de endereço (máx 60 chars) para enviar à API
  montarEndereco(): void {
    const partes = [this.rua, this.numero, this.complemento, this.bairro, this.cidade, this.estado]
      .filter(Boolean).join(', ');
    this.usuario.endereco = partes.slice(0, 60);
  }

  // ── Validação espelhando o Flask ───────────────────────────────────────
  private validar(): boolean {
    this.erros = {};

    const nome = this.usuario.nome?.trim() ?? '';
    if (!nome) this.erros['nome'] = 'Nome é obrigatório.';
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) this.erros['nome'] = 'Somente letras.';
    else if (nome.length < 2)   this.erros['nome'] = 'Mínimo 2 caracteres.';
    else if (nome.length > 154) this.erros['nome'] = 'Máximo 154 caracteres.';

    const cpf = this.usuario.cpf?.replace(/\D/g, '') ?? '';
    if (!cpf)          this.erros['cpf'] = 'CPF é obrigatório.';
    else if (cpf.length !== 11) this.erros['cpf'] = 'CPF deve ter 11 dígitos.';

    const tel = this.usuario.telefone?.replace(/\D/g, '') ?? '';
    if (!tel)         this.erros['telefone'] = 'Telefone é obrigatório.';
    else if (tel.length !== 11) this.erros['telefone'] = 'Telefone deve ter 11 dígitos (com DDD).';

    if (!this.usuario.email) this.erros['email'] = 'E-mail é obrigatório.';

    if (!this.usuario.endereco) this.erros['endereco'] = 'Endereço é obrigatório.';
    else if (this.usuario.endereco.length > 60) this.erros['endereco'] = 'Endereço muito longo (máx 60 chars).';

    return Object.keys(this.erros).length === 0;
  }

  salvar(): void {
    // Garante que CPF e telefone vão sem máscara
    this.usuario.cpf      = this.usuario.cpf?.replace(/\D/g, '') ?? '';
    this.usuario.telefone = this.usuario.telefone?.replace(/\D/g, '') ?? '';
    this.montarEndereco();

    if (!this.validar()) return;
    this.salvando = true;

    this.doacao.atualizarUsuario(this.usuarioId, this.usuario).subscribe({
      next:  () => { this.toast.show('Cadastro salvo com sucesso!', 'ok'); this.salvando = false; },
      error: (err) => {
        const msg = err?.error?.erro || err?.error?.Mensagem || 'Erro ao salvar.';
        this.toast.show(msg, 'erro');
        this.salvando = false;
      },
    });
  }
}