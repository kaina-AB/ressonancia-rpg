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
// ESTA TABELA É A ÚNICA FONTE DO BÔNUS DE TREINO. O bônus vem do grau DAQUELA perícia,
// não do nível do personagem — subir um grau é o que aumenta o número no teste.
export const GRAUS_TREINO = [
  { grau: "Destreinado", custoTotal: 0, bonus: 0 },
  { grau: "Treinado", custoTotal: 1, bonus: 2 },
  { grau: "Adepto", custoTotal: 3, bonus: 3 },
  { grau: "Especialista", custoTotal: 6, bonus: 4 },
  { grau: "Mestre", custoTotal: 10, bonus: 5 },
] as const;

// Bônus que a perícia soma no teste, a partir do grau que ELA tem.
export function bonusDoGrau(grauIndex: number): number {
  const grau = GRAUS_TREINO[grauIndex];
  return grau ? grau.bonus : 0;
}

// Total do teste de perícia = valor do atributo ligado + bônus do grau dela.
export function totalDaPericia(valorDoAtributo: number, grauIndex: number): number {
  return valorDoAtributo + bonusDoGrau(grauIndex);
}

// custoTotal é ACUMULADO: é o que a perícia custou desde o Destreinado até aquele grau.
// Por isso subir de grau custa só a DIFERENÇA — você não paga de novo o que já pagou.
// Treinado(1) -> Adepto(3) custa 2. Adepto(3) -> Especialista(6) custa 3. E assim por diante.
export function custoParaSubirGrau(grauAtual: number, grauDesejado: number): number {
  const de = GRAUS_TREINO[grauAtual];
  const para = GRAUS_TREINO[grauDesejado];
  if (!de || !para || grauDesejado <= grauAtual) return 0;
  return para.custoTotal - de.custoTotal;
}

// Custo do PRÓXIMO degrau só. É esse número que aparece no botão da ficha.
export function custoDoProximoGrau(grauAtual: number): number | null {
  if (grauAtual >= GRAUS_TREINO.length - 1) return null; // já é Mestre
  return custoParaSubirGrau(grauAtual, grauAtual + 1);
}

// Quanto essa perícia já consumiu de Pontos de Perícia (= o custoTotal do grau em que ela está).
export function custoJaGasto(grauIndex: number): number {
  const grau = GRAUS_TREINO[grauIndex];
  return grau ? grau.custoTotal : 0;
}

// Soma do que a ficha inteira já gastou, para bater com os Pontos de Perícia disponíveis.
export function totalGastoEmPericias(graus: Record<string, number>): number {
  return Object.values(graus).reduce((soma, g) => soma + custoJaGasto(g), 0);
}

// Pontos de Perícia com que o personagem começa.
// A Origem sempre dá 2 perícias treinadas de graça — e como Treinado custa 1, isso é
// exatamente 2 Pontos de Perícia. A Classe soma os dela por cima (Andarilho leva 6).
export const PONTOS_PERICIA_DA_ORIGEM = 2;

export function pontosDePericiaIniciais(pontosDaClasse: number): number {
  return PONTOS_PERICIA_DA_ORIGEM + pontosDaClasse;
}

// Teto de Grau permitido pelo nível — NÃO dá bônus nenhum, só limita até onde dá pra comprar.
export function grauMaximoPorNivel(nivel: number): number {
  if (nivel >= 16) return 4; // Mestre
  if (nivel >= 11) return 3; // Especialista
  if (nivel >= 6) return 2; // Adepto
  return 1; // Treinado
}
