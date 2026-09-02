// Todas as fórmulas numéricas oficiais do Ressonância RPG, num só lugar.
// Isso É o glossário de recursos, em código — se uma fórmula mudar, muda só aqui.

export interface Atributos {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  carga: number;
  carisma: number;
}

export const PONTOS_ATRIBUTOS_CRIACAO = 34;
export const ATRIBUTO_MIN = 1;
export const ATRIBUTO_MAX_BASE = 20; // pode subir com Teto Estourado, ver tetoAtual()

export function somaAtributos(a: Atributos): number {
  return a.forca + a.destreza + a.constituicao + a.inteligencia + a.carga + a.carisma;
}

export function vidaMaxima(a: Atributos): number {
  return 10 + a.constituicao * 4;
}

export function defesaPassiva(a: Atributos): number {
  return 10 + a.constituicao;
}

// Defesa Ativa depende de quanta Carga o jogador investe na reação, então recebe isso como parâmetro.
export function defesaAtiva(a: Atributos, cargaInvestida: number): number {
  return defesaPassiva(a) + cargaInvestida;
}

export function reservaMaximaDeCarga(a: Atributos): number {
  return (a.inteligencia + a.carga) * 2;
}

export function limiteDeCargaPorAcao(a: Atributos, bonusDeTrilha = 0): number {
  return a.carga + bonusDeTrilha;
}

// Pontos de Concepção: orçamento cumulativo (nunca devolvido) = 2 + Nível
export function pontosDeConcepcaoDisponiveis(nivel: number): number {
  return 2 + nivel;
}

// Teto Estourado: contador numérico, não checkbox — cada vez soma +3 ao teto de 20.
export function tetoAtual(vezesEstourado: number): number {
  return ATRIBUTO_MAX_BASE + vezesEstourado * 3;
}

// Peso Máximo = Força × 2, + bônus de mochilas equipadas
export function pesoMaximo(a: Atributos, bonusMochilas = 0): number {
  return a.forca * 2 + bonusMochilas;
}

// Tabela de Porte de Dano Direto
export const PORTE = {
  pequena: { danoBase: 1, custoConcepcao: 0 },
  media: { danoBase: 3, custoConcepcao: 2 },
  grande: { danoBase: 5, custoConcepcao: 4 },
} as const;
export type PorteId = keyof typeof PORTE;

// Fórmula de Fusão (de Aplicações OU de Ecos entre dois personagens — mesma matemática)
export function danoDeFusao(maiorDanoBase: number, cargaTotalInvestida: number, constituicaoDefensor: number): number {
  return Math.round(maiorDanoBase * 1.5) + cargaTotalInvestida - Math.floor(constituicaoDefensor / 2);
}

// Tiers narrativos de Nível (também define o teto de Grau de Perícia — ver pericias.ts)
export function tierDoNivel(nivel: number): 1 | 2 | 3 | 4 {
  if (nivel >= 16) return 4;
  if (nivel >= 11) return 3;
  if (nivel >= 6) return 2;
  return 1;
}

export function bonusDeTreinoPorTier(tier: 1 | 2 | 3 | 4): number {
  return tier + 1; // Tier 1 = +2, Tier 2 = +3, Tier 3 = +4, Tier 4 = +5
}
