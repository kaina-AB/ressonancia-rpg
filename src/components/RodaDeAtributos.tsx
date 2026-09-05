import type { Atributos } from "@/lib/rules/formulas";

// A Roda de Atributos: hexágono dentro de anéis de onda.
// Cada nó tem um arco em volta que mostra o quanto do teto (20) aquele atributo já ocupa.
const VERTICES: { key: keyof Atributos; sigla: string; x: number; y: number }[] = [
  { key: "forca", sigla: "FOR", x: 210, y: 70 },
  { key: "destreza", sigla: "DES", x: 331, y: 140 },
  { key: "constituicao", sigla: "CON", x: 331, y: 280 },
  { key: "inteligencia", sigla: "INT", x: 210, y: 350 },
  { key: "carga", sigla: "CAR", x: 89, y: 280 },
  { key: "carisma", sigla: "CRM", x: 89, y: 140 },
];

const RAIO_NO = 40;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO_NO;

export function RodaDeAtributos({
  atributos,
  tamanho = 320,
  destaque,
  teto = 20,
}: {
  atributos: Atributos;
  tamanho?: number;
  destaque?: keyof Atributos | null;
  teto?: number;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 420 420"
      fill="none"
      className="shrink-0"
      role="img"
      aria-label="Roda de atributos"
    >
      <defs>
        <radialGradient id="nucleoRoda" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9B5CF6" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#9B5CF6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* anéis de onda */}
      <g stroke="#9B5CF6">
        <circle cx="210" cy="210" r="196" strokeOpacity="0.06" />
        <circle cx="210" cy="210" r="182" strokeOpacity="0.10" strokeDasharray="2 8" />
        <circle cx="210" cy="210" r="166" strokeOpacity="0.07" />
        <circle cx="210" cy="210" r="102" strokeOpacity="0.10" />
        <circle cx="210" cy="210" r="86" strokeOpacity="0.16" strokeDasharray="1 6" />
      </g>

      {/* hexágono ligando os seis atributos */}
      <polygon
        points={VERTICES.map((v) => `${v.x},${v.y}`).join(" ")}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.09"
      />

      {/* núcleo */}
      <circle cx="210" cy="210" r="56" fill="url(#nucleoRoda)" stroke="#9B5CF6" strokeOpacity="0.35" />
      <text
        x="210"
        y="205"
        textAnchor="middle"
        fill="#928CA0"
        fontSize="11"
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="1.6"
      >
        TOTAL
      </text>
      <text
        x="210"
        y="230"
        textAnchor="middle"
        fill="#ECEAF0"
        fontSize="22"
        fontWeight="600"
        fontFamily="Space Grotesk, sans-serif"
      >
        {VERTICES.reduce((s, v) => s + atributos[v.key], 0)}
      </text>

      {/* nós */}
      {VERTICES.map((v) => {
        const valor = atributos[v.key];
        const fracao = Math.max(0, Math.min(1, valor / teto));
        const ativo = destaque === v.key;
        return (
          <g key={v.key}>
            <circle
              cx={v.x}
              cy={v.y}
              r={RAIO_NO}
              fill={ativo ? "#221B31" : "#16141B"}
              stroke="#fff"
              strokeOpacity={ativo ? 0.2 : 0.1}
            />
            <circle
              cx={v.x}
              cy={v.y}
              r={RAIO_NO}
              stroke={ativo ? "#B98CFF" : "#9B5CF6"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(fracao * CIRCUNFERENCIA).toFixed(1)} ${CIRCUNFERENCIA.toFixed(1)}`}
              transform={`rotate(-90 ${v.x} ${v.y})`}
              strokeOpacity={ativo ? 1 : 0.75}
            />
            <text
              x={v.x}
              y={v.y - 6}
              textAnchor="middle"
              fill={ativo ? "#B98CFF" : "#928CA0"}
              fontSize="10"
              letterSpacing="1.4"
              fontFamily="IBM Plex Mono, monospace"
            >
              {v.sigla}
            </text>
            <text
              x={v.x}
              y={v.y + 17}
              textAnchor="middle"
              fill="#ECEAF0"
              fontSize="21"
              fontWeight="600"
              fontFamily="Space Grotesk, sans-serif"
            >
              {valor}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
