"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
      setMensagem("Conta criada! Se a confirmação por e-mail estiver ativa no Supabase, confira sua caixa de entrada antes de entrar.");
      return;
    }

    router.push("/personagens");
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-2xl text-gold mb-6 text-center">
        {modo === "entrar" ? "Entrar" : "Criar Conta"}
      </h1>

      <div className="card space-y-4">
        <div>
          <label className="label block mb-1">E-mail</label>
          <input
            className="input w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1">Senha</label>
          <input
            className="input w-full"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button className="btn-primary w-full" onClick={enviar} disabled={carregando}>
          {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar Conta"}
        </button>
        {mensagem && <p className="text-sm text-parchment/80">{mensagem}</p>}
        <button
          className="text-sm text-gold/70 hover:text-gold underline block mx-auto"
          onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
        >
          {modo === "entrar" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
      </div>
    </main>
  );
}
