# Ressonância RPG — Site

Ficha digital / gerador de personagens do Ressonância RPG. Next.js + Supabase, no
estilo do C.R.I.S. (crisordemparanormal.com).

## O que já tem

- Landing page
- `/login` — criar conta / entrar (Supabase Auth, e-mail + senha)
- `/criar` — assistente de criação (Origem, Classe, distribuição dos 34 pontos de
  Atributo, cálculo ao vivo de Vida/Defesa/Reserva de Carga/Limite de Carga/Peso
  Máximo/Pontos de Concepção) e salva no Supabase, atrelado à conta logada
- `/personagens` — lista SÓ os personagens do usuário logado (protegido por Row
  Level Security no banco, não só por checagem na tela)
- `src/lib/rules/` — TODAS as fórmulas e tabelas do sistema em código
  (`formulas.ts`, `origens.ts`, `classes.ts`, `pericias.ts`). Sempre que uma regra
  mudar no documento de design, é aqui que se atualiza — o site nunca deveria
  "esquecer" uma fórmula que já fechamos.

### Sobre a confirmação por e-mail no cadastro

Por padrão, o Supabase exige que quem se cadastra confirme o e-mail antes de
conseguir entrar (ele manda um e-mail de confirmação sozinho, sem precisar
configurar nada). Pra jogar com seu grupo sem esse passo extra, dá pra
desligar: no painel do Supabase, Authentication → Providers → Email → desmarca
"Confirm email". Se preferir manter ligado, é só avisar o pessoal pra checar a
caixa de entrada (e o spam) depois de criar a conta.

## O que falta (próximos passos naturais)

- Eco/Aplicações (Conceito, Porte, Fusão) na ficha
- Trilhas, Perícias (a tabela já existe em `pericias.ts`, falta a UI)
- Inventário/Peso Máximo com lista de itens de verdade
- O diagrama circular de atributos (visual, estilo C.R.I.S./Runeterra)
- Ficha em abas (Combate / Eco / Perícias / Inventário / Anotações)

## Como rodar local

```bash
npm install
cp .env.local.example .env.local   # depois preencher com suas chaves do Supabase
npm run dev
```

Abre em http://localhost:3000

## Como configurar o Supabase (banco de dados gratuito)

1. Cria conta em https://supabase.com (tem plano free)
2. "New Project" — anota a senha do banco que você escolher
3. No painel do projeto: Project Settings → API → copia "Project URL" e a chave
   "anon public" — cola no `.env.local`
4. SQL Editor → New query → cola o conteúdo de `supabase/schema.sql` → Run
   (isso cria a tabela `personagens` já com login obrigatório e cada jogador só
   vendo os próprios personagens — Row Level Security)
5. Pronto — cria uma conta em `/login` e `/criar` já vai salvar de verdade

### Sobre o plano free do Supabase

Um projeto free pausa sozinho depois de ~1 semana sem nenhuma requisição — os
dados NÃO são apagados, só é preciso reativar o projeto no painel (1 clique)
quando isso acontecer. Pra um projeto em desenvolvimento/com poucos jogadores
isso não costuma ser problema; se o site crescer, dá pra migrar pro plano pago
sem perder nada.

## Como subir pro GitHub

```bash
git init
git add .
git commit -m "Scaffold inicial do site do Ressonância RPG"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ressonancia-rpg.git
git push -u origin main
```

(Cria o repositório vazio antes em github.com/new — sem README/gitignore lá,
pra não conflitar com o que já está aqui.)

## Como publicar (Vercel, gratuito)

1. Cria conta em https://vercel.com (dá pra logar direto com o GitHub)
2. "Add New… → Project" → importa o repositório `ressonancia-rpg`
3. Em "Environment Variables", adiciona as duas mesmas variáveis do
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy — a Vercel te dá uma URL pública (tipo `ressonancia-rpg.vercel.app`)
   automaticamente a cada push no `main`
