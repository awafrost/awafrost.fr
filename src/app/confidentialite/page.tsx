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
                Transparence complète
              </p>
            </FadeUpDiv>
          </header>

          {/* Content */}
          <div className='space-y-12'>
            <FadeUpDiv className='rounded-2xl border border-green-500/20 bg-green-500/5 p-8 space-y-4'>
              <h2 className='text-2xl font-bold text-green-400'>✅ Aucune donnée stockée</h2>
              <p className='text-gray-400 leading-relaxed'>
                Ce site ne collecte, ne stocke et ne traite <span className='font-bold text-white'>aucune donnée personnelle</span>. Pas d&apos;email, pas de nom, pas de cookies de suivi, rien. C&apos;est un site statique qui affiche juste mon profil Roblox public.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>Ce que tu vois sur ce site</h2>
              <div className='space-y-4 text-gray-400'>
                <p>
                  Les informations affichées proviennent uniquement de l&apos;API publique de Roblox :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Mon profil public Roblox (nom, description, avatar)</li>
                  <li>Mes jeux favoris</li>
                  <li>Informations sur mon groupe Roblox</li>
                </ul>
                <p className='text-xs text-gray-500 font-mono mt-4'>
                  Ces données sont publiques sur Roblox et ne posent aucun risque de confidentialité.
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>Cookies & Suivi</h2>
              <p className='text-gray-400 leading-relaxed'>
                Ce site n&apos;utilise pas de cookies de suivi, pas de Google Analytics, pas de publicités. Zéro tracking. Tu peux naviguer tranquille.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>Tes droits</h2>
              <p className='text-gray-400 leading-relaxed mb-4'>
                Puisque aucune donnée n&apos;est collectée, tes droits de confidentialité sont d&apos;office respectés. Mais dans le contexte du RGPD :
              </p>
              <ul className='list-disc list-inside space-y-2 text-sm text-gray-400'>
                <li>Tu n&apos;as rien à me demander d&apos;oublier (je ne stocke rien)</li>
                <li>Tu n&apos;as pas à t&apos;inquiéter du contrôle de tes données (y&apos;en a pas)</li>
                <li>Tu es 100% en sécurité sur ce site</li>
              </ul>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>Contact</h2>
              <div className='space-y-3'>
                <p className='text-gray-400'>
                  Si tu as des questions sur cette politique (même si y&apos;a pas grand chose à dire 😄) :
                </p>
                <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
                  <p className='text-white font-mono text-sm'>Discord : @awafrost</p>
                </div>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 space-y-4'>
              <h2 className='text-xl font-bold text-blue-400'>ℹ️ Résumé simple</h2>
              <p className='text-gray-400 leading-relaxed text-sm'>
                Je suis créateur de contenu, pas une plateforme. Ce site montre juste mon profil public. Aucune collecte de données. Aucun suivi. Juste du contenu. C&apos;est transparent et c&apos;est bon pour toi.
              </p>
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
