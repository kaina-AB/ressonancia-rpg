import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-5xl text-gold mb-4">RESSONÂNCIA RPG</h1>
      <p className="text-parchment/80 mb-10 text-lg">
        Toda existência deixa uma marca. Ressonância intensa o bastante produz Carga.
        Carga acumulada gera um Eco. Todo Eco representa um Conceito.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/criar" className="btn-primary">
          Criar Personagem
        </Link>
        <Link href="/personagens" className="btn-secondary">
          Meus Personagens
        </Link>
      </div>
    </main>
  );
}
