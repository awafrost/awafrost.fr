'use client';

import { FadeUpStagger, FadeUpDiv } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';
import { RobloxAvatar3D } from '@/components/roblox-avatar-3d';
import { AvatarAccessories } from '@/components/avatar-accessories';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function AvatarPage() {
  const ROBLOX_USER_ID = '1743461749';

  return (
    <main className='container space-y-8 py-6 lg:my-10'>
      <FadeUpStagger>
        {/* En-tête */}
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='flex items-center gap-2 rounded-lg bg-muted px-4 py-2 transition-colors hover:bg-muted/80'
          >
            <FaArrowLeft className='h-4 w-4' />
            Retour
          </Link>
          <ThemeToggle />
        </div>

        {/* Avatar 3D Principal */}
        <FadeUpDiv className='rounded-xl border bg-card p-8'>
          <div className='flex flex-col items-center space-y-4'>
            <h1 className='text-4xl font-black lg:text-5xl'>Mon Avatar</h1>
            <div className='w-full flex justify-center'>
              <RobloxAvatar3D
                userId={ROBLOX_USER_ID}
                width={300}
                height={300}
                className='w-64 h-64 lg:w-80 lg:h-80'
              />
            </div>
            <p className="text-center text-xs text-muted-foreground lg:text-sm">
              Cliquez sur l&apos;avatar pour le voir en 3D / Faites-le pivoter pour le voir sous tous les angles
            </p>
          </div>
        </FadeUpDiv>

        {/* Accessoires et Équipement */}
        <FadeUpDiv>
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-bold">Mon Équipement</h2>
            <p className="text-muted-foreground">Les articles que j&apos;utilise sur mon avatar</p>
          </div>
          <AvatarAccessories userId={ROBLOX_USER_ID} />
        </FadeUpDiv>
      </FadeUpStagger>
    </main>
  );
}
