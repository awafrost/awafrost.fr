'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ConfidentialitePage() {
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
                Politique de Confidentialité
              </h1>
              <p className='text-sm text-gray-500 font-mono tracking-widest uppercase'>
                Transparence complète
              </p>
            </FadeUpDiv>
          </header>

          {/* Content */}
          <div className='space-y-12'>
            <FadeUpDiv className='document-section space-y-4 py-4'>
              <h2 className='text-2xl font-bold text-white'>Données affichées</h2>
              <p className='text-gray-400 leading-relaxed'>
                Le site affiche des informations publiques de mon profil Roblox et des valeurs d&apos;objets MM2. Les données de Roblox et les valeurs MM2 sont récupérées auprès de leurs services respectifs afin d&apos;afficher les pages.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Ce que tu vois sur ce site</h2>
              <div className='space-y-4 text-gray-400'>
                <p>
                  Les informations publiques de Roblox affichées peuvent inclure :
                </p>
                <ul className='list-disc list-inside space-y-2 text-sm'>
                  <li>Mon profil public Roblox (nom, description, avatar)</li>
                  <li>Mes jeux favoris</li>
                  <li>Informations sur mon groupe Roblox</li>
                  <li>Des informations sur les objets de Murder Mystery 2, fournies par RBLXValue</li>
                </ul>
                <p className='text-xs text-gray-500 font-mono mt-4'>
                  Ces services tiers traitent les requêtes selon leurs propres politiques de confidentialité.
                </p>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Cookie de préférences</h2>
              <p className='text-gray-400 leading-relaxed'>
                La page du comparateur MM2 utilise un cookie fonctionnel, stocké dans ton navigateur pendant 180 jours. Il mémorise ta recherche, tes filtres et les objets choisis des deux côtés du trade pour retrouver ta dernière comparaison. Il n&apos;est pas utilisé pour le suivi publicitaire. Tu peux le supprimer dans les paramètres de cookies de ton navigateur.
              </p>
              <p className='text-gray-400 leading-relaxed'>
                Le site n&apos;intègre pas d&apos;outil d&apos;analyse d&apos;audience ni de publicité. L&apos;hébergeur peut toutefois traiter des données techniques nécessaires au fonctionnement et à la sécurité du site, conformément à sa propre politique.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Demandes de suppression de vidéo</h2>
              <p className='text-gray-400 leading-relaxed'>
                Si tu utilises le formulaire de la page d&apos;accueil, le lien TikTok fourni et le motif écrit sont transmis à un webhook Discord privé afin que la demande puisse être examinée. N&apos;ajoute pas d&apos;informations sensibles ou de données personnelles qui ne sont pas nécessaires. Le site ne conserve pas de copie des demandes dans une base de données ; Discord et l&apos;hébergeur peuvent traiter les informations selon leurs propres politiques et durées de conservation.
              </p>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Tes demandes et tes droits</h2>
              <div className='space-y-3'>
                <p className='text-gray-400'>
                  Pour poser une question sur cette politique ou demander la suppression des informations envoyées via le formulaire, contacte-moi sur Discord. Une demande de retrait de vidéo n&apos;est pas une garantie de suppression sur TikTok ; la plateforme peut aussi être contactée directement.
                </p>
                <div className='document-callout'>
                  <p className='text-white font-mono text-sm'>Discord : @awafrost</p>
                </div>
              </div>
            </FadeUpDiv>

            <FadeUpDiv className='document-section space-y-4 py-4'>
              <h2 className='text-xl font-bold text-white'>Résumé simple</h2>
              <p className='text-gray-400 leading-relaxed text-sm'>
                Le comparateur garde tes préférences dans un cookie fonctionnel. Le formulaire transmet le lien TikTok et le motif de ta demande à Discord pour traitement. Pas de publicité ni d&apos;outil d&apos;analyse d&apos;audience.
              </p>
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
