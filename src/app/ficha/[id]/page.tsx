"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";
import {
  PERICIAS,
  GRAUS_TREINO,
  bonusDoGrau,
  totalDaPericia,
  custoDoProximoGrau,
  custoJaGasto,
  totalGastoEmPericias,
  grauMaximoPorNivel,
  pontosDePericiaIniciais,
  type Atributo,
} from "@/lib/rules/pericias";
import { tierDoNivel, tetoAtual, type Atributos } from "@/lib/rules/formulas";
import { derivadosDe, normalizarFicha, type FichaSalva, type ItemInventario } from "@/lib/ficha";
import { RodaDeAtributos } from "@/components/RodaDeAtributos";

interface PersonagemRow {
  id: string;
  nome: string;
  origem_id: string;
  classe_id: string;
  nivel: number;
  ficha: unknown;
}

const SECOES = [
  { id: "resumo", nome: "Resumo" },
  { id: "pericias", nome: "Perícias" },
  { id: "inventario", nome: "Inventário" },
  { id: "anotacoes", nome: "Anotações" },
] as const;
type SecaoId = (typeof SECOES)[number]["id"];

const SIGLA: Record<Atributo, string> = {
  forca: "FOR",
  destreza: "DES",
  constituicao: "CON",
  inteligencia: "INT",
  carga: "CAR",
  carisma: "CRM",
};

export default function PaginaFicha({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, carregando: carregandoUser } = useUser();

  const [personagem, setPersonagem] = useState<PersonagemRow | null>(null);
  const [ficha, setFicha] = useState<FichaSalva | null>(null);
  const [secao, setSecao] = useState<SecaoId>("resumo");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sujo, setSujo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!carregandoUser && !user) router.push("/login");
  }, [carregandoUser, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelado = false;
    (async () => {
      const { data, error } = await supabase
        .from("personagens")
        .select("id, nome, origem_id, classe_id, nivel, ficha")
        .eq("id", params.id)
        .single();
      if (cancelado) return;
      if (error) {
        setErro(error.message);
      } else if (data) {
        const classe = CLASSES.find((c) => c.id === data.classe_id);
        setPersonagem(data as PersonagemRow);
        setFicha(normalizarFicha(data.ficha, pontosDePericiaIniciais(classe?.pontosPericiaCriacao ?? 2)));
      }
      setCarregando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [user, params.id]);

  const atualizar = useCallback((mudanca: (f: FichaSalva) => FichaSalva) => {
    setFicha((f) => (f ? mudanca(f) : f));
    setSujo(true);
  }, []);

  async function salvar() {
    if (!ficha || !personagem) return;
    setSalvando(true);
    const { error } = await supabase
      .from("personagens")
      .update({ ficha, atualizado_em: new Date().toISOString() })
      .eq("id", personagem.id);
    setSalvando(false);
    if (error) setErro(`Não deu pra salvar: ${error.message}`);
    else setSujo(false);
  }

  if (carregando) {
    return <Aviso texto="Carregando a ficha..." />;
  }
  if (erro && !personagem) {
    return <Aviso texto={`Não achei essa ficha. (${erro})`} />;
  }
  if (!personagem || !ficha) {
    return <Aviso texto="Não achei essa ficha." />;
  }

  const origem = ORIGENS.find((o) => o.id === personagem.origem_id);
  const classe = CLASSES.find((c) => c.id === personagem.classe_id);
  const derivados = derivadosDe(ficha.atributos, personagem.nivel);
  const gasto = totalGastoEmPericias(ficha.pericias);
  const pontosLivres = ficha.pontosDePericia - gasto;

  return (
    <main className="max-w-page mx-auto px-5 md:px-8 py-8 md:py-10 pb-28">
      {/* cabeçalho da ficha */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/personagens" className="text-dim text-[13px] hover:text-parchment transition-colors">
            ← Meus personagens
          </Link>
          <h1 className="font-display font-bold text-parchment text-[28px] md:text-[34px] tracking-tight mt-1.5">
            {personagem.nome}
          </h1>
          <p className="text-dim text-[13px] mt-1">
            Nível {personagem.nivel} · Tier {tierDoNivel(personagem.nivel)} · {classe?.nome ?? personagem.classe_id} ·{" "}
            {origem?.nome ?? personagem.origem_id}
          </p>
        </div>
      </div>

      {/* navegador de seções */}
      <div className="flex gap-1.5 mt-6 overflow-x-auto pb-1 sticky top-[74px] z-30 bg-ink/95 backdrop-blur-sm -mx-1 px-1 py-1.5">
        {SECOES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSecao(s.id)}
            className={`px-4 py-2 rounded-lg text-[13.5px] font-display font-semibold whitespace-nowrap transition-colors ${
              secao === s.id
                ? "bg-gold/15 text-lilac border border-gold/40"
                : "text-muted border border-transparent hover:text-parchment hover:bg-white/[0.04]"
            }`}
          >
            {s.nome}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {secao === "resumo" && (
          <SecaoResumo ficha={ficha} derivados={derivados} atualizar={atualizar} nivel={personagem.nivel} />
        )}
        {secao === "pericias" && (
          <SecaoPericias
            ficha={ficha}
            atualizar={atualizar}
            nivel={personagem.nivel}
            pontosLivres={pontosLivres}
            gasto={gasto}
          />
        )}
        {secao === "inventario" && (
          <SecaoInventario ficha={ficha} atualizar={atualizar} pesoMax={derivados.pesoMax} />
        )}
        {secao === "anotacoes" && <SecaoAnotacoes ficha={ficha} atualizar={atualizar} />}
      </div>

      {/* barra de salvar */}
      {(sujo || salvando) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/25 bg-modal/95 backdrop-blur-sm">
          <div className="max-w-page mx-auto px-5 md:px-8 py-3.5 flex items-center justify-between gap-4">
            <span className="text-[13px] text-muted">Tem mudança que ainda não foi salva.</span>
            <button className="btn-primary" onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
      {erro && personagem && <p className="text-blood text-sm mt-4">{erro}</p>}
    </main>
  );
}

/* ============================ RESUMO ============================ */
function SecaoResumo({
  ficha,
  derivados,
  atualizar,
  nivel,
}: {
  ficha: FichaSalva;
  derivados: ReturnType<typeof derivadosDe>;
  atualizar: (m: (f: FichaSalva) => FichaSalva) => void;
  nivel: number;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="lg:w-[380px] shrink-0 space-y-5">
        <div className="card flex justify-center">
          <RodaDeAtributos atributos={ficha.atributos} tamanho={330} teto={tetoAtual(ficha.vezesEstourado)} />
        </div>
        <div className="card">
          <div className="label mb-3">Teto de Atributo</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-2xl text-parchment tabular-nums">
                {tetoAtual(ficha.vezesEstourado)}
              </div>
              <div className="text-[12px] text-dim mt-1">
                estourado {ficha.vezesEstourado}× (+3 cada)
              </div>
            </div>
            <div className="flex gap-2">
              <BotaoMini
                texto="−"
                onClick={() =>
                  atualizar((f) => ({ ...f, vezesEstourado: Math.max(0, f.vezesEstourado - 1) }))
                }
              />
              <BotaoMini texto="+" onClick={() => atualizar((f) => ({ ...f, vezesEstourado: f.vezesEstourado + 1 }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        <div className="card space-y-5">
          <Barra
            rotulo="Vida"
            atual={ficha.vidaAtual}
            maximo={derivados.vida}
            cor="#E5484D"
            onMudar={(v) => atualizar((f) => ({ ...f, vidaAtual: v }))}
          />
          <Barra
            rotulo="Reserva de Carga"
            atual={ficha.cargaAtual}
            maximo={derivados.reserva}
            cor="#9B5CF6"
            marcador={derivados.limiteCarga}
            legendaMarcador={`no máximo ${derivados.limiteCarga} de Carga numa mesma ação`}
            onMudar={(v) => atualizar((f) => ({ ...f, cargaAtual: v }))}
          />
        </div>

        <div className="card">
          <div className="label mb-3.5">Recursos</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Recurso nome="Vida Máxima" valor={derivados.vida} formula="10 + CON×4" />
            <Recurso nome="Defesa Passiva" valor={derivados.defesa} formula="10 + CON" />
            <Recurso nome="Reserva de Carga" valor={derivados.reserva} formula="(INT + CAR)×2" />
            <Recurso nome="Limite por ação" valor={derivados.limiteCarga} formula="CAR + trilha" />
            <Recurso nome="Peso Máximo" valor={derivados.pesoMax} formula="FOR×2 + mochilas" />
            <Recurso nome="Concepção" valor={derivados.concepcao} formula={`2 + nível (${nivel})`} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ PERÍCIAS ============================ */
function SecaoPericias({
  ficha,
  atualizar,
  nivel,
  pontosLivres,
  gasto,
}: {
  ficha: FichaSalva;
  atualizar: (m: (f: FichaSalva) => FichaSalva) => void;
  nivel: number;
  pontosLivres: number;
  gasto: number;
}) {
  const tetoGrau = grauMaximoPorNivel(nivel);
  const lista = useMemo(
    () =>
      PERICIAS.map((p) => {
        const grau = ficha.pericias[p.id] ?? 0;
        const valorAtributo = ficha.atributos[p.atributo as keyof Atributos];
        return {
          ...p,
          grau,
          valorAtributo,
          bonus: bonusDoGrau(grau),
          total: totalDaPericia(valorAtributo, grau),
          custoProximo: custoDoProximoGrau(grau),
        };
      }),
    [ficha]
  );

  function subir(id: string, custo: number) {
    if (custo > pontosLivres) return;
    atualizar((f) => ({ ...f, pericias: { ...f.pericias, [id]: (f.pericias[id] ?? 0) + 1 } }));
  }
  function descer(id: string) {
    atualizar((f) => ({ ...f, pericias: { ...f.pericias, [id]: Math.max(0, (f.pericias[id] ?? 0) - 1) } }));
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="label mb-1.5">Pontos de Perícia</div>
          <div className="font-display text-2xl tabular-nums text-lilac">
            {pontosLivres}
            <span className="text-dim text-sm"> livres de {ficha.pontosDePericia}</span>
          </div>
          <div className="text-[12px] text-dim mt-1">já gastos: {gasto}</div>
        </div>
        <div className="text-[12.5px] text-muted max-w-[380px] leading-relaxed">
          Subir de grau custa só a <span className="text-lilac">diferença</span> — o que já foi pago fica pago.
          Nível {nivel} deixa comprar até{" "}
          <span className="text-parchment">{GRAUS_TREINO[tetoGrau].grau}</span>.
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_64px_150px_60px_176px] gap-3 px-4 py-3 border-b border-white/[0.07]">
          <span className="label">Perícia</span>
          <span className="label text-center">Atrib.</span>
          <span className="label">Grau</span>
          <span className="label text-center">Total</span>
          <span className="label text-right">Subir</span>
        </div>

        {lista.map((p) => {
          const noTeto = p.grau >= tetoGrau;
          const podeSubir = p.custoProximo !== null && !noTeto && p.custoProximo <= pontosLivres;
          return (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_64px_150px_60px_176px] gap-x-3 gap-y-2 px-4 py-3
                border-b border-white/[0.05] last:border-b-0 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="text-[14.5px] text-parchment">{p.nome}</div>
                <div className="text-[11px] text-dim font-mono sm:hidden mt-0.5">
                  {SIGLA[p.atributo]} {p.valorAtributo} · {GRAUS_TREINO[p.grau].grau}
                  {p.bonus > 0 ? ` +${p.bonus}` : ""}
                </div>
              </div>

              <div className="hidden sm:block text-center font-mono text-[13px] text-muted">
                {SIGLA[p.atributo]} {p.valorAtributo}
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span
                  className={`text-[12.5px] font-display font-semibold ${p.grau > 0 ? "text-trained" : "text-dim"}`}
                >
                  {GRAUS_TREINO[p.grau].grau}
                </span>
                {p.bonus > 0 && <span className="font-mono text-[12px] text-lilac">+{p.bonus}</span>}
              </div>

              <div className="font-display text-lg text-lilac tabular-nums text-right sm:text-center">
                {p.total}
              </div>

              <div className="flex items-center justify-end gap-1.5 col-span-2 sm:col-span-1">
                {p.grau > 0 && (
                  <button
                    onClick={() => descer(p.id)}
                    title="Voltar um grau (devolve os pontos)"
                    className="w-7 h-7 shrink-0 rounded-md border border-white/12 text-dim hover:text-parchment hover:border-white/25 transition-colors text-sm"
                  >
                    −
                  </button>
                )}
                {p.custoProximo === null ? (
                  <span className="text-[11.5px] text-dim font-mono whitespace-nowrap">no máximo</span>
                ) : noTeto ? (
                  <span
                    className="text-[11.5px] text-dim font-mono whitespace-nowrap"
                    title="Precisa subir de nível pra destravar o próximo grau"
                  >
                    trava do nível
                  </span>
                ) : (
                  <button
                    onClick={() => subir(p.id, p.custoProximo!)}
                    disabled={!podeSubir}
                    className="px-2.5 h-7 rounded-md border border-gold/45 text-lilac text-[12px] font-mono
                      whitespace-nowrap hover:bg-gold/12 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title={`${GRAUS_TREINO[p.grau].grau} → ${GRAUS_TREINO[p.grau + 1].grau}: ${GRAUS_TREINO[p.grau + 1].custoTotal} no total, já pagou ${custoJaGasto(p.grau)}`}
                  >
                    +1 grau · {p.custoProximo} pt
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="label mb-3">Escada de treino</div>
        <div className="flex flex-wrap gap-2">
          {GRAUS_TREINO.map((g, i) => (
            <div
              key={g.grau}
              className={`rounded-lg px-3 py-2 border text-[12.5px] ${
                i <= tetoGrau ? "border-gold/30 bg-gold/[0.07]" : "border-white/[0.07] bg-elevated opacity-50"
              }`}
            >
              <div className="font-display font-semibold text-parchment">{g.grau}</div>
              <div className="font-mono text-[11px] text-dim mt-0.5">
                {g.custoTotal} pt no total · {g.bonus > 0 ? `+${g.bonus}` : "sem bônus"}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-dim mt-3.5 leading-relaxed">
          O número da coluna Total é o que entra no teste: valor do atributo + bônus do grau. O Tier do nível não
          soma nada — ele só decide até que grau você pode comprar.
        </p>
      </div>
    </div>
  );
}

/* ============================ INVENTÁRIO ============================ */
function SecaoInventario({
  ficha,
  atualizar,
  pesoMax,
}: {
  ficha: FichaSalva;
  atualizar: (m: (f: FichaSalva) => FichaSalva) => void;
  pesoMax: number;
}) {
  const [nome, setNome] = useState("");
  const [peso, setPeso] = useState("1");
  const [qtd, setQtd] = useState("1");

  const pesoTotal = ficha.itens.reduce((s, i) => s + i.peso * i.quantidade, 0);
  const excedeu = pesoTotal > pesoMax;

  function adicionar() {
    if (!nome.trim()) return;
    const novo: ItemInventario = {
      id: `${Date.now()}`,
      nome: nome.trim(),
      peso: Number(peso) || 0,
      quantidade: Math.max(1, Number(qtd) || 1),
    };
    atualizar((f) => ({ ...f, itens: [...f.itens, novo] }));
    setNome("");
    setPeso("1");
    setQtd("1");
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-baseline justify-between mb-2">
          <span className="label">Peso carregado</span>
          <span className="font-mono text-sm">
            <span className={excedeu ? "text-blood" : "text-parchment"}>{pesoTotal}</span>
            <span className="text-dim"> / {pesoMax}</span>
          </span>
        </div>
        <div className="stat-bar-track">
          <div
            className="stat-bar-fill"
            style={{
              width: `${Math.min(100, pesoMax ? (pesoTotal / pesoMax) * 100 : 0)}%`,
              background: excedeu ? "#E5484D" : "#9B5CF6",
            }}
          />
        </div>
        {excedeu && <p className="text-[12.5px] text-blood mt-2">Acima do Peso Máximo (FOR×2 + mochilas).</p>}
      </div>

      <div className="card !p-0 overflow-hidden">
        {ficha.itens.length === 0 && (
          <p className="text-dim text-sm px-4 py-8 text-center">Mochila vazia por enquanto.</p>
        )}
        {ficha.itens.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] text-parchment truncate">{item.nome}</div>
              <div className="text-[11.5px] text-dim font-mono mt-0.5">
                {item.quantidade}× · {item.peso} de peso cada · {item.peso * item.quantidade} no total
              </div>
            </div>
            <button
              onClick={() => atualizar((f) => ({ ...f, itens: f.itens.filter((i) => i.id !== item.id) }))}
              className="text-dim hover:text-blood transition-colors text-[13px] shrink-0"
              title="Tirar da mochila"
            >
              remover
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="label mb-3">Colocar item</div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            className="input flex-1"
            placeholder="Nome do item"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionar()}
          />
          <input
            className="input w-full sm:w-24"
            type="number"
            min={0}
            placeholder="Peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
          <input
            className="input w-full sm:w-20"
            type="number"
            min={1}
            placeholder="Qtd"
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
          />
          <button className="btn-primary shrink-0" onClick={adicionar}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================ ANOTAÇÕES ============================ */
function SecaoAnotacoes({
  ficha,
  atualizar,
}: {
  ficha: FichaSalva;
  atualizar: (m: (f: FichaSalva) => FichaSalva) => void;
}) {
  return (
    <div className="card">
      <label className="label block mb-3" htmlFor="anotacoes">
        Anotações da mesa
      </label>
      <textarea
        id="anotacoes"
        className="input w-full min-h-[320px] leading-relaxed resize-y"
        placeholder="História, contatos, pistas, o que o Mestre falou e você não quer esquecer..."
        value={ficha.anotacoes}
        onChange={(e) => atualizar((f) => ({ ...f, anotacoes: e.target.value }))}
      />
    </div>
  );
}

/* ============================ peças pequenas ============================ */
function Barra({
  rotulo,
  atual,
  maximo,
  cor,
  marcador,
  legendaMarcador,
  onMudar,
}: {
  rotulo: string;
  atual: number;
  maximo: number;
  cor: string;
  marcador?: number;
  legendaMarcador?: string;
  onMudar: (v: number) => void;
}) {
  const pct = maximo > 0 ? Math.max(0, Math.min(100, (atual / maximo) * 100)) : 0;
  const passo = (d: number) => onMudar(Math.max(0, Math.min(maximo, atual + d)));
  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <span className="label">{rotulo}</span>
        <div className="flex items-center gap-2">
          <BotaoMini texto="−5" onClick={() => passo(-5)} />
          <BotaoMini texto="−1" onClick={() => passo(-1)} />
          <span className="font-mono text-[15px] w-[68px] text-center">
            <span className="text-parchment">{atual}</span>
            <span className="text-dim"> / {maximo}</span>
          </span>
          <BotaoMini texto="+1" onClick={() => passo(1)} />
          <BotaoMini texto="+5" onClick={() => passo(5)} />
        </div>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: cor }} />
        {marcador !== undefined && maximo > 0 && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-warn"
            style={{ left: `${Math.min(100, (marcador / maximo) * 100)}%` }}
          />
        )}
      </div>
      {legendaMarcador && <div className="text-[11px] text-warn font-mono mt-1.5">▏ {legendaMarcador}</div>}
    </div>
  );
}

function BotaoMini({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 h-7 rounded-md border border-white/12 text-[12px] font-mono text-muted
        hover:text-parchment hover:border-white/25 transition-colors"
    >
      {texto}
    </button>
  );
}

function Recurso({ nome, valor, formula }: { nome: string; valor: number; formula: string }) {
  return (
    <div className="bg-elevated rounded-lg px-3.5 py-3">
      <div className="font-display text-2xl text-parchment leading-none tabular-nums">{valor}</div>
      <div className="text-[11.5px] text-muted mt-1.5">{nome}</div>
      <div className="text-[10px] text-dim font-mono mt-0.5">{formula}</div>
    </div>
  );
}

function Aviso({ texto }: { texto: string }) {
  return (
    <main className="max-w-page mx-auto px-5 md:px-8 py-20">
      <p className="text-muted">{texto}</p>
    </main>
  );
}
