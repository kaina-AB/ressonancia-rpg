"use client";

import type { EstadosDoPersonagem } from "@/lib/ficha";

// O retrato reage ao estado: o anel troca de cor, Instável parte o sinal em duas
// cores e treme. Sem foto, mostra uma silhueta — nunca um espaço vazio.
const CORES: { campo: keyof EstadosDoPersonagem; rotulo: string; cor: string }[] = [
  { campo: "ferido", rotulo: "Ferido", cor: "#FF4D3D" },
  { campo: "instavel", rotulo: "Instável", cor: "#3DD6FF" },
  { campo: "sobrecarga", rotulo: "Sobrecarga", cor: "#FFB020" },
];

export function Retrato({
  retrato,
  estados,
  onAlternar,
  onTrocarFoto,
}: {
  retrato: string;
  estados: EstadosDoPersonagem;
  onAlternar: (campo: keyof EstadosDoPersonagem) => void;
  onTrocarFoto: () => void;
}) {
  const cor = estados.ferido
    ? "#FF4D3D"
    : estados.instavel
      ? "#3DD6FF"
      : estados.sobrecarga
        ? "#FFB020"
        : "#8A3FFC";
  const rotulo = estados.ferido
    ? "ferido"
    : estados.instavel
      ? "instável"
      : estados.sobrecarga
        ? "sobrecarga"
        : "estável";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="label">Retrato</span>
        <span className="font-mono text-[10px]" style={{ color: cor }}>
          {rotulo}
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[282px] mx-auto">
        <svg viewBox="0 0 284 284" className="absolute inset-0 w-full h-full" fill="none">
          <circle cx="142" cy="142" r="139" stroke={cor} strokeOpacity="0.3" />
          <circle
            cx="142"
            cy="142"
            r="130"
            stroke={cor}
            strokeOpacity="0.55"
            strokeDasharray={estados.instavel ? "3 6" : undefined}
          />
          <circle cx="142" cy="142" r="120" stroke={cor} strokeOpacity="0.14" />
        </svg>

        <button
          type="button"
          onClick={onTrocarFoto}
          title="Trocar foto do personagem"
          className={`absolute inset-[8%] border border-white/10 bg-elevated overflow-hidden ${
            estados.instavel ? "instavel" : ""
          }`}
        >
          {retrato ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={retrato} alt="Retrato do personagem" className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 240 240" className="w-full h-full block">
              <rect width="240" height="240" fill="#16121F" />
              <g fill={estados.ferido ? "#5C2A2E" : "#3A3348"} fillOpacity="0.5">
                <circle cx="120" cy="96" r="42" />
                <path d="M34 240c0-46 38-73 86-73s86 27 86 73z" />
              </g>
              <g stroke={cor} strokeOpacity="0.22" fill="none">
                <circle cx="120" cy="120" r="58" />
                <circle cx="120" cy="120" r="92" />
              </g>
            </svg>
          )}
          {/* instável: o sinal rasga em faixas, não vira um bloco cinza por cima */}
          {estados.instavel && (
            <span className="absolute inset-0 mix-blend-screen pointer-events-none">
              <span
                className="absolute inset-0 translate-x-[3px]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, rgba(255,77,61,.30) 0 2px, transparent 2px 9px)",
                }}
              />
              <span
                className="absolute inset-0 -translate-x-[3px]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent 0 5px, rgba(61,214,255,.26) 5px 7px, transparent 7px 14px)",
                }}
              />
            </span>
          )}
        </button>
      </div>

      <div className="text-center mt-3">
        <span className="label">clique na foto pra trocar</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {CORES.map(({ campo, rotulo: nome, cor: c }) => {
          const ativo = estados[campo];
          return (
            <button
              key={campo}
              type="button"
              onClick={() => onAlternar(campo)}
              className="font-mono text-[10.5px] uppercase tracking-[0.1em] px-3 py-2 border bg-elevated transition-colors"
              style={
                ativo
                  ? { borderColor: c, color: c, background: "rgba(255,255,255,.04)" }
                  : { borderColor: "rgba(255,255,255,.14)", color: "#9A93A8" }
              }
            >
              {nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}
