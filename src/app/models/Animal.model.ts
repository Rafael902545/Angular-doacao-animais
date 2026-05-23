// src/app/models/Animal.model.ts

// ── Espécies aceitas pela API (minúsculo, sem acento) ──────────────────────
export type Especie = 'cachorro' | 'gato' | 'passaro' | 'peixe';

// ── Animal ─────────────────────────────────────────────────────────────────
// A API Flask armazena apenas: id, nome, especie, idade
export interface Animal {
  id: number;
  nome: string;     // title-case, só letras, 2–20 chars
  especie: Especie; // exatamente um dos 4 valores aceitos pela API
  idade: number;    // inteiro >= 0
}

export type NovoAnimal = Animal; // POST envia todos os campos incluindo id

// ── Abrigo ─────────────────────────────────────────────────────────────────
export interface Abrigo {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  foto?: string;
  descricao?: string;
  // Sem 'animais' — a API não retorna animais dentro do abrigo
}

// ── Usuário ────────────────────────────────────────────────────────────────
// A API Flask valida: nome, cpf (11 dígitos), telefone (11 dígitos), email, endereco (string)
export interface Usuario {
  id?: number;
  nome: string;      // title-case, só letras, 2–154 chars
  cpf: string;       // 11 dígitos numéricos sem máscara  ex: "12345678901"
  telefone: string;  // 11 dígitos numéricos sem máscara  ex: "11999998888"
  email: string;     // até 256 chars
  endereco: string;  // string simples até 60 chars — NÃO é objeto
}

// ── Helpers de exibição ────────────────────────────────────────────────────
export const ESPECIES: { value: Especie; label: string; emoji: string }[] = [
  { value: 'cachorro', label: 'Cachorro', emoji: '🐶' },
  { value: 'gato',     label: 'Gato',     emoji: '🐱' },
  { value: 'passaro',  label: 'Pássaro',  emoji: '🦜' },
  { value: 'peixe',    label: 'Peixe',    emoji: '🐠' },
];

export const ESPECIE_LABEL: Record<Especie, string> = {
  cachorro: 'Cachorro',
  gato:     'Gato',
  passaro:  'Pássaro',
  peixe:    'Peixe',
};

export const ESPECIE_EMOJI: Record<Especie, string> = {
  cachorro: '🐶',
  gato:     '🐱',
  passaro:  '🦜',
  peixe:    '🐠',
};
