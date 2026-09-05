"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/lib/useUser";
import { ORIGENS } from "@/lib/rules/origens";
import { CLASSES } from "@/lib/rules/classes";
import { normalizarFicha } from "@/lib/ficha";
import { vidaMaxima } from "@/lib/rules/formulas";
import { Marca } from "@/components/Marca";
import { AvisoSupabase } from "@/components/AvisoSupabase";

interface PersonagemRow {
  id: string;
  nome: string;
  origem_id: string;
  classe_id: string;
  nivel: number;
  criado_em: string;
  ficha: unknown;
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
      // A RLS do banco já garante que só voltam os personagens do usuário logado,
      // mas o filtro explícito deixa a intenção clara pra quem for ler o código.
      const { data, error } = await supabase
        .from("personagens")
        .select("id, nome, origem_id, classe_id, nivel, criado_em, ficha")
        .eq("user_id", user!.id)
        .order("criado_em", { ascending: false });
      if (error) setErro(error.message);
      else setPersonagens(data ?? []);
      setCarregando(false);
    }
    carregar();
  }, [user]);

  return (
    <main className="max-w-page mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-display font-bold text-parchment text-[26px] md:text-[32px] tracking-tight">
            Meus personagens
          </h1>
          <p className="text-dim text-sm mt-1.5">
            {personagens.length > 0
              ? `${personagens.length} ficha${personagens.length > 1 ? "s" : ""} salva${personagens.length > 1 ? "s" : ""}`
              : "Nada salvo ainda."}
          </p>
        </div>
        <Link href="/criar" className="btn-primary shrink-0">
          + Novo
        </Link>
      </div>

      <AvisoSupabase />

      {carregando && <p className="text-dim">Carregando...</p>}
      {erro && (
        <div className="card border-blood/40">
          <p className="text-blood text-sm">Erro ao carregar: {erro}</p>
          <p className="text-dim text-[13px] mt-2">
            Confira se as chaves do Supabase estão configuradas (ver README).
          </p>
        </div>
      )}

      {!carregando && !erro && personagens.length === 0 && (
        <div className="card flex flex-col items-center text-center py-14">
          <Marca size={34} />
          <p className="text-muted mt-4 mb-6 max-w-[320px]">
            Nenhuma ficha por aqui. A criação leva uns dois minutos.
          </p>
          <Link href="/criar" className="btn-primary">
            Criar personagem
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {personagens.map((p) => {
          const classe = CLASSES.find((c) => c.id === p.classe_id);
          const ficha = normalizarFicha(p.ficha, 2 + (classe?.pontosPericiaCriacao ?? 2));
          const vidaMax = vidaMaxima(ficha.atributos);
          const pct = vidaMax > 0 ? Math.max(0, Math.min(100, (ficha.vidaAtual / vidaMax) * 100)) : 0;
          return (
            <Link key={p.id} href={`/ficha/${p.id}`} className="card card-hover block">
              <div className="font-display font-semibold text-parchment text-[17px]">{p.nome}</div>
              <div className="text-[12.5px] text-dim mt-1">
                Nível {p.nivel} · {classe?.nome ?? p.classe_id} ·{" "}
                {ORIGENS.find((o) => o.id === p.origem_id)?.nome ?? p.origem_id}
              </div>
              <div className="mt-4">
                <div className="stat-bar-track !h-1.5">
                  <div className="stat-bar-fill" style={{ width: `${pct}%`, background: "#E5484D" }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] label">Vida</span>
                  <span className="text-[11px] font-mono text-dim">
                    {ficha.vidaAtual} / {vidaMax}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
