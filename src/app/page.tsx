import { RobloxLayout } from '@/components/roblox-layout';
import { RobloxFriends } from '@/components/roblox-friends';
import { UserGroups } from '@/components/user-groups';
import Image from 'next/image';

export default function Home() {
  const USER_ID = '1743461749';

  return (
    <RobloxLayout>
      <div className="flex gap-8 max-w-7xl mx-auto h-full relative w-full">
        {/* COLONNE GAUCHE (Contenu Principal) */}
        <div className="flex-1 space-y-12 min-w-0">
          
          {/* BANNIÈRE PROFIL */}
          <div className="flex items-center gap-6 animate-in fade-in duration-700">
            <div className="relative w-32 h-32 rounded-full bg-[#121314] border-4 border-[#121314] overflow-hidden shadow-2xl flex-shrink-0">
              <Image 
                src={`https://www.roblox.com/headshot-thumbnail/image?userId=${USER_ID}&width=150&height=150&format=png`}
                alt="Profile Avatar"
                fill 
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-black tracking-tight">Bonjour, Frost ! 👋</h1>
              <p className="text-muted-foreground font-medium mt-1">
                @awafrost • <span className="text-green-500 font-bold">En ligne</span>
              </p>
            </div>
          </div>

          {/* AMIS (avec vraies données) */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold">Amis</h2>
              <a 
                href={`https://www.roblox.com/users/${USER_ID}/friends`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                Afficher tout
              </a>
            </div>
            <RobloxFriends userId={USER_ID} />
          </section>

        </div>

        {/* COLONNE DROITE (Groupes Sidebar) */}
        <div className="hidden xl:block w-80 h-[calc(100vh-100px)] sticky top-16 z-10 flex-shrink-0">
          <div className="bg-[#191B1D] rounded-xl border border-[#232527] p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Mes Groupes</h3>
            <UserGroups userId={USER_ID} />
          </div>
        </div>
      </div>
    </RobloxLayout>
  );
}