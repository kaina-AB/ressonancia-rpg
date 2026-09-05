import Link from "next/link";
import { AnelRessonante } from "@/components/Marca";
import { DemoRecursos, DemoPersonagens, DemoPericia, DemoCriacao } from "@/components/demos";

export default function Home() {
  return (
    <main>
      {/* ---------------- topo ---------------- */}
      <section className="relative overflow-hidden">
        <AnelRessonante className="absolute -right-24 -top-32 w-[620px] h-[620px] opacity-50 pointer-events-none hidden sm:block" />
        <div className="relative max-w-page mx-auto px-5 md:px-8 py-24 md:py-32">
          <div className="max-w-[620px]">
            <div className="label mb-5">RPG de mesa · sistema próprio</div>
            <h1 className="font-display font-bold text-parchment text-[42px] md:text-[62px] leading-[1.03] tracking-tight">
              Toda existência
              <br />
              deixa uma marca.
            </h1>
            <p className="text-muted text-[17px] md:text-[19px] leading-relaxed mt-6 max-w-[520px]">
              A ficha digital do Ressonância. Ela faz as contas — você joga.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link href="/criar" className="btn-primary !px-7 !py-3.5 text-[15px]">
                Criar personagem
              </Link>
              <Link href="/personagens" className="btn-secondary !px-7 !py-3.5 text-[15px]">
                Minhas fichas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- faixas alternadas ---------------- */}
      <Faixa
        id="a-ficha"
        brilho
        titulo="A ficha faz as contas."
        texto="Mexeu num atributo, tudo se ajusta na hora: Vida, Defesa, Reserva de Carga, Limite por ação, Peso."
        demo={<DemoRecursos />}
      />

      <Faixa
        invertida
        titulo="Seus personagens num lugar só."
        texto="Cada jogador entra na própria conta e vê só as fichas dele. Abre no celular, na mesa, sem instalar nada."
        demo={<DemoPersonagens />}
      />

      <Faixa
        id="criacao"
        brilho
        titulo="Criar personagem é passo a passo."
        texto="Nome, atributos, origem, classe, revisar. Uma etapa por vez, sem formulário gigante."
        demo={<DemoCriacao />}
      />

      <Faixa
        invertida
        titulo="A regra fica dentro da ficha."
        texto="Grau de treino, custo pra subir, bônus no teste — tudo à mão, no ponto em que você precisa."
        demo={<DemoPericia />}
      />

      {/* ---------------- chamada final ---------------- */}
      <section className="glow-purple border-t border-white/[0.07]">
        <div className="max-w-page mx-auto px-5 md:px-8 py-20 md:py-24 text-center">
          <h2 className="font-display font-bold text-parchment text-[30px] md:text-[40px] tracking-tight">
            Faz o seu.
          </h2>
          <p className="text-muted mt-4 max-w-[440px] mx-auto">
            Leva uns dois minutos e a ficha já sai com tudo calculado.
          </p>
          <Link href="/criar" className="btn-primary !px-8 !py-3.5 text-[15px] mt-8">
            Começar
          </Link>
        </div>
      </section>
    </main>
  );
}

function Faixa({
  id,
  titulo,
  texto,
  demo,
  brilho = false,
  invertida = false,
}: {
  id?: string;
  titulo: string;
  texto: string;
  demo: React.ReactNode;
  brilho?: boolean;
  invertida?: boolean;
}) {
  return (
    <section
      id={id}
      className={`border-t border-white/[0.07] scroll-mt-[72px] ${brilho ? "glow-purple" : ""}`}
    >
      <div
        className={`max-w-page mx-auto px-5 md:px-8 py-16 md:py-24 flex flex-col gap-10 md:gap-16 md:items-center ${
          invertida ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className="md:flex-1">
          <h2 className="font-display font-bold text-parchment text-[28px] md:text-[38px] leading-[1.12] tracking-tight">
            {titulo}
          </h2>
          <p className="text-muted text-[16px] md:text-[17px] leading-relaxed mt-4 max-w-[440px]">
            {texto}
          </p>
        </div>
        <div className="md:flex-1 md:max-w-[480px] w-full">{demo}</div>
      </div>
    </section>
  );
}
