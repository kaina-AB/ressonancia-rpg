"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";
import { Marca } from "@/components/Marca";

// O guia do site: barra fixa no topo, links no meio, sublinhado marcando onde você está.
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
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/[0.07]">
      <div className="max-w-page mx-auto h-[74px] px-5 md:px-10 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Marca size={24} />
          <span className="font-display font-bold text-parchment text-base tracking-[0.24em]">
            RESSONÂNCIA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
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

        <div className="flex items-center gap-4 shrink-0">
          {!carregando && user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="medida max-w-[150px] truncate">{user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-9 h-9 border border-gold/45 bg-gold/[0.08] text-lilac
                  font-display font-semibold text-sm hover:bg-gold/20 transition-colors"
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

          <button
            className="md:hidden w-10 h-10 border border-white/10 flex items-center justify-center"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EDEAF2" strokeWidth="1.8">
              {menuAberto ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden border-t border-white/[0.07] px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuAberto(false)}
              className={`py-3 text-[15px] ${ehAtivo(l.href) ? "text-lilac" : "text-muted"}`}
            >
              {l.texto}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/[0.07]">
            {user ? (
              <button
                className="btn-ghost w-full"
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
    </header>
  );
}
