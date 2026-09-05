"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";
import { pontosDePericiaIniciais } from "@/lib/rules/pericias";
import {
  Atributos,
  PONTOS_ATRIBUTOS_CRIACAO,
  ATRIBUTO_MIN,
  ATRIBUTO_MAX_BASE,
  somaAtributos,
} from "@/lib/rules/formulas";
import { ATRIBUTOS_ZERADOS, derivadosDe, fichaNova } from "@/lib/ficha";
import { supabase } from "@/lib/supabaseClient";
import { RodaDeAtributos } from "@/components/RodaDeAtributos";
import { CartaoEscolha, LinhaDetalhe } from "@/components/CartaoEscolha";

const ETAPAS = ["Nome", "Atributos", "Origem", "Classe", "Revisar"] as const;

const ATRIBUTO_LABELS: { key: keyof Atributos; nome: string; sigla: string; usadoEm: string }[] = [
  { key: "forca", nome: "Força", sigla: "FOR", usadoEm: "Peso Máximo · Atletismo, Luta" },
  { key: "destreza", nome: "Destreza", sigla: "DES", usadoEm: "Acrobacia, Furtividade, Pontaria" },
  { key: "constituicao", nome: "Constituição", sigla: "CON", usadoEm: "Vida Máxima · Defesa Passiva" },
  { key: "inteligencia", nome: "Inteligência", sigla: "INT", usadoEm: "Reserva de Carga" },
  { key: "carga", nome: "Carga", sigla: "CAR", usadoEm: "Reserva e Limite de Carga por ação" },
  { key: "carisma", nome: "Carisma", sigla: "CRM", usadoEm: "Diplomacia, Enganação, Intimidação" },
];

export default function CriarPersonagem() {
  const router = useRouter();
  const { user, carregando: carregandoUser } = useUser();

  const [etapa, setEtapa] = useState(0);
  const [nome, setNome] = useState("");
  const [origemId, setOrigemId] = useState<string | null>(null);
  const [classeId, setClasseId] = useState<string | null>(null);
  const [abertoOrigem, setAbertoOrigem] = useState<string | null>(ORIGENS[0].id);
  const [abertoClasse, setAbertoClasse] = useState<string | null>(CLASSES[0].id);
  const [atributos, setAtributos] = useState<Atributos>({ ...ATRIBUTOS_ZERADOS });
  const [emFoco, setEmFoco] = useState<keyof Atributos | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const nivel = 1;

  useEffect(() => {
    if (!carregandoUser && !user) router.push("/login");
  }, [carregandoUser, user, router]);

  const origem = ORIGENS.find((o) => o.id === origemId) ?? null;
  const classe = CLASSES.find((c) => c.id === classeId) ?? null;
  const pontosRestantes = PONTOS_ATRIBUTOS_CRIACAO - somaAtributos(atributos);
  const derivados = useMemo(() => derivadosDe(atributos, nivel), [atributos]);

  function ajustar(key: keyof Atributos, delta: number) {
    setEmFoco(key);
    setAtributos((prev) => {
      const novo = prev[key] + delta;
      if (novo < ATRIBUTO_MIN || novo > ATRIBUTO_MAX_BASE) return prev;
      if (delta > 0 && pontosRestantes <= 0) return prev;
      return { ...prev, [key]: novo };
    });
  }

  const podeAvancar =
    (etapa === 0 && nome.trim().length > 0) ||
    (etapa === 1 && pontosRestantes === 0) ||
    (etapa === 2 && !!origem) ||
    (etapa === 3 && !!classe) ||
    etapa === 4;

  const avisoDaEtapa =
    etapa === 0 && !nome.trim()
      ? "Dá um nome pra ele primeiro."
      : etapa === 1 && pontosRestantes !== 0
        ? pontosRestantes > 0
          ? `Ainda faltam ${pontosRestantes} pontos pra distribuir.`
          : `Passou ${Math.abs(pontosRestantes)} pontos do orçamento.`
        : etapa === 2 && !origem
          ? "Escolhe uma Origem pra seguir."
          : etapa === 3 && !classe
            ? "Escolhe uma Classe pra seguir."
            : null;

  async function salvar() {
    if (!user || !origem || !classe) return;
    setSalvando(true);
    setErro(null);
    const pontos = pontosDePericiaIniciais(classe.pontosPericiaCriacao);
    const { data, error } = await supabase
      .from("personagens")
      .insert({
        user_id: user.id,
        nome: nome.trim(),
        origem_id: origem.id,
        classe_id: classe.id,
        nivel,
        ficha: fichaNova(atributos, pontos),
      })
      .select("id")
      .single();
    setSalvando(false);
    if (error) {
      setErro(`Não deu pra salvar: ${error.message}`);
      return;
    }
    router.push(`/ficha/${data.id}`);
  }

  return (
    <main className="max-w-page mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-display font-bold text-parchment text-[26px] md:text-[32px] tracking-tight">
        Criar personagem
      </h1>
      <p className="text-dim text-sm mt-1.5">Uma etapa por vez. Dá pra voltar quando quiser.</p>

      <Passos etapa={etapa} onIr={(i) => i < etapa && setEtapa(i)} />

      <div className="mt-8">
        {/* ---------- 1. nome ---------- */}
        {etapa === 0 && (
          <div className="card max-w-xl">
            <label className="label block mb-2.5" htmlFor="nome">
              Nome do personagem
            </label>
            <input
              id="nome"
              className="input w-full text-[17px]"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="ex.: Sorina"
              autoFocus
            />
            <p className="text-[13px] text-dim mt-3 leading-relaxed">
              Só o nome por enquanto. História, aparência e anotações entram depois, na própria ficha.
            </p>
          </div>
        )}

        {/* ---------- 2. atributos ---------- */}
        {etapa === 1 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[380px] shrink-0 lg:sticky lg:top-[100px] lg:self-start">
              <div className="card flex flex-col items-center">
                <RodaDeAtributos atributos={atributos} destaque={emFoco} tamanho={320} />
                <div className="w-full mt-4 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                  <span className="label">Pontos restantes</span>
                  <span
                    className={`font-display text-2xl tabular-nums ${
                      pontosRestantes === 0 ? "text-trained" : pontosRestantes < 0 ? "text-blood" : "text-lilac"
                    }`}
                  >
                    {pontosRestantes}
                    <span className="text-dim text-sm"> / {PONTOS_ATRIBUTOS_CRIACAO}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2.5">
              {ATRIBUTO_LABELS.map(({ key, nome: nomeAtr, sigla, usadoEm }) => (
                <div
                  key={key}
                  className="card !p-4 flex items-center justify-between gap-4"
                  onMouseEnter={() => setEmFoco(key)}
                  onMouseLeave={() => setEmFoco(null)}
                >
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-parchment text-[15px]">
                      {nomeAtr} <span className="text-dim font-mono text-xs ml-1">{sigla}</span>
                    </div>
                    <div className="text-[12px] text-dim mt-0.5 truncate">{usadoEm}</div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <BotaoAjuste
                      sinal="−"
                      onClick={() => ajustar(key, -1)}
                      desabilitado={atributos[key] <= ATRIBUTO_MIN}
                      titulo={`Diminuir ${nomeAtr}`}
                    />
                    <span className="w-8 text-center font-display text-xl tabular-nums">
                      {atributos[key]}
                    </span>
                    <BotaoAjuste
                      sinal="+"
                      onClick={() => ajustar(key, 1)}
                      desabilitado={pontosRestantes <= 0 || atributos[key] >= ATRIBUTO_MAX_BASE}
                      titulo={`Aumentar ${nomeAtr}`}
                    />
                  </div>
                </div>
              ))}

              <div className="card !p-4 mt-4">
                <div className="label mb-3">O que isso já vale</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <Derivado nome="Vida Máxima" valor={derivados.vida} />
                  <Derivado nome="Defesa Passiva" valor={derivados.defesa} />
                  <Derivado nome="Reserva de Carga" valor={derivados.reserva} />
                  <Derivado nome="Limite por ação" valor={derivados.limiteCarga} />
                  <Derivado nome="Peso Máximo" valor={derivados.pesoMax} />
                  <Derivado nome="Concepção" valor={derivados.concepcao} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- 3. origem ---------- */}
        {etapa === 2 && (
          <div className="max-w-2xl space-y-2.5">
            {ORIGENS.map((o) => (
              <CartaoEscolha
                key={o.id}
                nome={o.nome}
                resumo={o.itemSimbolico ? "Item Simbólico no lugar de Créditos" : `Créditos: ${o.creditosIniciais}`}
                aberto={abertoOrigem === o.id}
                selecionado={origemId === o.id}
                onAbrir={() => setAbertoOrigem(abertoOrigem === o.id ? null : o.id)}
                onEscolher={() => {
                  setOrigemId(o.id);
                  setEtapa(3);
                }}
              >
                <p className="text-[13.5px] text-muted leading-relaxed">{o.descricao}</p>
                <LinhaDetalhe rotulo="Perícias" valor={`${o.periciasTreinadasGratis} perícias treinadas de graça`} />
                <LinhaDetalhe rotulo="Créditos" valor={o.itemSimbolico ?? o.creditosIniciais} />
              </CartaoEscolha>
            ))}
          </div>
        )}

        {/* ---------- 4. classe ---------- */}
        {etapa === 3 && (
          <div className="max-w-2xl space-y-2.5">
            {CLASSES.map((c) => (
              <CartaoEscolha
                key={c.id}
                nome={c.nome}
                resumo={`${c.pontosPericiaCriacao} Pontos de Perícia extras`}
                aberto={abertoClasse === c.id}
                selecionado={classeId === c.id}
                onAbrir={() => setAbertoClasse(abertoClasse === c.id ? null : c.id)}
                onEscolher={() => {
                  setClasseId(c.id);
                  setEtapa(4);
                }}
              >
                <LinhaDetalhe rotulo="Pilar" valor={c.pilar} />
                <LinhaDetalhe rotulo="Preço" valor={c.preco} />
                <LinhaDetalhe rotulo="Item grátis" valor={c.itemGratisClasse} />
              </CartaoEscolha>
            ))}
          </div>
        )}

        {/* ---------- 5. revisar ---------- */}
        {etapa === 4 && origem && classe && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[380px] shrink-0">
              <div className="card flex flex-col items-center">
                <div className="font-display font-bold text-parchment text-xl mb-1">{nome}</div>
                <div className="text-dim text-[13px] mb-4">
                  Nível {nivel} · {classe.nome} · {origem.nome}
                </div>
                <RodaDeAtributos atributos={atributos} tamanho={300} />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="card">
                <div className="label mb-3">Recursos</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <Derivado nome="Vida Máxima" valor={derivados.vida} />
                  <Derivado nome="Defesa Passiva" valor={derivados.defesa} />
                  <Derivado nome="Reserva de Carga" valor={derivados.reserva} />
                  <Derivado nome="Limite por ação" valor={derivados.limiteCarga} />
                  <Derivado nome="Peso Máximo" valor={derivados.pesoMax} />
                  <Derivado nome="Concepção" valor={derivados.concepcao} />
                </div>
              </div>
              <div className="card">
                <div className="label mb-3">Você começa com</div>
                <LinhaDetalhe
                  rotulo="Perícias"
                  valor={`${pontosDePericiaIniciais(classe.pontosPericiaCriacao)} Pontos de Perícia (2 da Origem + ${classe.pontosPericiaCriacao} da Classe) — dá pra gastar na ficha`}
                />
                <LinhaDetalhe rotulo="Créditos" valor={origem.itemSimbolico ?? origem.creditosIniciais} />
                <LinhaDetalhe rotulo="Item da Classe" valor={classe.itemGratisClasse} />
              </div>
              {erro && <p className="text-blood text-sm">{erro}</p>}
              <button className="btn-primary" onClick={salvar} disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar personagem"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- navegação ---------- */}
      {etapa < 4 && (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/[0.07]">
          <button className="btn-ghost" onClick={() => setEtapa((e) => Math.max(0, e - 1))} disabled={etapa === 0}>
            Voltar
          </button>
          <button className="btn-primary" onClick={() => setEtapa((e) => e + 1)} disabled={!podeAvancar}>
            Continuar
          </button>
          {avisoDaEtapa && <span className="text-[13px] text-dim">{avisoDaEtapa}</span>}
        </div>
      )}
      {etapa === 4 && (
        <div className="mt-8 pt-6 border-t border-white/[0.07]">
          <button className="btn-ghost !px-0" onClick={() => setEtapa(3)}>
            ← Voltar pra Classe
          </button>
        </div>
      )}
    </main>
  );
}

function Passos({ etapa, onIr }: { etapa: number; onIr: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2 mt-7 overflow-x-auto pb-1">
      {ETAPAS.map((rotulo, i) => {
        const feito = i < etapa;
        const atual = i === etapa;
        return (
          <div key={rotulo} className="flex items-center gap-2 flex-1 last:flex-none min-w-0">
            <button
              type="button"
              onClick={() => onIr(i)}
              disabled={!feito}
              className={`flex items-center gap-2 shrink-0 ${feito ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`w-7 h-7 rounded-full grid place-items-center text-[12px] font-display font-semibold ${
                  feito || atual ? "bg-gold text-white" : "bg-elevated text-dim border border-white/10"
                }`}
              >
                {feito ? "✓" : i + 1}
              </span>
              <span
                className={`text-[13px] hidden sm:block ${atual ? "text-parchment" : feito ? "text-muted" : "text-dim"}`}
              >
                {rotulo}
              </span>
            </button>
            {i < ETAPAS.length - 1 && (
              <div className={`h-[2px] flex-1 rounded min-w-[12px] ${feito ? "bg-gold" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BotaoAjuste({
  sinal,
  onClick,
  desabilitado,
  titulo,
}: {
  sinal: string;
  onClick: () => void;
  desabilitado: boolean;
  titulo: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      title={titulo}
      aria-label={titulo}
      className="w-8 h-8 rounded-lg border border-gold/45 text-lilac text-lg leading-none
        hover:bg-gold/12 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
    >
      {sinal}
    </button>
  );
}

function Derivado({ nome, valor }: { nome: string; valor: number }) {
  return (
    <div className="bg-elevated rounded-lg py-3 px-3">
      <div className="font-display text-2xl text-parchment leading-none tabular-nums">{valor}</div>
      <div className="text-[11px] text-muted mt-1.5">{nome}</div>
    </div>
  );
}
