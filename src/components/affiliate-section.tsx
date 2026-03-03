'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MdHandshake, MdLink, MdBarChart, MdAutoAwesome } from 'react-icons/md';

export default function AffiliationSection() {
  const { data: session } = useSession();

  return (
    <section className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-8 space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MdHandshake size={28} className="text-white" /> Programme d&apos;affiliation
        </h2>
        <p className="text-muted-foreground">
          Rejoignez notre programme d&apos;affiliation et créez votre lien personnalisé pour la communauté Sai Café
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-muted/50 p-6">
          <div className="mb-3">
            <MdLink size={28} className="text-white" />
          </div>
          <h3 className="font-semibold mb-2">Lien Unique</h3>
          <p className="text-sm text-muted-foreground">
            Obtenez votre code d&apos;affiliation personnel
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-6">
          <div className="mb-3">
            <MdBarChart size={28} className="text-white" />
          </div>
          <h3 className="font-semibold mb-2">Statistiques</h3>
          <p className="text-sm text-muted-foreground">
            Suivez vos visites et clics en temps réel
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-6">
          <div className="mb-3">
            <MdAutoAwesome size={28} className="text-white" />
          </div>
          <h3 className="font-semibold mb-2">Personnalisation</h3>
          <p className="text-sm text-muted-foreground">
            Ajoutez vos réseaux sociaux préférés
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {session ? (
          <Link
            href="/dashboard/affiliate"
            className="px-6 py-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors text-center font-semibold"
          >
            Accéder à Mon Affiliation
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors text-center font-semibold"
          >
            Créer Mon Lien d&apos;Affiliation
          </Link>
        )}
        <button
          onClick={() => window.open('https://discord.gg/WgBTgHyjag', '_blank')}
          className="px-6 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center font-semibold cursor-pointer"
        >
          Rejoindre le Discord
        </button>
      </div>
    </section>
  );
}
