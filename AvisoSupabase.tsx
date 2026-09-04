"use client";

import { supabaseConfigurado } from "@/lib/supabaseClient";

// Aparece só quando as variáveis de ambiente não chegaram até o site.
// Antes disso o build simplesmente quebrava e não dava pra saber o motivo pela tela.
export function AvisoSupabase() {
  if (supabaseConfigurado) return null;
  return (
    <div className="card border-warn/40 mb-5">
      <div className="label !text-warn mb-2">Banco não configurado</div>
      <p className="text-[13.5px] text-muted leading-relaxed">
        As variáveis <span className="font-mono text-parchment">NEXT_PUBLIC_SUPABASE_URL</span> e{" "}
        <span className="font-mono text-parchment">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> não chegaram até
        aqui, então login e fichas não funcionam. Na Vercel: Settings → Environment Variables → adiciona
        as duas → Deployments → Redeploy. Local: põe no <span className="font-mono text-parchment">.env.local</span>.
      </p>
    </div>
  );
}
