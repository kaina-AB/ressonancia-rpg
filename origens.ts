// Fonte única de verdade das 6 Origens do Ressonância RPG.
// Sempre que uma regra nova mexer em Origem, atualizar aqui — é o que o site (e o livro) leem.

export type TierRiqueza = "alto" | "medio-alto" | "medio" | "baixo" | "na";

export interface Origem {
  id: string;
  nome: string;
  descricao: string;
  periciasTreinadasGratis: number; // sempre 2, mas fica explícito por Origem
  tierRiqueza: TierRiqueza;
  creditosIniciais: string; // fórmula em texto, ex.: "80 + 2d6×5"
  itemSimbolico?: string; // só Manifestação usa isso no lugar de Créditos
}

export const ORIGENS: Origem[] = [
  {
    id: "desperto-recente",
    nome: "Desperto Recente",
    descricao:
      "Não vem de família ligada à Ressonância, não fez Pacto — simplesmente sobreviveu a algo que despertou um Eco nela. Começa descobrindo o próprio poder junto do jogador.",
    periciasTreinadasGratis: 2,
    tierRiqueza: "medio",
    creditosIniciais: "40 + 2d6×5 (na moeda local de onde vive, não em Marcos)",
  },
  {
    id: "linhagem-ressonante",
    nome: "Linhagem Ressonante",
    descricao: "Vem de uma família com tradição de Ressonância — geração após geração lidando com Eco.",
    periciasTreinadasGratis: 2,
    tierRiqueza: "alto",
    creditosIniciais: "80 + 2d6×5",
  },
  {
    id: "zona-de-devaneio",
    nome: "Nascido numa Zona de Devaneio",
    descricao: "Cresceu numa Zona de Devaneio — comunidade isolada, com pouco acesso a bens comuns de fora dela.",
    periciasTreinadasGratis: 2,
    tierRiqueza: "baixo",
    creditosIniciais: "15 + 1d6×5",
  },
  {
    id: "sobrevivente-pacto-maldicao",
    nome: "Sobrevivente de Pacto ou Maldição",
    descricao: "Pagou (ou ainda paga) o preço de um Pacto ou Maldição — normalmente perdeu recursos por causa disso.",
    periciasTreinadasGratis: 2,
    tierRiqueza: "baixo",
    creditosIniciais: "15 + 1d6×5",
  },
  {
    id: "manifestacao",
    nome: "Manifestação",
    descricao:
      "É, literalmente, um Eco — a expressão viva de um Conceito. Duas variantes possíveis, mesma mecânica: Nata (nasceu assim) ou Póstuma/Retornado (morreu e a Ressonância da própria morte a trouxe de volta como Eco).",
    periciasTreinadasGratis: 2,
    tierRiqueza: "na",
    creditosIniciais: "—",
    itemSimbolico: "1 Item Simbólico único, escolhido com o Mestre, no lugar de Créditos",
  },
  {
    id: "devoto",
    nome: "Devoto",
    descricao: "Sustentado por uma fé/instituição religiosa, com acesso a um Eco da Fé paralelo (Milagre).",
    periciasTreinadasGratis: 2,
    tierRiqueza: "medio-alto",
    creditosIniciais: "60 + 2d6×5",
  },
];
