import type { Config } from "tailwindcss";

// Identidade "Instrumento de campo" — ver o canvas de design.
// A tela se comporta como um aparelho que mede algo invisível: onda saindo de um
// ponto, linha nodal, marcação de medida no canto. Preto arroxeado + roxo.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07060A", // vazio — fundo da página
        surface: "#0E0C14", // campo — placa
        elevated: "#16121F", // leitura — caixa de número
        modal: "#0C0A12",
        parchment: "#EDEAF2", // osso — texto
        muted: "#9A93A8", // texto secundário
        dim: "#948DA6", // rótulo
        faint: "#847D99", // marcação de medida (contraste já conferido)
        gold: "#8A3FFC", // eco — a cor de ação
        lilac: "#C4A0FF", // eco claro — números
        deep: "#35146B", // sombra sólida do botão
        blood: "#FF4D3D", // brasa — vida, perigo
        warn: "#FFB020", // limiar — teto, aviso
        trained: "#3DD68C", // firme — treinado, ok
      },
      fontFamily: {
        display: ["Chakra Petch", "Arial Narrow", "sans-serif"],
        body: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "1200px" },
      borderRadius: { none: "0", DEFAULT: "2px", sm: "2px", md: "2px", lg: "2px" },
    },
  },
  plugins: [],
};
export default config;
