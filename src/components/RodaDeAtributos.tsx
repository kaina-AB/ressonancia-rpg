import type { Atributos } from "@/lib/rules/formulas";

// A Roda de Atributos: hexágono dentro de anéis de onda.
// Cada nó tem um arco em volta mostrando quanto do teto aquele atributo ocupa.
const VERTICES: { key: keyof Atributos; sigla: string; x: number; y: number }[] = [
  { key: "forca", sigla: "FOR", x: 210, y: 68 },
  { key: "destreza", sigla: "DES", x: 333, y: 139 },
  { key: "constituicao", sigla: "CON", x: 333, y: 281 },
  { key: "inteligencia", sigla: "INT", x: 210, y: 352 },
  { key: "carga", sigla: "CAR", x: 87, y: 281 },
  { key: "carisma", sigla: "CRM", x: 87, y: 139 },
];

const RAIO = 38;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export function RodaDeAtributos({
  atributos,
  tamanho = 400,
  destaque,
  teto = 20,
  corSoma = "#EDEAF2",
}: {
  atributos: Atributos;
  tamanho?: number;
  destaque?: keyof Atributos | null;
  teto?: number;
  corSoma?: string;
}) {
  const soma = VERTICES.reduce((s, v) => s + atributos[v.key], 0);

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 420 420"
      fill="none"
      className="max-w-full h-auto"
      role="img"
      aria-label={`Roda de atributos, soma ${soma}`}
    >
      <g stroke="#8A3FFC">
        <circle cx="210" cy="210" r="202" strokeOpacity="0.08" />
        <circle cx="210" cy="210" r="190" strokeOpacity="0.14" strokeDasharray="1.5 7" />
        <circle cx="210" cy="210" r="98" strokeOpacity="0.11" />
      </g>

      <polygon
        points={VERTICES.map((v) => `${v.x},${v.y}`).join(" ")}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.09"
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
        fill={corSoma}
        fontSize="24"
        fontWeight="700"
        fontFamily="Chakra Petch, sans-serif"
      >
        {soma}
      </text>

      {VERTICES.map((v) => {
        const valor = atributos[v.key];
        const fracao = Math.max(0, Math.min(1, valor / teto));
        const ativo = destaque === v.key;
        return (
          <g key={v.key}>
            <circle cx={v.x} cy={v.y} r={RAIO} fill="#16121F" stroke="#fff" strokeOpacity={ativo ? 0.2 : 0.1} />
            <circle
              cx={v.x}
              cy={v.y}
              r={RAIO}
              stroke={ativo ? "#C4A0FF" : "#8A3FFC"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(fracao * CIRCUNFERENCIA).toFixed(1)} ${CIRCUNFERENCIA.toFixed(1)}`}
              transform={`rotate(-90 ${v.x} ${v.y})`}
            />
            <text
              x={v.x}
              y={v.y - 6}
              textAnchor="middle"
              fill={ativo ? "#C4A0FF" : "#948DA6"}
              fontSize="9"
              letterSpacing="1.4"
              fontFamily="IBM Plex Mono, monospace"
            >
              {v.sigla}
            </text>
            <text
              x={v.x}
              y={v.y + 15}
              textAnchor="middle"
              fill="#EDEAF2"
              fontSize="21"
              fontWeight="700"
              fontFamily="Chakra Petch, sans-serif"
            >
              {valor}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
