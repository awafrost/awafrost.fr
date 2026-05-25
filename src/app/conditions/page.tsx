'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TermsPage() {
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
                Conditions d&apos;Utilisation
              </h1>
              <p className='text-sm text-gray-500 font-mono tracking-widest uppercase'>
                Dernière mise à jour : 2026
              </p>
            </FadeUpDiv>
          </header>

          {/* Content */}
          <div className='space-y-12'>
            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>1. Acceptation des Conditions</h2>
              <p className='text-gray-400 leading-relaxed'>
                En accédant et en utilisant ce site web, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser ce site.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>2. Utilisation Acceptable</h2>
              <div className='space-y-4'>
                <p className='text-gray-400'>
                  Vous acceptez d&apos;utiliser ce site uniquement à des fins légales. En particulier, vous vous engagez à :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm text-gray-400'>
                  <li>Respecter toutes les lois et réglementations applicables</li>
                  <li>Ne pas utiliser le site pour des activités illégales ou non autorisées</li>
                  <li>Ne pas interférer avec l&apos;utilisation du site par d&apos;autres utilisateurs</li>
                  <li>Ne pas accéder aux systèmes de manière non autorisée</li>
                </ul>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white text-red-400'>3. Protections Légales & Risques Encourus</h2>
              <div className='space-y-6'>
                
                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>A. Atteinte à l&apos;Image et à la Vie Privée</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Toute utilisation non autorisée de mon image, de mon nom, de mes contenus ou de données me concernant est strictement interdite. Cela inclut, sans s&apos;y limiter :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>L&apos;utilisation de mon image à des fins commerciales sans consentement</li>
                    <li>Le deepfake, la manipulation ou l&apos;altération d&apos;images/vidéos</li>
                    <li>La publication d&apos;informations personnelles ou privées</li>
                    <li>L&apos;utilisation de mon identité ou de mon image pour usurper mon identité</li>
                  </ul>
                  <p className='text-red-400 font-mono text-xs mt-3'>Risque légal : Article L.226-1 du Code Pénal (droit à l&apos;image)</p>
                </div>

                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>B. Diffamation, Injures et Contenu Offensant</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Toute déclaration fausse, trompeuse ou malveillante conçue pour nuire à ma réputation est interdite. Cela inclut :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>Les fausses accusations ou affirmations sans fondement</li>
                    <li>Les insultes, injures ou attaques personnelles</li>
                    <li>La publication de mensonges visant à me discréditer</li>
                    <li>Les campagnes de cyber-harcèlement coordonnées</li>
                    <li>La propagation de désinformation me concernant</li>
                  </ul>
                  <p className='text-red-400 font-mono text-xs mt-3'>Fondement légal : Articles L.226-2, L.226-3 et suivants du Code Pénal (diffamation et injures publiques)</p>
                </div>

                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>C. Harcèlement et Intimidation</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Toute forme de harcèlement, d&apos;intimidation ou de menace est strictement interdite. Cela comprend :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>Les messages menaces répétés</li>
                    <li>Le cyber-harcèlement systématique</li>
                    <li>Les tentatives d&apos;intimidation ou de chantage</li>
                    <li>La sollicitation de tierces personnes pour me harceler</li>
                    <li>Le suivi obsessionnel ou la surveillance non consentie</li>
                  </ul>
                  <p className='text-red-400 font-mono text-xs mt-3'>Fondement légal : Article L.222-33-2 du Code Pénal (harcèlement)</p>
                </div>

                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>D. Contournement du Blocage et Harcèlement Persistant</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Si je vous ai bloqué, cela signifie que je ne souhaite pas de contact. Contourner ce blocage par quelque moyen que ce soit est strictement interdit. Cela inclut :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>Créer des comptes alternatifs pour contacter ou suivre mon contenu</li>
                    <li>Utiliser des tiers pour communiquer avec moi</li>
                    <li>Accéder à mon contenu via des proxies ou comptes d&apos;amis</li>
                    <li>Poursuivre le contact après blocage par d&apos;autres canaux (Discord, email, etc.)</li>
                    <li>Continuer à interagir avec mon contenu de manière perturbatrice</li>
                  </ul>
                  <p className='text-red-400 font-mono text-xs mt-3'>Fondement légal : Article L.222-33-2 du Code Pénal (harcèlement persistant malgré interdiction)</p>
                </div>

                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>E. Signalements Massifs et Abus de Plateforme</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Organiser ou encourager des signalements coordonnés, des attaques en masse ou des abus systématiques est interdit. Cela inclut :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>Coordonner un groupe de personnes pour me signaler massivement aux plateformes</li>
                    <li>Organiser des campagnes de &quot;raid&quot; ou d&apos;attaques coordonnées</li>
                    <li>Les &quot;waves&quot; de reports faux et coordonnés</li>
                    <li>Encourager publiquement ou privément au boycott systématique</li>
                    <li>Utiliser des bots ou automatisations pour nuire à mes comptes</li>
                  </ul>
                  <p className='text-gray-400 leading-relaxed text-sm mt-2'>
                    Ces actions constituent un abus des systèmes de signalement et peuvent entraver la justice. Elles peuvent être signalées aux plateformes concernées pour action.
                  </p>
                  <p className='text-red-400 font-mono text-xs mt-3'>Fondement légal : Articles L.226-2, L.222-33-2 du Code Pénal ; Article 6 RGPD</p>
                </div>

                <div className='border-l-2 border-red-500 pl-4'>
                  <h3 className='text-lg font-bold text-white mb-2'>F. Atteinte à la Sécurité Personnelle</h3>
                  <p className='text-gray-400 leading-relaxed text-sm'>
                    Toute tentative de nuire à ma sécurité personnelle, financière ou numérique est strictement interdite. Cela inclut :
                  </p>
                  <ul className='list-disc list-inside space-y-2 text-sm text-gray-400 mt-2'>
                    <li>Les menaces de violence physique</li>
                    <li>La révélation d&apos;informations de localisation personnelle (doxxing)</li>
                    <li>Les tentatives de piratage ou d&apos;accès non autorisé à mes comptes</li>
                    <li>Les arnaques, usurpation d&apos;identité ou fraude</li>
                    <li>Les contenus incitant à la violence ou à des actes nuisibles</li>
                    <li>La partage d&apos;informations sensibles pour organiser du harcèlement hors ligne</li>
                  </ul>
                  <p className='text-red-400 font-mono text-xs mt-3'>Fondement légal : Articles L.222-1 et suivants du Code Pénal (menaces de mort), Articles L.226-1 et L.226-2 (droit à l&apos;image et diffamation), Article L.323-1 (accès frauduleux)</p>
                </div>

              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>4. Responsabilité et Conséquences Légales</h2>
              <div className='space-y-4'>
                <p className='text-gray-400'>
                  Vous reconnaissez et acceptez que :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm text-gray-400'>
                  <li>Les violations de ces conditions peuvent donner lieu à des poursuites civiles et pénales</li>
                  <li>Vous êtes responsable de toutes les actions effectuées sous votre identité</li>
                  <li>Les dommages causés peuvent être réclamés en vertu du droit français (Article 1382 du Code Civil)</li>
                  <li>Je peux signaler les violations aux autorités compétentes (gendarmerie, police, plateforme)</li>
                  <li>Les preuves de violations peuvent être conservées et utilisées à titre probant</li>
                </ul>
                <div className='mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400'>
                  <p className='font-bold mb-1'>Cadre Légal Applicable :</p>
                  <p className='font-mono'>Code Pénal : Articles L.222-1 (menaces), L.226-1 à L.226-3 (atteintes), L.222-33-2 (harcèlement), L.323-1 (accès frauduleux)</p>
                  <p className='font-mono mt-1'>Code Civil : Article 1382 (responsabilité délictuelle)</p>
                </div>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>5. Modération et Enforcement</h2>
              <div className='space-y-4 text-gray-400'>
                <p>
                  Je me réserve le droit de :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Bloquer, bannir ou restreindre l&apos;accès aux utilisateurs en violation</li>
                  <li>Signaler les violations aux plateformes concernées</li>
                  <li>Signaler les activités criminelles aux autorités</li>
                  <li>Poursuivre en justice les auteurs de violations graves</li>
                  <li>Prendre toute autre action légale disponible</li>
                </ul>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>6. Propriété Intellectuelle</h2>
              <div className='space-y-4'>
                <p className='text-gray-400 leading-relaxed'>
                  Tous les contenus publiés sur ce site (textes, images, vidéos, logos) sont protégés par le droit d&apos;auteur. Toute reproduction sans autorisation est interdite.
                </p>
                <p className='text-xs text-gray-500 font-mono'>
                  Fondement légal : Code de la Propriété Intellectuelle, Articles L.111-1 et suivants
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>7. Exonération de Responsabilité</h2>
              <p className='text-gray-400 leading-relaxed'>
                Ce site est fourni &quot;tel quel&quot;. Je ne garantis pas l&apos;exactitude, la complétude ou la fiabilité des contenus. Je ne suis pas responsable des dommages résultant de votre utilisation du site.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>8. Modifications des Conditions</h2>
              <p className='text-gray-400 leading-relaxed'>
                Je me réserve le droit de modifier ces conditions à tout moment. Les modifications seront effectives immédiatement après publication. L&apos;utilisation continue du site implique l&apos;acceptation des conditions modifiées.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 space-y-6'>
              <h2 className='text-2xl font-bold text-white'>9. Contact et Signalement</h2>
              <p className='text-gray-400 leading-relaxed'>
                Pour signaler une violation de ces conditions ou toute activité suspecte, veuillez me contacter via :
              </p>
              <div className='mt-4 p-4 bg-white/5 rounded-lg border border-white/10'>
                <p className='text-white font-mono text-sm'>Discord : @awafrost</p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-6'>
              <h2 className='text-xl font-bold text-red-400'>⚠ Avertissement Légal Important</h2>
              <div className='space-y-3'>
                <p className='text-gray-400 leading-relaxed text-sm'>
                  Le non-respect de ces conditions peut vous exposer à des poursuites civiles et pénales en France. Les lois applicables incluent :
                </p>
                <ul className='list-disc list-inside space-y-1 text-xs text-gray-400 font-mono'>
                  <li>Code Pénal : Articles L.222-1, L.222-33-2 et suivants, L.226-1 à L.226-3, L.323-1</li>
                  <li>Code Civil : Article 1382 (responsabilité délictuelle)</li>
                  <li>Loi Informatique et Libertés : Articles 82-86</li>
                  <li>RGPD (Règlement 2016/679/UE) : Articles 5, 6, 12-22, 32 et suivants</li>
                </ul>
                <p className='text-red-400 leading-relaxed text-sm font-bold'>
                  Soyez conscient des implications légales graves de vos actions en ligne. Les poursuites peuvent entraîner des dommages financiers importants et des peines d&apos;emprisonnement.
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
