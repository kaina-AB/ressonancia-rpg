# Ressonância RPG — Site

Ficha digital / gerador de personagens do Ressonância RPG. Next.js + Supabase, no
estilo do C.R.I.S. (crisordemparanormal.com).

## O que já tem

- `/` — home simples, no formato de faixas alternadas (uma frase + uma
  demonstração de verdade da tela), com o guia do site fixo no topo
- `/login` — criar conta / entrar (Supabase Auth, e-mail + senha)
- `/criar` — criação em **5 etapas** (Nome → Atributos → Origem → Classe →
  Revisar). Sem nenhum `<select>` do navegador: Origem e Classe são lista
  sanfonada com botão Escolher. Roda de Atributos ao vivo e cálculo imediato de
  Vida/Defesa/Reserva de Carga/Limite de Carga/Peso Máximo/Concepção
- `/ficha/[id]` — a ficha, com navegador de seções (Resumo, Perícias,
  Inventário, Anotações), barras de Vida e Carga com o marcador de Limite por
  ação, tabela de Perícias com compra de grau, mochila com Peso Máximo e
  anotações. Salva de volta no Supabase
- `/personagens` — lista SÓ os personagens do usuário logado (protegido por Row
  Level Security no banco, não só por checagem na tela)
- `/regras` — as regras renderizadas direto de `src/lib/rules/`, então nunca
  ficam desatualizadas em relação ao que a ficha calcula
- `src/lib/rules/` — TODAS as fórmulas e tabelas do sistema em código
  (`formulas.ts`, `origens.ts`, `classes.ts`, `pericias.ts`). Sempre que uma regra
  mudar no documento de design, é aqui que se atualiza — o site nunca deveria
  "esquecer" uma fórmula que já fechamos.
- `src/lib/ficha.ts` — o formato do JSON salvo no banco, com migração automática
  das fichas antigas (versão 1) que só tinham atributos.

### Como funciona o Grau de Perícia (a regra que a ficha aplica)

O bônus do teste vem do **grau daquela perícia**, não do nível: Treinado +2,
Adepto +3, Especialista +4, Mestre +5. O número que aparece na coluna Total é
`valor do atributo + bônus do grau`.

O custo em Pontos de Perícia é **acumulado**: 1 / 3 / 6 / 10. Como já está pago
o que você comprou antes, subir um degrau custa só a diferença — de Treinado
para Adepto são 2 pontos, não 3. Isso está em `custoParaSubirGrau()` e
`custoDoProximoGrau()`.

O **Tier do nível não soma nada** no teste. Ele só define até que grau dá pra
comprar: até nível 5 só Treinado, 6–10 Adepto, 11–15 Especialista, 16+ Mestre
(`grauMaximoPorNivel()`).

### Sobre a confirmação por e-mail no cadastro

Por padrão, o Supabase exige que quem se cadastra confirme o e-mail antes de
conseguir entrar (ele manda um e-mail de confirmação sozinho, sem precisar
configurar nada). Pra jogar com seu grupo sem esse passo extra, dá pra
desligar: no painel do Supabase, Authentication → Providers → Email → desmarca
"Confirm email". Se preferir manter ligado, é só avisar o pessoal pra checar a
caixa de entrada (e o spam) depois de criar a conta.

## O que falta (próximos passos naturais)

- Eco/Aplicações (Conceito, Porte, Fusão) na ficha
- Trilhas
- Subir de nível pela própria ficha (hoje o nível só entra na criação)
- Lista de equipamento com preço, em vez de item digitado na mão
- Rebalancear os Pontos de Perícia pra Inteligência não dominar (a gente já
  falou disso — Combatente puxando de Força, etc.)

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

## Atualizando o site pelo site do GitHub (sem terminal)

Isso já deu problema uma vez: o site ficou com metade dos arquivos novos e
metade dos velhos (botão vermelho + título roxo). Acontece quando os arquivos
**de dentro de `src/app/`** não são substituídos junto.

Fazendo pela interface do GitHub:

1. No repositório, clica em **Add file → Upload files**
2. Arrasta a pasta inteira do projeto (menos `node_modules`, `.next` e
   `.env.local`) — o GitHub aceita arrastar pasta e mantém a estrutura
3. Confere na lista antes de commitar se aparecem os arquivos dentro de
   `src/app/`, `src/components/` e `src/lib/` — se não aparecerem, o upload veio
   incompleto
4. Commita. A Vercel refaz o deploy sozinha

Se ficar mais fácil, dá pra apagar as pastas `src/` e os arquivos de config na
interface do GitHub antes de subir os novos — assim não sobra nada velho.

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
