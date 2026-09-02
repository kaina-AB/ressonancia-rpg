"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";
import {
  Atributos,
  PONTOS_ATRIBUTOS_CRIACAO,
  ATRIBUTO_MIN,
  ATRIBUTO_MAX_BASE,
  somaAtributos,
  vidaMaxima,
  defesaPassiva,
  reservaMaximaDeCarga,
  limiteDeCargaPorAcao,
  pontosDeConcepcaoDisponiveis,
  pesoMaximo,
} from "@/lib/rules/formulas";
import { supabase } from "@/lib/supabaseClient";

const ATRIBUTO_LABELS: { key: keyof Atributos; nome: string }[] = [
  { key: "forca", nome: "Força" },
  { key: "destreza", nome: "Destreza" },
  { key: "constituicao", nome: "Constituição" },
  { key: "inteligencia", nome: "Inteligência" },
  { key: "carga", nome: "Carga" },
  { key: "carisma", nome: "Carisma" },
];

export default function CriarPersonagem() {
  const router = useRouter();
  const { user, carregando: carregandoUser } = useUser();
  const [nome, setNome] = useState("");
  const [origemId, setOrigemId] = useState(ORIGENS[0].id);
  const [classeId, setClasseId] = useState(CLASSES[0].id);
  const [nivel] = useState(1);
  const [atributos, setAtributos] = useState<Atributos>({
    forca: 1,
    destreza: 1,
    constituicao: 1,
    inteligencia: 1,
    carga: 1,
    carisma: 1,
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    if (!carregandoUser && !user) router.push("/login");
  }, [carregandoUser, user, router]);

  const origem = ORIGENS.find((o) => o.id === origemId)!;
  const classe = CLASSES.find((c) => c.id === classeId)!;

  const pontosUsados = somaAtributos(atributos);
  const pontosRestantes = PONTOS_ATRIBUTOS_CRIACAO - pontosUsados;

  const derivados = useMemo(
    () => ({
      vida: vidaMaxima(atributos),
      defesa: defesaPassiva(atributos),
      reserva: reservaMaximaDeCarga(atributos),
      limiteCarga: limiteDeCargaPorAcao(atributos),
      pesoMax: pesoMaximo(atributos),
      concepcao: pontosDeConcepcaoDisponiveis(nivel),
    }),
    [atributos, nivel]
  );

  function ajustarAtributo(key: keyof Atributos, delta: number) {
    setAtributos((prev) => {
      const novoValor = prev[key] + delta;
      if (novoValor < ATRIBUTO_MIN || novoValor > ATRIBUTO_MAX_BASE) return prev;
      if (delta > 0 && pontosRestantes <= 0) return prev;
      return { ...prev, [key]: novoValor };
    });
  }

  async function salvar() {
    if (!user) {
      setMensagem("Você precisa entrar na conta antes de salvar.");
      return;
    }
    if (!nome.trim()) {
      setMensagem("Dá um nome pro personagem antes de salvar.");
      return;
    }
    if (pontosRestantes !== 0) {
      setMensagem(`Ainda faltam distribuir ${pontosRestantes} pontos de atributo.`);
      return;
    }
    setSalvando(true);
    setMensagem(null);
    const { error } = await supabase.from("personagens").insert({
      user_id: user.id,
      nome,
      origem_id: origemId,
      classe_id: classeId,
      nivel,
      ficha: { atributos, derivados },
    });
    setSalvando(false);
    setMensagem(error ? `Erro ao salvar: ${error.message}` : "Personagem salvo!");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-gold mb-8">Criar Personagem</h1>

      <div className="card mb-6">
        <label className="label block mb-2">Nome do Personagem</label>
        <input
          className="input w-full"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="ex.: Marina"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <label className="label block mb-2">Origem</label>
          <select
            className="input w-full mb-3"
            value={origemId}
            onChange={(e) => setOrigemId(e.target.value)}
          >
            {ORIGENS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome}
              </option>
            ))}
          </select>
          <p className="text-sm text-parchment/70">{origem.descricao}</p>
          <p className="text-sm text-gold/80 mt-2">Créditos iniciais: {origem.creditosIniciais}</p>
        </div>

        <div className="card">
          <label className="label block mb-2">Classe</label>
          <select
            className="input w-full mb-3"
            value={classeId}
            onChange={(e) => setClasseId(e.target.value)}
          >
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <p className="text-sm text-parchment/70">
            <span className="text-gold/90">Pilar:</span> {classe.pilar}
          </p>
          <p className="text-sm text-parchment/60 mt-1">
            <span className="text-gold/70">Preço:</span> {classe.preco}
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="label">Atributos</label>
          <span
            className={`font-display text-lg ${
              pontosRestantes === 0 ? "text-green-400" : "text-gold"
            }`}
          >
            {pontosRestantes} / {PONTOS_ATRIBUTOS_CRIACAO} pontos restantes
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ATRIBUTO_LABELS.map(({ key, nome: nomeAtr }) => (
            <div key={key} className="flex items-center justify-between bg-ink/60 rounded px-4 py-2">
              <span>{nomeAtr}</span>
              <div className="flex items-center gap-3">
                <button
                  className="w-7 h-7 rounded border border-gold/50 text-gold hover:bg-gold/10"
                  onClick={() => ajustarAtributo(key, -1)}
                >
                  −
                </button>
                <span className="w-6 text-center font-display">{atributos[key]}</span>
                <button
                  className="w-7 h-7 rounded border border-gold/50 text-gold hover:bg-gold/10"
                  onClick={() => ajustarAtributo(key, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-6">
        <label className="label block mb-3">Recursos Derivados</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <Derivado nome="Vida Máxima" valor={derivados.vida} />
          <Derivado nome="Defesa Passiva" valor={derivados.defesa} />
          <Derivado nome="Reserva de Carga" valor={derivados.reserva} />
          <Derivado nome="Limite de Carga" valor={derivados.limiteCarga} />
          <Derivado nome="Peso Máximo" valor={derivados.pesoMax} />
          <Derivado nome="Pontos de Concepção" valor={derivados.concepcao} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar Personagem"}
        </button>
        {mensagem && <span className="text-sm text-parchment/80">{mensagem}</span>}
      </div>
    </main>
  );
}

function Derivado({ nome, valor }: { nome: string; valor: number }) {
  return (
    <div className="bg-ink/60 rounded py-3">
      <div className="text-2xl font-display text-gold">{valor}</div>
      <div className="text-xs text-parchment/60 uppercase tracking-wide mt-1">{nome}</div>
    </div>
  );
}
