import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";
import { PERICIAS, GRAUS_TREINO, PONTOS_PERICIA_DA_ORIGEM } from "@/lib/rules/pericias";
import { PONTOS_ATRIBUTOS_CRIACAO, PORTE } from "@/lib/rules/formulas";

// Esta página lê direto de src/lib/rules — se a regra mudar lá, muda aqui sozinho.
// É por isso que ela não tem texto solto repetindo número nenhum.

const SIGLA: Record<string, string> = {
  forca: "FOR",
  destreza: "DES",
  constituicao: "CON",
  inteligencia: "INT",
  carga: "CAR",
  carisma: "CRM",
};

const FORMULAS = [
  { nome: "Vida Máxima", formula: "10 + CON × 4" },
  { nome: "Defesa Passiva", formula: "10 + CON" },
  { nome: "Defesa Ativa", formula: "Defesa Passiva + Carga investida na reação" },
  { nome: "Reserva de Carga", formula: "(INT + CAR) × 2" },
  { nome: "Limite de Carga por ação", formula: "CAR + bônus de Trilha" },
  { nome: "Peso Máximo", formula: "FOR × 2 + mochilas" },
  { nome: "Pontos de Concepção", formula: "2 + Nível" },
  { nome: "Teto de Atributo", formula: "20, +3 a cada vez que estoura" },
  { nome: "Dano de Fusão", formula: "arred(maior dano base × 1,5) + Carga total − arredBaixo(CON do alvo ÷ 2)" },
];

export default function Regras() {
  return (
    <main className="max-w-page mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-display font-bold text-parchment text-[26px] md:text-[34px] tracking-tight">
        Regras
      </h1>
      <p className="text-muted mt-2 max-w-[560px] leading-relaxed">
        O que a ficha usa pra calcular. Tudo aqui sai do mesmo código que a ficha lê — não tem
        versão desatualizada rolando por aí.
      </p>

      {/* fórmulas */}
      <Bloco titulo="Contas" descricao="Sai automático na ficha, você não precisa fazer na mão.">
        <div className="grid sm:grid-cols-2 gap-2.5">
          {FORMULAS.map((f) => (
            <div key={f.nome} className="bg-elevated rounded-lg px-4 py-3">
              <div className="text-[14px] text-parchment">{f.nome}</div>
              <div className="font-mono text-[12.5px] text-lilac mt-1">{f.formula}</div>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-dim mt-4">
          Na criação você distribui <span className="text-parchment">{PONTOS_ATRIBUTOS_CRIACAO} pontos</span>{" "}
          entre os seis atributos.
        </p>
      </Bloco>

      {/* perícias */}
      <Bloco
        titulo="Perícias"
        descricao="O número do teste é o valor do atributo mais o bônus do grau daquela perícia. O Tier do nível não soma nada — ele só limita até onde dá pra comprar."
      >
        <div className="flex flex-wrap gap-2 mb-5">
          {GRAUS_TREINO.map((g, i) => (
            <div key={g.grau} className="rounded-lg px-3.5 py-2.5 border border-gold/25 bg-gold/[0.06]">
              <div className="font-display font-semibold text-parchment text-[14px]">{g.grau}</div>
              <div className="font-mono text-[11.5px] text-dim mt-1">
                {g.custoTotal} pt acumulado{g.bonus > 0 ? ` · +${g.bonus} no teste` : " · sem bônus"}
              </div>
              {i > 0 && (
                <div className="font-mono text-[11px] text-lilac mt-0.5">
                  subir do anterior: {g.custoTotal - GRAUS_TREINO[i - 1].custoTotal} pt
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted leading-relaxed mb-5">
          O custo é acumulado: quem já é Treinado paga só a diferença pra virar Adepto. Você começa com{" "}
          {PONTOS_PERICIA_DA_ORIGEM} Pontos de Perícia da Origem mais os da Classe.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PERICIAS.map((p) => (
            <div key={p.id} className="bg-elevated rounded-lg px-3.5 py-2.5 flex items-center justify-between">
              <span className="text-[14px] text-parchment">{p.nome}</span>
              <span className="font-mono text-[11.5px] text-dim">{SIGLA[p.atributo]}</span>
            </div>
          ))}
        </div>
      </Bloco>

      {/* origens */}
      <Bloco titulo="Origens" descricao="De onde o personagem veio. Todas dão 2 perícias treinadas de graça.">
        <div className="grid md:grid-cols-2 gap-3">
          {ORIGENS.map((o) => (
            <div key={o.id} className="bg-elevated rounded-lg px-4 py-4">
              <div className="font-display font-semibold text-parchment text-[15px]">{o.nome}</div>
              <p className="text-[13px] text-muted leading-relaxed mt-2">{o.descricao}</p>
              <div className="font-mono text-[11.5px] text-lilac mt-3">
                {o.itemSimbolico ?? `Créditos iniciais: ${o.creditosIniciais}`}
              </div>
            </div>
          ))}
        </div>
      </Bloco>

      {/* classes */}
      <Bloco titulo="Classes" descricao="Cada uma tem um pilar mecânico e o preço que vem junto.">
        <div className="grid md:grid-cols-3 gap-3">
          {CLASSES.map((c) => (
            <div key={c.id} className="bg-elevated rounded-lg px-4 py-4">
              <div className="font-display font-semibold text-parchment text-[15px]">{c.nome}</div>
              <p className="text-[13px] text-muted leading-relaxed mt-2">{c.pilar}</p>
              <p className="text-[12.5px] text-dim leading-relaxed mt-2.5">{c.preco}</p>
              <div className="font-mono text-[11.5px] text-lilac mt-3">
                +{c.pontosPericiaCriacao} Pontos de Perícia · {c.itemGratisClasse}
              </div>
            </div>
          ))}
        </div>
      </Bloco>

      {/* porte */}
      <Bloco titulo="Porte de Dano Direto" descricao="O tamanho da Aplicação e o que ela custa de Concepção.">
        <div className="grid sm:grid-cols-3 gap-2.5">
          {Object.entries(PORTE).map(([id, p]) => (
            <div key={id} className="bg-elevated rounded-lg px-4 py-3.5">
              <div className="font-display font-semibold text-parchment text-[15px] capitalize">{id}</div>
              <div className="font-mono text-[12.5px] text-lilac mt-1.5">
                dano base {p.danoBase} · {p.custoConcepcao} de Concepção
              </div>
            </div>
          ))}
        </div>
      </Bloco>
    </main>
  );
}

function Bloco({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="font-display font-semibold text-parchment text-[20px] tracking-tight">{titulo}</h2>
      <p className="text-[13.5px] text-dim mt-1.5 mb-4 max-w-[620px] leading-relaxed">{descricao}</p>
      <div className="card">{children}</div>
    </section>
  );
}
