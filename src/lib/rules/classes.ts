// As 3 Classes — cada uma com UM pilar mecânico próprio (ver doc "Andarilho Prós/Contras").

export interface Classe {
  id: string;
  nome: string;
  pilar: string;
  preco: string;
  pontosPericiaCriacao: number; // além dos 2 de Origem
  itemGratisClasse: string;
}

export const CLASSES: Classe[] = [
  {
    id: "bastiao",
    nome: "Bastião",
    pilar: "Combate sem depender de Carga: bônus fixo de Vida Máxima/Defesa, luta bem mesmo com Reserva zerada.",
    preco: "Menos Pontos de Concepção efetivos; só 2 Pontos de Perícia extra na criação.",
    pontosPericiaCriacao: 2,
    itemGratisClasse: "1 arma marcial simples",
  },
  {
    id: "ressonante",
    nome: "Ressonante",
    pilar: "Poder de Eco: upgrades de Concepção mais baratos/rápidos — é quem empurra o Eco ao limite.",
    preco: "Vida Máxima mais baixa; só 2 Pontos de Perícia extra na criação.",
    pontosPericiaCriacao: 2,
    itemGratisClasse: "1 foco/catalisador cosmético do próprio Eco",
  },
  {
    id: "andarilho",
    nome: "Andarilho",
    pilar: "Perícia: 6 Pontos de Perícia extra na criação e acesso preferencial a Trilhas de utilidade/social.",
    preco: "Sem bônus de Vida/Defesa do Bastião nem desconto de Concepção do Ressonante — Eco cresce no ritmo padrão.",
    pontosPericiaCriacao: 6,
    itemGratisClasse: "1 kit de ferramentas (Investigação, Ofício ou Social, à escolha)",
  },
];
