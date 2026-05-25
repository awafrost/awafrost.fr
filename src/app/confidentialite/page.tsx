'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ConfidentialitePage() {
  return (
    <main className='min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black font-sans'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5'>
        <a href='/' className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
          <span className='text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400'>@awafrost</span>
        </a>
        <ThemeToggle />
      </nav>

      <FadeUpStagger>
        <div className='container mx-auto px-6 py-28 lg:py-40 max-w-4xl'>
          {/* Header */}
          <header className='mb-20'>
            <FadeUpDiv className='space-y-4'>
              <h1 className='text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent'>
                Politique de Confidentialité
              </h1>
              <p className='text-sm text-gray-500 font-mono tracking-widest uppercase'>
                Dernière mise à jour : 2026
              </p>
            </FadeUpDiv>
          </header>

          {/* Content */}
          <div className='space-y-12'>
            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>Introduction</h2>
              <p className='text-gray-400 leading-relaxed'>
                Chez awafrost, votre confidentialité est importante. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>1. Informations Collectées</h2>
              <div className='space-y-4 text-gray-400'>
                <p>Nous collectons les informations suivantes :</p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Informations d&apos;identification (nom, adresse email)</li>
                  <li>Données de navigation et d&apos;utilisation du site</li>
                  <li>Cookies et technologies de suivi</li>
                  <li>Données de l&apos;API Roblox (profil public uniquement)</li>
                </ul>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>2. Utilisation des Données</h2>
              <div className='space-y-4 text-gray-400'>
                <p>Vos données sont utilisées pour :</p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Améliorer nos services et le contenu du site</li>
                  <li>Analyser l&apos;utilisation du site</li>
                  <li>Maintenir la sécurité et prévenir la fraude</li>
                  <li>Communiquer avec vous si nécessaire</li>
                </ul>
                <p className='text-xs text-gray-500 font-mono mt-3'>
                  Fondement légal : Article 6 du RGPD (Licéité du traitement)
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>3. Protection des Données</h2>
              <div className='space-y-4'>
                <p className='text-gray-400 leading-relaxed'>
                  Nous employons des mesures de sécurité appropriées pour protéger vos informations personnelles contre l&apos;accès, l&apos;altération, l&apos;autodestruction non autorisée et l&apos;exposition accidentelle, notamment le chiffrement et les pare-feu.
                </p>
                <p className='text-xs text-gray-500 font-mono'>
                  Fondement légal : Article 32 du RGPD (Sécurité du traitement)
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>4. Partage des Données</h2>
              <p className='text-gray-400 leading-relaxed'>
                Nous ne vendons, n&apos;échangeons ou ne louons pas vos informations personnelles à des tiers. Nous pouvons partager des données agrégées et anonymisées avec des partenaires de confiance.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>5. Vos Droits</h2>
              <div className='space-y-4 text-gray-400'>
                <p>Vous avez les droits suivants en vertu du RGPD et de la Loi Informatique et Libertés :</p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li><span className='text-white font-semibold'>Droit d&apos;accès</span> - Accéder à vos données personnelles (Article 15 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit de rectification</span> - Rectifier les informations inexactes (Article 16 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit à l&apos;oubli</span> - Demander la suppression de vos données (Article 17 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit à la limitation</span> - Limiter le traitement de vos données (Article 18 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit à la portabilité</span> - Recevoir vos données dans un format portable (Article 20 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit d&apos;opposition</span> - Vous opposer au traitement de vos données (Article 21 RGPD)</li>
                  <li><span className='text-white font-semibold'>Droit de non-discrimination</span> - Ne pas être discriminé pour l&apos;exercice de ces droits (Article 22 RGPD)</li>
                </ul>
                <p className='text-xs text-gray-500 font-mono mt-3'>
                  Fondement légal : Articles 12-22 du RGPD ; Articles 82-86 de la Loi Informatique et Libertés
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>6. Droits du Responsable de Traitement</h2>
              <div className='space-y-4 text-gray-400'>
                <p>
                  En tant que responsable de traitement de vos données, j&apos;ai l&apos;obligation de :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Traiter vos données de manière transparente et loyale</li>
                  <li>Limiter la collecte au strict nécessaire (minimisation des données)</li>
                  <li>Maintenir l&apos;exactitude et l&apos;intégrité des données</li>
                  <li>Assurer la confidentialité par des mesures de sécurité appropriées</li>
                  <li>Respecter vos droits en matière de protection des données</li>
                </ul>
                <p className='text-xs text-gray-500 font-mono mt-3'>
                  Fondement légal : Articles 5, 6, 32 du RGPD
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>7. Contact et Réclamation</h2>
              <div className='space-y-4'>
                <p className='text-gray-400 leading-relaxed'>
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez me contacter via :
                </p>
                <div className='mt-4 p-4 bg-white/5 rounded-lg border border-white/10'>
                  <p className='text-white font-mono text-sm'>Discord : @awafrost</p>
                </div>
                <p className='text-gray-400 leading-relaxed text-sm'>
                  Vous avez également le droit de déposer une plainte auprès de l&apos;autorité de contrôle compétente (CNIL en France) si vous estimez que vos droits n&apos;ont pas été respectés.
                </p>
              </div>
            </FadeUpDiv>
          </div>
        </div>
      </FadeUpStagger>

      {/* Footer */}
      <footer className='py-20 border-t border-white/5'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] text-gray-600 font-mono tracking-widest uppercase'>© 2026 Awaji Frost</p>
        </div>
      </footer>
    </main>
  );
}
