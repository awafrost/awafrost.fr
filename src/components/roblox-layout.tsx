'use client';
import { FaHome, FaShoppingBag, FaBars, FaSearch, FaCog } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export function RobloxLayout({ children }: { children: React.ReactNode }) {
  const USER_ID = '1743461749';

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-white flex flex-col font-sans">
      {/* TOPBAR (Sombre) */}
      <header className="h-12 bg-[#121314] flex items-center justify-between px-4 fixed w-full z-50 border-b border-black/30 shadow-md">
        <div className="flex items-center gap-4">
          <FaBars className="text-xl cursor-pointer opacity-70 hover:opacity-100" />
          <Link href="/" className="font-black text-xl tracking-tight">ROBLOX</Link>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Rechercher" 
            className="w-full bg-[#09090A] border border-[#2A2C2E] rounded-md py-1.5 px-4 text-sm focus:border-white/30 outline-none"
          />
          <FaSearch className="absolute right-3 top-3.5 text-muted-foreground text-xs" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-sm cursor-pointer hover:bg-black/60">
             <span className="text-sm font-bold text-green-400">1,250</span>
             <div className="w-4 h-4 bg-green-500 rounded-sm" title="Robux" /> 
          </div>
          <FaCog className="text-xl opacity-70 hover:rotate-90 transition-transform cursor-pointer" />
        </div>
      </header>

      <div className="flex pt-12 flex-1 relative">
        {/* SIDEBAR (Sombre) */}
        <aside className="w-12 lg:w-48 bg-[#121314] hidden md:flex flex-col py-4 gap-0.5 fixed h-full border-r border-black/20 z-40">
          <SidebarItem icon={<FaHome className="text-xl"/>} label="Accueil" active />
          
          <Link href="/profile" className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black/40 border-2 border-transparent group-hover:border-white/20">
              <Image 
                src={`https://www.roblox.com/headshot-thumbnail/image?userId=${USER_ID}&width=48&height=48&format=png`}
                alt="Profile"
                fill
                unoptimized
              />
            </div>
            <span className="hidden lg:block text-sm font-medium">Profil</span>
          </Link>

          <SidebarItem icon={<FaShoppingBag className="text-xl"/>} label="Boutique" />
          
          <div className="border-t border-white/5 my-4 mx-4" />
          <p className="text-[10px] text-muted-foreground px-5 hidden lg:block uppercase font-black opacity-60">Groupes</p>
        </aside>

        {/* MAIN */}
        <main className="flex-1 md:ml-12 lg:ml-48 p-8 overflow-y-auto z-30 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 cursor-pointer ${active ? 'bg-white/5 border-l-4 border-white' : 'hover:bg-white/5 opacity-80 hover:opacity-100'}`}>
      <span>{icon}</span>
      <span className="hidden lg:block text-sm font-medium">{label}</span>
    </div>
  );
}