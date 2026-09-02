// As 15 Perícias oficiais — cada uma ligada a um atributo.
export type Atributo = "forca" | "destreza" | "constituicao" | "inteligencia" | "carga" | "carisma";

export interface Pericia {
  id: string;
  nome: string;
  atributo: Atributo;
}

export const PERICIAS: Pericia[] = [
  { id: "atletismo", nome: "Atletismo", atributo: "forca" },
  { id: "luta", nome: "Luta", atributo: "forca" },
  { id: "acrobacia", nome: "Acrobacia", atributo: "destreza" },
  { id: "furtividade", nome: "Furtividade", atributo: "destreza" },
  { id: "pontaria", nome: "Pontaria", atributo: "destreza" },
  { id: "fortitude", nome: "Fortitude", atributo: "constituicao" },
  { id: "sobrevivencia", nome: "Sobrevivência", atributo: "constituicao" },
  { id: "investigacao", nome: "Investigação", atributo: "inteligencia" },
  { id: "ocultismo", nome: "Ocultismo", atributo: "inteligencia" },
  { id: "tatica", nome: "Tática", atributo: "inteligencia" },
  { id: "percepcao", nome: "Percepção", atributo: "carga" },
  { id: "concentracao", nome: "Concentração", atributo: "carga" },
  { id: "diplomacia", nome: "Diplomacia", atributo: "carisma" },
  { id: "enganacao", nome: "Enganação", atributo: "carisma" },
  { id: "intimidacao", nome: "Intimidação", atributo: "carisma" },
];

// Escada de Graus de Treino — custo cumulativo em Pontos de Perícia, e o bônus no teste.
export const GRAUS_TREINO = [
  { grau: "Destreinado", custoTotal: 0, bonus: 0 },
  { grau: "Treinado", custoTotal: 1, bonus: 2 },
  { grau: "Adepto", custoTotal: 3, bonus: 3 },
  { grau: "Especialista", custoTotal: 6, bonus: 4 },
  { grau: "Mestre", custoTotal: 10, bonus: 5 },
] as const;

// Teto de Grau permitido por Tier de Nível (não é automático — é o limite do que dá pra comprar)
export function grauMaximoPorNivel(nivel: number): number {
  if (nivel >= 16) return 4; // Mestre
  if (nivel >= 11) return 3; // Especialista
  if (nivel >= 6) return 2; // Adepto
  return 1; // Treinado
}
