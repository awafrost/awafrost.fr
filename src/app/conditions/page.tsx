'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TermsPage() {
  return (
    <main className='document-page min-h-screen text-white selection:bg-white selection:text-black font-sans'>
      {/* Navigation */}
      <nav className='document-nav fixed top-0 left-0 z-50 flex w-full items-center justify-between p-4 backdrop-blur-md sm:p-6'>
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
              <h1 className='document-title text-5xl font-black sm:text-6xl'>
                Règles & Bon Comportement
              </h1>
              <p className='text-sm text-gray-500 font-mono tracking-widest uppercase'>
                Pour une communauté positive et respectueuse
              </p>
            </FadeUpDiv>
          </header>

          {/* Content */}
          <div className='space-y-12'>
            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Bienvenue dans ma communauté !</h2>
              <p className='text-gray-400 leading-relaxed'>
                Ce site est une présentation personnelle autour de Roblox et de mes centres d&apos;intérêt. Aucune donnée personnelle n&apos;est collectée ou stockée. Ces règles sont simples et visent juste à maintenir un environnement respectueux et positif pour tous.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Comment bien interagir avec mon contenu</h2>
              <div className='space-y-4'>
                <div className='pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>Soyez respectueux</h3>
                  <p className='text-gray-400 text-sm'>
                    Traite les autres avec kindness et respect. Nous sommes tous ici pour apprécier le contenu. Les critiques constructives sont bienvenues, mais les attaques personnelles ne le sont pas.
                  </p>
                </div>

                <div className='pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>Pas de harcèlement</h3>
                  <p className='text-gray-400 text-sm'>
                    Si je t&apos;ai bloqué, c&apos;est que je souhaitais mettre une limite. Respecte cette limite. Ne crée pas de comptes alternatifs pour contourner cela. Accepte simplement la décision et avance.
                  </p>
                </div>

                <div className='pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>Protège ma vie privée</h3>
                  <p className='text-gray-400 text-sm'>
                    Ne partage pas mes informations personnelles (lieu, identité réelle, coordonnées). Ne crée pas de contenu sans ma permission basé sur ma personne. Le respect mutuel c&apos;est fondamental.
                  </p>
                </div>

                <div className='pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>Pas d&apos;utilisation abusive</h3>
                  <p className='text-gray-400 text-sm'>
                    Ne coordonne pas d&apos;attaques massives, de faux signalements ou de raids. Ne cherche pas à nuire à mes comptes ou à ma réputation. Ces comportements ruinent la communauté.
                  </p>
                </div>

                <div className='pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>Sois authentique</h3>
                  <p className='text-gray-400 text-sm'>
                    Pas de deepfakes, pas de manipulation de mon image ou de mes vidéos. Mon contenu est mon travail, traite-le avec respect.
                  </p>
                </div>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Ce qui peut mener au blocage</h2>
              <div className='space-y-3'>
                <div className='document-callout'>
                  <p className='text-gray-400 text-sm'>
                    <span className='font-bold text-red-400'>Harcèlement ou menaces</span> - Pas de place pour ça dans mes espaces
                  </p>
                </div>
                <div className='document-callout'>
                  <p className='text-gray-400 text-sm'>
                    <span className='font-bold text-red-400'>Contournement de blocage</span> - Si je t&apos;ai bloqué, la décision est finale
                  </p>
                </div>
                <div className='document-callout'>
                  <p className='text-gray-400 text-sm'>
                    <span className='font-bold text-red-400'>Faux signalements coordonnés</span> - C&apos;est abuser des systèmes
                  </p>
                </div>
                <div className='document-callout'>
                  <p className='text-gray-400 text-sm'>
                    <span className='font-bold text-red-400'>Tentatives d&apos;usurpation</span> - Usurper mon identité ou mon contenu
                  </p>
                </div>
                <div className='document-callout'>
                  <p className='text-gray-400 text-sm'>
                    <span className='font-bold text-red-400'>Contenu malveillant me concernant</span> - Mensonges ou diffamation
                  </p>
                </div>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Modération</h2>
              <p className='text-gray-400 leading-relaxed'>
                J&apos;applique ces règles de manière juste. Si tu violes ces directives, je peux te bloquer, supprimer tes messages, ou signaler des comportements graves aux plateformes concernées. Mon objectif n&apos;est pas de punir, mais de créer un espace sain où chacun a du fun.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-4 py-4'>
              <h2 className='text-xl font-bold text-white'>L&apos;essentiel à retenir</h2>
              <p className='text-gray-400 leading-relaxed text-sm'>
                Sois respectueux, authentique et positif. Apprécie le contenu, amuse-toi et aide à construire une communauté cool. C&apos;est tout ce que je demande. Les gens sympas sont toujours les bienvenus !
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Conservation des données</h2>
              <p className='text-gray-400 leading-relaxed'>
                <span className='font-semibold text-white'>Aucune donnée personnelle n&apos;est collectée ou stockée.</span> Ce site affiche uniquement mon profil public Roblox et mes jeux favoris via l&apos;API Roblox publique. Aucun email, mot de passe ou information sensible n&apos;est traité ici.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Questions ou problèmes</h2>
              <p className='text-gray-400 leading-relaxed'>
                Si tu as des questions sobre ces règles ou si quelqu&apos;un viole ces directives, contact-moi sur Discord :
              </p>
              <div className='document-callout mt-4'>
                <p className='text-white font-mono text-sm'>Discord : @frostawa</p>
              </div>
            </FadeUpDiv>
          </div>
        </div>
      </FadeUpStagger>

      {/* Footer */}
      <footer className='site-footer py-12 sm:py-20'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] text-gray-600 font-mono tracking-widest uppercase'>© 2026 Awaji Frost</p>
        </div>
      </footer>
    </main>
  );
}
