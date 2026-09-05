// Demonstrações da home: pedaços de verdade da ficha, em tamanho pequeno.
// Não são imagens — é a mesma linguagem visual do produto, então nunca ficam desatualizadas.

/* ---------------- 1. A ficha faz as contas ---------------- */
export function DemoRecursos() {
  const derivados = [
    { nome: "Vida Máxima", valor: 30, formula: "10 + CON×4" },
    { nome: "Defesa Passiva", valor: 15, formula: "10 + CON" },
    { nome: "Reserva de Carga", valor: 32, formula: "(INT + CAR)×2" },
    { nome: "Limite por ação", valor: 9, formula: "CAR" },
  ];
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-display font-semibold text-parchment text-[17px]">Sorina</div>
          <div className="text-dim text-xs mt-0.5">Nível 3 · Ressonante · Linhagem Ressonante</div>
        </div>
        <div className="label">Resumo</div>
      </div>

      <div className="space-y-3.5 mb-5">
        <BarraDemo rotulo="Vida" atual={24} maximo={30} cor="#E5484D" />
        <BarraDemo rotulo="Reserva de Carga" atual={19} maximo={32} cor="#9B5CF6" marcador={9} />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {derivados.map((d) => (
          <div key={d.nome} className="bg-elevated rounded-lg px-3.5 py-3">
            <div className="font-display text-2xl text-parchment leading-none">{d.valor}</div>
            <div className="text-[11px] text-muted mt-1.5">{d.nome}</div>
            <div className="text-[10px] text-dim font-mono mt-0.5">{d.formula}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarraDemo({
  rotulo,
  atual,
  maximo,
  cor,
  marcador,
}: {
  rotulo: string;
  atual: number;
  maximo: number;
  cor: string;
  marcador?: number;
}) {
  const pct = Math.round((atual / maximo) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="label">{rotulo}</span>
        <span className="font-mono text-sm text-parchment">
          {atual}
          <span className="text-dim"> / {maximo}</span>
        </span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: cor }} />
        {marcador !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-warn"
            style={{ left: `${Math.round((marcador / maximo) * 100)}%` }}
            title="Limite de Carga por ação"
          />
        )}
      </div>
      {marcador !== undefined && (
        <div className="text-[10px] text-warn mt-1.5 font-mono">
          ▏ máximo de {marcador} de Carga numa mesma ação
        </div>
      )}
    </div>
  );
}

/* ---------------- 2. Seus personagens ---------------- */
export function DemoPersonagens() {
  const lista = [
    { nome: "Sorina", detalhe: "Nível 3 · Ressonante", vida: 24, max: 30 },
    { nome: "Teodoro", detalhe: "Nível 5 · Bastião", vida: 41, max: 46 },
    { nome: "Ilhéu", detalhe: "Nível 2 · Andarilho", vida: 14, max: 22 },
  ];
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-semibold text-parchment text-[17px]">Meus personagens</div>
        <span className="text-[11px] font-display font-semibold text-white bg-gold rounded-md px-3 py-1.5">
          + Novo
        </span>
      </div>
      <div className="space-y-2.5">
        {lista.map((p) => (
          <div
            key={p.nome}
            className="bg-elevated rounded-lg px-4 py-3.5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="font-display font-semibold text-parchment text-[15px]">{p.nome}</div>
              <div className="text-xs text-dim mt-0.5">{p.detalhe}</div>
            </div>
            <div className="w-24 shrink-0">
              <div className="stat-bar-track !h-1.5">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${(p.vida / p.max) * 100}%`, background: "#E5484D" }}
                />
              </div>
              <div className="text-[10px] font-mono text-dim mt-1 text-right">
                {p.vida}/{p.max}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 3. Regra dentro da ficha ---------------- */
export function DemoPericia() {
  const linhas = [
    { nome: "Ocultismo", atr: "INT 7", grau: "Especialista", bonus: 4, total: 11 },
    { nome: "Tática", atr: "INT 7", grau: "Adepto", bonus: 3, total: 10 },
    { nome: "Luta", atr: "FOR 3", grau: "Treinado", bonus: 2, total: 5 },
    { nome: "Atletismo", atr: "FOR 3", grau: "Destreinado", bonus: 0, total: 3 },
  ];
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-semibold text-parchment text-[17px]">Perícias</div>
        <div className="text-[11px] font-mono text-lilac bg-gold/12 border border-gold/30 rounded-md px-2.5 py-1">
          4 pontos livres
        </div>
      </div>

      <div className="space-y-1.5">
        {linhas.map((l) => (
          <div
            key={l.nome}
            className="bg-elevated rounded-lg px-3.5 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-[14px] text-parchment">{l.nome}</div>
              <div className="text-[11px] text-dim font-mono mt-0.5">
                {l.atr} · {l.grau} {l.bonus > 0 ? `+${l.bonus}` : ""}
              </div>
            </div>
            <div className="font-display text-xl text-lilac tabular-nums">{l.total}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-gold/25 bg-modal px-4 py-3">
        <div className="label mb-1.5">Subir de grau</div>
        <p className="text-[13px] text-muted leading-relaxed">
          Tática está em Adepto (já custou 3). Ir pra Especialista custa{" "}
          <span className="text-lilac font-mono">3 pontos</span> — a diferença, não os 6 de novo.
        </p>
      </div>
    </div>
  );
}

/* ---------------- 4. Criação em etapas ---------------- */
export function DemoCriacao() {
  const etapas = ["Nome", "Atributos", "Origem", "Classe", "Revisar"];
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-1.5 mb-6">
        {etapas.map((e, i) => (
          <div key={e} className="flex items-center gap-1.5 flex-1 last:flex-none">
            <div
              className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-display font-semibold shrink-0 ${
                i <= 1 ? "bg-gold text-white" : "bg-elevated text-dim border border-white/10"
              }`}
            >
              {i + 1}
            </div>
            {i < etapas.length - 1 && (
              <div className={`h-[2px] flex-1 rounded ${i < 1 ? "bg-gold" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {[
          { nome: "Constituição", sigla: "CON", valor: 5 },
          { nome: "Inteligência", sigla: "INT", valor: 7 },
          { nome: "Carga", sigla: "CAR", valor: 9 },
        ].map((a) => (
          <div key={a.sigla} className="bg-elevated rounded-lg px-3.5 py-2.5 flex items-center justify-between">
            <span className="text-[14px] text-parchment">
              {a.nome} <span className="font-mono text-[11px] text-dim ml-1">{a.sigla}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg border border-gold/45 text-lilac grid place-items-center text-base leading-none">
                −
              </span>
              <span className="w-6 text-center font-display text-lg tabular-nums">{a.valor}</span>
              <span className="w-7 h-7 rounded-lg border border-gold/45 text-lilac grid place-items-center text-base leading-none">
                +
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.07]">
        <span className="label">Pontos restantes</span>
        <span className="font-display text-2xl text-trained tabular-nums">
          0<span className="text-dim text-sm"> / 34</span>
        </span>
      </div>
    </div>
  );
}
