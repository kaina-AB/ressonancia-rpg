"use client";

import Link from "next/link";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";

export function Header() {
  const { user, carregando } = useUser();

  return (
    <header className="border-b border-gold/20 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-display text-gold text-lg tracking-wide">
        RESSONÂNCIA
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        {!carregando && user && (
          <>
            <Link href="/personagens" className="text-parchment/80 hover:text-gold">
              Meus Personagens
            </Link>
            <Link href="/criar" className="text-parchment/80 hover:text-gold">
              Criar
            </Link>
            <span className="text-parchment/50">{user.email}</span>
            <button
              className="text-parchment/60 hover:text-blood"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </button>
          </>
        )}
        {!carregando && !user && (
          <Link href="/login" className="btn-secondary">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
