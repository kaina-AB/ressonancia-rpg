import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Dá pra saber, na tela, se as chaves foram configuradas — ver <AvisoSupabase />. */
export const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigurado) {
  console.warn(
    "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (ver README)."
  );
}

// IMPORTANTE: createClient() joga erro se a URL vier vazia — e como o Header entra em
// todas as páginas, isso derrubava o BUILD inteiro na Vercel quando faltava a variável
// ("Error: supabaseUrl is required"). Com um endereço de reserva o site sobe normal,
// e a falta de chave aparece como aviso na tela em vez de deploy quebrado.
export const supabase = createClient(
  supabaseUrl || "https://chave-nao-configurada.supabase.co",
  supabaseAnonKey || "chave-nao-configurada"
);
