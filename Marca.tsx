// A marca do site: anéis concêntricos = a onda que sai do ponto de origem.
// Usada no cabeçalho e na home. Tamanho controlado por props pra não repetir SVG por aí.
export function Marca({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2" stroke="#9B5CF6" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="6" stroke="#9B5CF6" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="12" cy="12" r="10" stroke="#9B5CF6" strokeWidth="1.4" strokeOpacity="0.4" />
    </svg>
  );
}

// O anel grande da home — mesma ideia, muito mais camadas.
export function AnelRessonante({ className = "" }: { className?: string }) {
  const raios = [300, 262, 224, 186, 148, 110, 72, 36];
  const opacidades = [0.05, 0.07, 0.09, 0.12, 0.15, 0.2, 0.26, 0.34];
  return (
    <svg viewBox="0 0 620 620" className={className} fill="none" aria-hidden="true">
      <g stroke="#9B5CF6">
        {raios.map((r, i) => (
          <circle
            key={r}
            cx="310"
            cy="310"
            r={r}
            strokeOpacity={opacidades[i]}
            strokeDasharray={i % 2 === 1 ? "2 9" : undefined}
          />
        ))}
      </g>
      {/* segunda fonte de onda — é a interferência que dá o desenho de cimática */}
      <g stroke="#E5484D" strokeOpacity="0.13">
        {[90, 150, 210, 270].map((r) => (
          <circle key={r} cx="410" cy="368" r={r} />
        ))}
      </g>
    </svg>
  );
}
