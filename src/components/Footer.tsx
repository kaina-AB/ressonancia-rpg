import Link from "next/link";
import { Marca } from "@/components/Marca";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] mt-auto">
      <div className="max-w-page mx-auto px-5 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Marca size={18} />
          <span className="text-dim text-[13px]">Ressonância RPG — sistema e ficha digital</span>
        </div>
        <div className="flex items-center gap-6">
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
