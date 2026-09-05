import Link from "next/link";
import { Marca, CampoDeInterferencia } from "@/components/Marca";
import { PaineisDaHome } from "@/components/Paineis";

// A home não explica nada. Ela mostra as telas, uma por vez, cada uma entrando
// por cima da anterior. O texto é o nome da coisa e a medida — nada de frase.
export default function Home() {
  return (
    <main>
      {/* ---------------- topo ---------------- */}
      <section className="reticulo relative h-[calc(100vh-74px)] min-h-[520px] overflow-hidden flex flex-col items-center justify-center grade">
        <CampoDeInterferencia className="absolute inset-0 w-full h-full pointer-events-none" />

        <span className="medida absolute top-6 left-6 md:left-11">l.1 46</span>
        <span className="medida absolute top-6 right-6 md:right-11">l.2 121</span>
        <span className="medida absolute bottom-6 left-6 md:left-11 hidden sm:block">interferência n 3</span>
        <span className="medida absolute bottom-6 right-6 md:right-11 hidden sm:block">f 02.4</span>

        <div className="relative flex flex-col items-center text-center px-5">
          <div className="mb-7">
            <Marca size={82} viva />
          </div>
          <h1 className="font-display font-bold text-parchment text-[34px] sm:text-[46px] md:text-[58px] leading-none tracking-[0.22em] ml-[0.22em]">
            RESSONÂNCIA
          </h1>
          <div className="flex flex-wrap justify-center gap-3.5 mt-11">
            <Link href="/criar" className="btn-primary">
              Criar personagem
            </Link>
            <Link href="/personagens" className="btn-secondary">
              Minhas fichas
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- os painéis, um por cima do outro ---------------- */}
      <PaineisDaHome />

      {/* ---------------- fim ---------------- */}
      <section className="relative bg-ink border-t border-white/[0.07] py-24 md:py-32 text-center grade">
        <div className="relative">
          <Marca size={44} viva />
          <div className="flex flex-wrap justify-center gap-3.5 mt-9">
            <Link href="/criar" className="btn-primary">
              Criar personagem
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
