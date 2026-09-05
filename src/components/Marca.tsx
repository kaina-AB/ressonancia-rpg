// A marca: um ponto de origem e a onda que sai dele.
// Três anéis fixos e — quando `viva` — um quarto que se propaga sem parar.
export function Marca({ size = 24, viva = false }: { size?: number; viva?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.7" fill="#C4A0FF" />
      <circle cx="12" cy="12" r="5.5" stroke="#8A3FFC" strokeWidth="1.1" />
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="#8A3FFC"
        strokeWidth="1.1"
        strokeOpacity="0.45"
        strokeDasharray="1.4 4"
      />
      {viva && (
        <circle
          cx="12"
          cy="12"
          r="11"
          stroke="#8A3FFC"
          strokeWidth="0.9"
          className="onda"
          style={{ transformOrigin: "12px 12px" }}
        />
      )}
    </svg>
  );
}

// O campo de interferência: duas fontes de onda que se cruzam.
// É o fundo das áreas de apresentação — nunca das telas de trabalho.
export function CampoDeInterferencia({ className = "" }: { className?: string }) {
  const roxos: [number, string, string | undefined][] = [
    [118, "0.26", "2 7"],
    [174, "0.20", undefined],
    [236, "0.15", undefined],
    [304, "0.11", "1 6"],
    [378, "0.08", undefined],
    [458, "0.06", undefined],
    [544, "0.04", "2 9"],
  ];
  return (
    <svg viewBox="0 0 1440 560" className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="nucleoCampo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8A3FFC" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8A3FFC" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="720" cy="270" r="330" fill="url(#nucleoCampo)" />
      <g stroke="#8A3FFC">
        {roxos.map(([r, o, dash]) => (
          <circle key={r} cx="720" cy="270" r={r} strokeOpacity={o} strokeDasharray={dash} />
        ))}
      </g>
      {/* a segunda fonte: o vermelho que interfere, quase invisível */}
      <g stroke="#FF4D3D" strokeOpacity="0.09">
        {[150, 262, 382].map((r) => (
          <circle key={r} cx="1140" cy="470" r={r} />
        ))}
      </g>
    </svg>
  );
}
