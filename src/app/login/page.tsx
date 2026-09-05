"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { CampoDeInterferencia } from "@/components/Marca";
import { AvisoSupabase } from "@/components/AvisoSupabase";

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setCarregando(true);
    setMensagem(null);

    const resultado =
      modo === "cadastrar"
        ? await supabase.auth.signUp({ email, password: senha })
        : await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (resultado.error) {
      setMensagem(resultado.error.message);
      return;
    }

    if (modo === "cadastrar" && !resultado.data.session) {
      setMensagem(
        "Conta criada! Se a confirmação por e-mail estiver ativa no Supabase, confira sua caixa de entrada antes de entrar."
      );
      return;
    }

    router.push("/personagens");
  }

  return (
    <main className="relative overflow-hidden">
      <CampoDeInterferencia className="absolute inset-x-0 top-0 h-[520px] opacity-60 pointer-events-none" />
      <div className="relative max-w-[400px] mx-auto px-5 py-16 md:py-24">
        <h1 className="font-display font-bold text-parchment text-[26px] text-center tracking-tight">
          {modo === "entrar" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-dim text-[13.5px] text-center mt-2 mb-7">
          Suas fichas ficam salvas na sua conta — só você enxerga.
        </p>

        <AvisoSupabase />

        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
        >
          <div>
            <label className="label block mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              className="input w-full"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label block mb-2" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              className="input w-full"
              type="password"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button className="btn-primary w-full" type="submit" disabled={carregando}>
            {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
          {mensagem && <p className="text-[13px] text-muted leading-relaxed">{mensagem}</p>}
        </form>

        <button
          className="text-[13.5px] text-lilac hover:text-parchment transition-colors block mx-auto mt-5"
          onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
        >
          {modo === "entrar" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
      </div>
    </main>
  );
}
