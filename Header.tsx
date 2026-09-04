"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";
import { Marca } from "@/components/Marca";

// O "guia do site": barra fixa no topo, com os links no meio e o sublinhado
// marcando onde você está. É o mesmo esqueleto em todas as páginas.
const LINKS_LOGADO = [
  { href: "/personagens", texto: "Personagens" },
  { href: "/criar", texto: "Criar" },
  { href: "/regras", texto: "Regras" },
];

const LINKS_VISITANTE = [
  { href: "/#a-ficha", texto: "A ficha" },
  { href: "/#criacao", texto: "Criação" },
  { href: "/regras", texto: "Regras" },
];

export function Header() {
  const { user, carregando } = useUser();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = user ? LINKS_LOGADO : LINKS_VISITANTE;
  const inicial = (user?.email ?? "?").charAt(0).toUpperCase();

  function ehAtivo(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#0c0b10]/95 backdrop-blur-sm border-b border-white/[0.07]">
        <div className="max-w-page mx-auto h-[72px] px-5 md:px-8 flex items-center justify-between gap-6">
          {/* marca */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Marca size={22} />
            <span className="font-display font-bold text-parchment text-[15px] tracking-[0.14em]">
              RESSONÂNCIA
            </span>
          </Link>

          {/* links do meio — só no desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${ehAtivo(l.href) ? "nav-link-active" : ""}`}
              >
                {l.texto}
              </Link>
            ))}
          </nav>

          {/* conta */}
          <div className="flex items-center gap-3 shrink-0">
            {!carregando && user && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-dim max-w-[160px] truncate">{user.email}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 text-lilac
                    font-display font-semibold text-sm hover:bg-gold/25 transition-colors"
                  title="Sair da conta"
                >
                  {inicial}
                </button>
              </div>
            )}
            {!carregando && !user && (
              <Link href="/login" className="hidden md:inline-flex btn-secondary !py-2 !px-5">
                Entrar
              </Link>
            )}

            {/* botão do menu no celular */}
            <button
              className="md:hidden w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center"
              onClick={() => setMenuAberto((v) => !v)}
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ECEAF0" strokeWidth="1.8">
                {menuAberto ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* menu do celular */}
        {menuAberto && (
          <div className="md:hidden border-t border-white/[0.07] px-5 py-4 flex flex-col gap-1 bg-[#0c0b10]">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuAberto(false)}
                className={`py-2.5 text-[15px] ${ehAtivo(l.href) ? "text-lilac" : "text-muted"}`}
              >
                {l.texto}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-white/[0.07]">
              {user ? (
                <button
                  className="btn-ghost !px-0"
                  onClick={() => {
                    supabase.auth.signOut();
                    setMenuAberto(false);
                  }}
                >
                  Sair da conta
                </button>
              ) : (
                <Link href="/login" className="btn-secondary w-full" onClick={() => setMenuAberto(false)}>
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="header-line" />
    </header>
  );
}
