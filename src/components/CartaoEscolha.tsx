"use client";

// Lista sanfonada que substitui o <select> nativo do navegador.
// Clicar no cartão abre os detalhes; o botão Escolher é que decide.
export function CartaoEscolha({
  nome,
  resumo,
  aberto,
  selecionado,
  onAbrir,
  onEscolher,
  children,
}: {
  nome: string;
  resumo: string;
  aberto: boolean;
  selecionado: boolean;
  onAbrir: () => void;
  onEscolher: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-150 overflow-hidden ${
        selecionado
          ? "border-gold/70 bg-[#1A1721]"
          : aberto
            ? "border-white/15 bg-elevated"
            : "border-white/[0.08] bg-surface hover:border-white/20"
      }`}
    >
      <button
        type="button"
        onClick={onAbrir}
        aria-expanded={aberto}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3"
      >
        <span
          className={`w-5 h-5 rounded-full border grid place-items-center shrink-0 ${
            selecionado ? "border-gold bg-gold" : "border-white/25"
          }`}
        >
          {selecionado && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
              <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold text-parchment text-[15px]">{nome}</span>
          <span className="block text-[13px] text-dim mt-0.5 truncate">{resumo}</span>
        </span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#928CA0"
          strokeWidth="2"
          className={`shrink-0 transition-transform duration-150 ${aberto ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {aberto && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.07]">
          <div className="pt-3.5 space-y-2.5">{children}</div>
          <button
            type="button"
            onClick={onEscolher}
            className={selecionado ? "btn-secondary mt-4 w-full" : "btn-primary mt-4 w-full"}
          >
            {selecionado ? "Escolhido" : "Escolher"}
          </button>
        </div>
      )}
    </div>
  );
}

export function LinhaDetalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex gap-3 text-[13px]">
      <span className="label shrink-0 w-[104px] pt-0.5">{rotulo}</span>
      <span className="text-muted leading-relaxed">{valor}</span>
    </div>
  );
}
