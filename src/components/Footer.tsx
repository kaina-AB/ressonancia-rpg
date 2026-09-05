import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-auto">
      <div className="max-w-page mx-auto px-5 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="medida">Ressonância RPG — sistema e ficha</span>
        <div className="flex items-center gap-7">
          <Link href="/regras" className="text-dim text-[13px] hover:text-parchment transition-colors">
            Regras
          </Link>
          <Link href="/criar" className="text-dim text-[13px] hover:text-parchment transition-colors">
            Criar personagem
          </Link>
        </div>
      </div>
    </footer>
  );
}
