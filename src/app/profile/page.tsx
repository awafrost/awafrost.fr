import { GroupsList } from '@/components/groups-list';
import Image from 'next/image';

export default function ProfilePage() {
  const USER_ID = '1743461749';
  const GROUP_IDS = [13212005]; // awafrost.fr

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* PROFILE BANNER */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-xl h-32 relative overflowhidden">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'url(/public/icons/roblox-bg.png)'}} />
        </div>
        
        <div className="flex items-end gap-6 -mt-16 relative z-10 px-6">
          <div className="relative w-32 h-32 rounded-full bg-[#121314] border-4 border-[#121314] overflow-hidden shadow-2xl flex-shrink-0">
            <Image 
              src={`https://www.roblox.com/headshot-thumbnail/image?userId=${USER_ID}&width=150&height=150&format=png`}
              alt="Profile Avatar"
              fill 
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-4xl font-black">Frost</h1>
            <p className="text-muted-foreground">@awafrost</p>
          </div>
        </div>
      </div>

      {/* GROUPES */}
      <section>
        <h2 className="text-2xl font-black mb-6">Mes Groupes</h2>
        <GroupsList groupIds={GROUP_IDS} />
      </section>

      {/* AMIS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black">Informations</h2>
        <div className="bg-[#121314] rounded-xl border border-white/5 p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-muted-foreground">Membres du groupe</span>
            <span className="font-bold">124 👥</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <span className="text-muted-foreground">Amis en ligne</span>
            <span className="font-bold">9 🟢</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Jeux favoris</span>
            <span className="font-bold">3 🎮</span>
          </div>
        </div>
      </section>
    </div>
  );
}
