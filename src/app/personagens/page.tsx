"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";

interface PersonagemRow {
  id: string;
  nome: string;
  origem_id: string;
  classe_id: string;
  nivel: number;
  criado_em: string;
}

export default function ListaPersonagens() {
  const router = useRouter();
  const { user, carregando: carregandoUser } = useUser();
  const [personagens, setPersonagens] = useState<PersonagemRow[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!carregandoUser && !user) router.push("/login");
  }, [carregandoUser, user, router]);

  useEffect(() => {
    if (!user) return;
    async function carregar() {
      // RLS já garante que só voltam os personagens do usuário logado,
      // mas o filtro explícito deixa a intenção clara pra quem for ler o código.
      const { data, error } = await supabase
        .from("personagens")
        .select("id, nome, origem_id, classe_id, nivel, criado_em")
        .eq("user_id", user!.id)
        .order("criado_em", { ascending: false });
      if (error) setErro(error.message);
      else setPersonagens(data ?? []);
      setCarregando(false);
    }
    carregar();
  }, [user]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-gold">Personagens</h1>
        <Link href="/criar" className="btn-primary">
          + Novo
        </Link>
      </div>

      {carregando && <p className="text-parchment/60">Carregando...</p>}
      {erro && (
        <p className="text-blood">
          Erro ao carregar: {erro} — confira se o Supabase está configurado (ver README).
        </p>
      )}
      {!carregando && !erro && personagens.length === 0 && (
        <p className="text-parchment/60">Nenhum personagem salvo ainda.</p>
      )}

      <div className="space-y-3">
        {personagens.map((p) => (
          <div key={p.id} className="card flex items-center justify-between">
            <div>
              <div className="font-display text-lg text-parchment">{p.nome}</div>
              <div className="text-sm text-parchment/60">
                Nível {p.nivel} · {ORIGENS.find((o) => o.id === p.origem_id)?.nome ?? p.origem_id} ·{" "}
                {CLASSES.find((c) => c.id === p.classe_id)?.nome ?? p.classe_id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
