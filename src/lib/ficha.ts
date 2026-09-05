// O formato do JSON que vai pra coluna `ficha` no Supabase.
// Deixar isso num lugar só evita a tela de criação salvar de um jeito e a ficha ler de outro.

import type { Atributos } from "@/lib/rules/formulas";
import {
  vidaMaxima,
  defesaPassiva,
  reservaMaximaDeCarga,
  limiteDeCargaPorAcao,
  pesoMaximo,
  pontosDeConcepcaoDisponiveis,
} from "@/lib/rules/formulas";
import { PERICIAS } from "@/lib/rules/pericias";

export interface ItemInventario {
  id: string;
  nome: string;
  peso: number;
  quantidade: number;
}

export interface EstadosDoPersonagem {
  ferido: boolean;
  instavel: boolean;
  sobrecarga: boolean;
}

export const ESTADOS_LIMPOS: EstadosDoPersonagem = {
  ferido: false,
  instavel: false,
  sobrecarga: false,
};

export interface FichaSalva {
  versao: 2;
  atributos: Atributos;
  /** URL do retrato; vazio mostra a silhueta de placeholder */
  retrato: string;
  estados: EstadosDoPersonagem;
  /** id da perícia -> índice do grau em GRAUS_TREINO (0 = Destreinado) */
  pericias: Record<string, number>;
  pontosDePericia: number;
  vidaAtual: number;
  cargaAtual: number;
  vezesEstourado: number;
  itens: ItemInventario[];
  anotacoes: string;
}

export const ATRIBUTOS_ZERADOS: Atributos = {
  forca: 1,
  destreza: 1,
  constituicao: 1,
  inteligencia: 1,
  carga: 1,
  carisma: 1,
};

export function periciasZeradas(): Record<string, number> {
  return Object.fromEntries(PERICIAS.map((p) => [p.id, 0]));
}

export function fichaNova(atributos: Atributos, pontosDePericia: number): FichaSalva {
  return {
    versao: 2,
    atributos,
    retrato: "",
    estados: { ...ESTADOS_LIMPOS },
    pericias: periciasZeradas(),
    pontosDePericia,
    vidaAtual: vidaMaxima(atributos),
    cargaAtual: reservaMaximaDeCarga(atributos),
    vezesEstourado: 0,
    itens: [],
    anotacoes: "",
  };
}

// Fichas salvas antes (versão 1) só tinham `atributos` e `derivados`.
// Em vez de quebrar, a gente completa o que falta na leitura.
export function normalizarFicha(bruto: unknown, pontosDePericiaPadrao: number): FichaSalva {
  const obj = (bruto ?? {}) as Partial<FichaSalva> & { atributos?: Atributos };
  const atributos = { ...ATRIBUTOS_ZERADOS, ...(obj.atributos ?? {}) };
  return {
    versao: 2,
    atributos,
    retrato: obj.retrato ?? "",
    estados: { ...ESTADOS_LIMPOS, ...(obj.estados ?? {}) },
    pericias: { ...periciasZeradas(), ...(obj.pericias ?? {}) },
    pontosDePericia: obj.pontosDePericia ?? pontosDePericiaPadrao,
    vidaAtual: obj.vidaAtual ?? vidaMaxima(atributos),
    cargaAtual: obj.cargaAtual ?? reservaMaximaDeCarga(atributos),
    vezesEstourado: obj.vezesEstourado ?? 0,
    itens: obj.itens ?? [],
    anotacoes: obj.anotacoes ?? "",
  };
}

export function derivadosDe(atributos: Atributos, nivel: number, bonusMochilas = 0) {
  return {
    vida: vidaMaxima(atributos),
    defesa: defesaPassiva(atributos),
    reserva: reservaMaximaDeCarga(atributos),
    limiteCarga: limiteDeCargaPorAcao(atributos),
    pesoMax: pesoMaximo(atributos, bonusMochilas),
    concepcao: pontosDeConcepcaoDisponiveis(nivel),
  };
}
