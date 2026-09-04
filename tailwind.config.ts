import type { Config } from "tailwindcss";

// Paleta fechada na proposta de design (o canvas "Ressonância — Interface").
// Preto arroxeado + roxo, no espírito do C.R.I.S., mas com cores nossas.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0A0E", // fundo da página
        surface: "#16141B", // card
        elevated: "#1E1B25", // card em cima de card / linha destacada
        modal: "#131019", // fundo do popup
        parchment: "#ECEAF0", // texto principal
        muted: "#A29DAE", // texto secundário
        dim: "#928CA0", // rótulo / texto fraco (contraste já checado)
        gold: "#9B5CF6", // ROXO — o nome ficou de antes, é a cor de destaque
        lilac: "#B98CFF", // roxo claro, para texto sobre fundo escuro
        blood: "#E5484D", // vida / erro
        warn: "#F5A524", // limite de carga por ação / aviso
        trained: "#3DD68C", // treinado / sucesso
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        page: "1160px",
      },
    },
  },
  plugins: [],
};
export default config;
