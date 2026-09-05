"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Painéis empilhados: cada um gruda no topo e ocupa a tela inteira, então o
 * seguinte entra POR CIMA do anterior conforme você rola. Cada painel tem a
 * própria animação de entrada, disparada quando ele fica visível.
 *
 * Regra desta home: o visual conta a história. O texto é só o nome da coisa.
 */
export function Painel({
  nome,
  medida,
  fundo = "ink",
  children,
}: {
  nome: string;
  medida: string;
  fundo?: "ink" | "campo";
  children: (ativo: boolean) => React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entrada]) => setAtivo(entrada.intersectionRatio > 0.55),
      { threshold: [0, 0.55, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      // 74px = altura do cabeçalho fixo. Sem descontar isso o painel passa da tela
      // e o rodapé dele (onde fica o nome) some.
      className={`sticky top-[74px] h-[calc(100vh-74px)] min-h-[560px] overflow-hidden flex flex-col
        border-t border-white/[0.07] ${fundo === "campo" ? "campo-roxo" : "bg-ink"}`}
    >
      <div className="absolute inset-0 grade pointer-events-none" />

      <span className="medida absolute top-6 left-6 md:left-11 z-10">{medida}</span>
      <span className="medida absolute top-6 right-6 md:right-11 z-10">{nome.toLowerCase()}</span>

      {/* o visual ocupa o espaço que sobra e fica centrado nele */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-6 pt-24 pb-6">
        {children(ativo)}
      </div>

      {/* o nome fica no fluxo, no rodapé do painel — é rótulo, não frase */}
      <h2
        className={`relative shrink-0 px-6 md:px-11 pb-9 md:pb-12 pointer-events-none
          font-display font-bold text-[40px] md:text-[86px] leading-[1.05] tracking-[0.02em] text-parchment
          transition-all duration-700 ${ativo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        {nome}
      </h2>
    </section>
  );
}

/* ============ 1. FICHA — as barras enchem e os números sobem ============ */
export function VisualFicha({ ativo }: { ativo: boolean }) {
  return (
    <div
      className={`card p-6 md:p-8 w-full max-w-[560px] transition-all duration-500 ${
        ativo ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-display font-bold text-parchment text-xl leading-none">Sorina</div>
          <div className="medida mt-2">nv 12 · ressonante</div>
        </div>
        <span className="label">resumo</span>
      </div>

      <Barra rotulo="Vida" atual={24} maximo={30} cor="#FF4D3D" ativo={ativo} atraso={0} />
      <Barra
        rotulo="Reserva de carga"
        atual={19}
        maximo={32}
        cor="#8A3FFC"
        marcador={28}
        ativo={ativo}
        atraso={140}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
        {[
          ["30", "Vida máx."],
          ["15", "Defesa"],
          ["32", "Reserva"],
          ["9", "Por ação"],
        ].map(([n, nome], i) => (
          <div
            key={nome}
            className="bg-elevated px-3.5 py-3 transition-all duration-500"
            style={{
              opacity: ativo ? 1 : 0,
              transform: ativo ? "none" : "translateY(10px)",
              transitionDelay: `${300 + i * 60}ms`,
            }}
          >
            <div className="font-display text-2xl leading-none">{n}</div>
            <div className="text-[11px] text-muted mt-1.5">{nome}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Barra({
  rotulo,
  atual,
  maximo,
  cor,
  marcador,
  ativo,
  atraso,
}: {
  rotulo: string;
  atual: number;
  maximo: number;
  cor: string;
  marcador?: number;
  ativo: boolean;
  atraso: number;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between mb-2">
        <span className="label">{rotulo}</span>
        <span className="font-mono text-[13px]">
          {atual}
          <span className="text-faint"> / {maximo}</span>
        </span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: ativo ? `${(atual / maximo) * 100}%` : "0%",
            background: cor,
            transitionDuration: "900ms",
            transitionDelay: `${atraso}ms`,
          }}
        />
        {marcador !== undefined && (
          <div
            className="absolute -top-1 -bottom-1 w-0.5 bg-warn transition-opacity duration-500"
            style={{ left: `${marcador}%`, opacity: ativo ? 1 : 0, transitionDelay: `${atraso + 700}ms` }}
          />
        )}
      </div>
    </div>
  );
}

/* ============ 2. CRIAÇÃO — os arcos se desenham em volta dos nós ============ */
const NOS = [
  { sigla: "FOR", valor: 3, x: 210, y: 68 },
  { sigla: "DES", valor: 6, x: 333, y: 139 },
  { sigla: "CON", valor: 5, x: 333, y: 281 },
  { sigla: "INT", valor: 7, x: 210, y: 352 },
  { sigla: "CAR", valor: 9, x: 87, y: 281 },
  { sigla: "CRM", valor: 4, x: 87, y: 139 },
];
const CIRC = 2 * Math.PI * 38;

export function VisualCriacao({ ativo }: { ativo: boolean }) {
  return (
    <svg viewBox="0 0 420 420" className="w-full max-w-[440px] h-auto" fill="none">
      <g stroke="#8A3FFC">
        <circle cx="210" cy="210" r="202" strokeOpacity="0.08" />
        <circle cx="210" cy="210" r="190" strokeOpacity="0.14" strokeDasharray="1.5 7" />
        <circle cx="210" cy="210" r="98" strokeOpacity="0.11" />
      </g>
      <polygon
        points={NOS.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.09"
        style={{
          strokeDasharray: 760,
          strokeDashoffset: ativo ? 0 : 760,
          transition: "stroke-dashoffset 1.1s cubic-bezier(.15,.6,.3,1)",
        }}
      />
      <circle cx="210" cy="210" r="56" fill="none" stroke="#8A3FFC" strokeOpacity="0.38" />
      <text
        x="210"
        y="203"
        textAnchor="middle"
        fill="#948DA6"
        fontSize="9.5"
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="2.2"
      >
        SOMA
      </text>
      <text
        x="210"
        y="231"
        textAnchor="middle"
        fill="#3DD68C"
        fontSize="24"
        fontWeight="700"
        fontFamily="Chakra Petch, sans-serif"
        style={{ opacity: ativo ? 1 : 0, transition: "opacity .5s 1s" }}
      >
        34
      </text>

      {NOS.map((n, i) => {
        const cheio = (n.valor / 20) * CIRC;
        return (
          <g key={n.sigla}>
            <circle cx={n.x} cy={n.y} r="38" fill="#16121F" stroke="#fff" strokeOpacity="0.1" />
            <circle
              cx={n.x}
              cy={n.y}
              r="38"
              stroke="#8A3FFC"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(-90 ${n.x} ${n.y})`}
              style={{
                strokeDasharray: `${cheio} ${CIRC}`,
                strokeDashoffset: ativo ? 0 : cheio,
                transition: `stroke-dashoffset .8s cubic-bezier(.15,.6,.3,1) ${180 + i * 90}ms`,
              }}
            />
            <text
              x={n.x}
              y={n.y - 6}
              textAnchor="middle"
              fill="#948DA6"
              fontSize="9"
              letterSpacing="1.4"
              fontFamily="IBM Plex Mono, monospace"
            >
              {n.sigla}
            </text>
            <text
              x={n.x}
              y={n.y + 15}
              textAnchor="middle"
              fill="#EDEAF2"
              fontSize="21"
              fontWeight="700"
              fontFamily="Chakra Petch, sans-serif"
              style={{ opacity: ativo ? 1 : 0, transition: `opacity .4s ${400 + i * 90}ms` }}
            >
              {n.valor}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============ 3. PERÍCIAS — as linhas entram em cascata ============ */
const LINHAS = [
  ["Ocultismo", "INT 7", "Especialista", "+4", "11"],
  ["Percepção", "CAR 9", "Adepto", "+3", "12"],
  ["Tática", "INT 7", "Adepto", "+3", "10"],
  ["Concentração", "CAR 9", "Treinado", "+2", "11"],
  ["Luta", "FOR 3", "Treinado", "+2", "5"],
  ["Atletismo", "FOR 3", "Destreinado", "", "3"],
];

export function VisualPericias({ ativo }: { ativo: boolean }) {
  return (
    <div className="card !p-0 w-full max-w-[620px] overflow-hidden">
      {LINHAS.map(([nome, atr, grau, bonus, total], i) => (
        <div
          key={nome}
          className="grid grid-cols-[1fr_66px_130px_52px] gap-3 items-center px-5 py-3.5
            border-b border-white/[0.05] last:border-b-0 transition-all duration-500"
          style={{
            opacity: ativo ? 1 : 0,
            transform: ativo ? "none" : "translateX(-14px)",
            transitionDelay: `${i * 70}ms`,
          }}
        >
          <span className="text-[14.5px]">{nome}</span>
          <span className="font-mono text-[12.5px] text-muted text-center">{atr}</span>
          <span className="flex items-center gap-2">
            <span
              className={`font-display font-semibold text-[12.5px] ${
                bonus ? "text-trained" : "text-faint"
              }`}
            >
              {grau}
            </span>
            <span className="font-mono text-[11.5px] text-lilac">{bonus}</span>
          </span>
          <span className="font-display text-lg text-lilac text-center">{total}</span>
        </div>
      ))}
    </div>
  );
}

/* ============ 4. MESA — os efeitos caem um a um ============ */
const EFEITOS = [
  { tag: "M", cor: "#8A3FFC", titulo: "Sobrecarga do Eco", nota: "+4 reserva · −2 defesa · 3 rodadas" },
  { tag: "RP", cor: "#FF4D3D", titulo: "“Você não consegue dizer o nome dela em voz alta.”", nota: "" },
  { tag: "IT", cor: "#948DA6", titulo: "Caderno de campo", nota: "peso 1 · foi pra mochila" },
];

export function VisualMesa({ ativo }: { ativo: boolean }) {
  return (
    <div className="w-full max-w-[560px] flex flex-col gap-3.5">
      {EFEITOS.map((e, i) => (
        <div
          key={e.tag}
          className="card !p-0 transition-all duration-500"
          style={{
            opacity: ativo ? 1 : 0,
            transform: ativo ? "none" : "translateY(-18px)",
            transitionDelay: `${i * 180}ms`,
            borderColor: ativo ? undefined : "transparent",
          }}
        >
          <div className="px-5 py-4 flex items-center gap-4">
            <span
              className="w-10 h-10 shrink-0 border grid place-items-center font-mono text-[11px]"
              style={{ borderColor: e.cor, color: e.cor }}
            >
              {e.tag}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm">{e.titulo}</span>
              {e.nota && <span className="medida block mt-1">{e.nota}</span>}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ a sequência da home ============ */
// Fica aqui dentro, no mesmo módulo client, porque a função-filha de <Painel>
// não pode atravessar a fronteira server → client.
export function PaineisDaHome() {
  return (
    <>
      <Painel nome="FICHA" medida="10 + CON×4">
        {(ativo) => <VisualFicha ativo={ativo} />}
      </Painel>
      <Painel nome="CRIAÇÃO" medida="34 pontos" fundo="campo">
        {(ativo) => <VisualCriacao ativo={ativo} />}
      </Painel>
      <Painel nome="PERÍCIAS" medida="1 / 3 / 6 / 10">
        {(ativo) => <VisualPericias ativo={ativo} />}
      </Painel>
      <Painel nome="MESA" medida="3 agentes" fundo="campo">
        {(ativo) => <VisualMesa ativo={ativo} />}
      </Painel>
    </>
  );
}
