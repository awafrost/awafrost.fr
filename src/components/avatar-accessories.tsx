'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Accessory {
  id: number;
  name: string;
  category: string;
  imageUrl?: string;
}

export function AvatarAccessories({ userId }: { userId: string }) {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`https://avatar.roblox.com/v1/users/${userId}/avatar`);
        const data = await res.json();
        
        const assetIds = data.assets.map((a: any) => a.id);
        
        // Récupérer les miniatures des assets
        const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetIds.join(',')}&size=150x150&format=png`);
        const thumbData = await thumbRes.json();

        const formatted = data.assets.map((asset: any) => ({
          id: asset.id,
          name: asset.name,
          category: asset.assetType.name,
          imageUrl: thumbData.data?.find((t: any) => t.targetId === asset.id)?.imageUrl
        }));

        setAccessories(formatted);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchAll();
  }, [userId]);

  if (loading) return <div className="grid grid-cols-3 md:grid-cols-6 gap-4 animate-pulse"><div className="h-32 bg-muted rounded-xl col-span-full"></div></div>;

  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
      {accessories.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.03 }}
          className='bg-card border rounded-xl p-2 hover:shadow-md transition-shadow cursor-pointer group'
        >
          <div className='aspect-square relative mb-2 bg-secondary rounded-lg overflow-hidden'>
            {item.imageUrl && (
              <Image src={item.imageUrl} alt={item.name} fill className='object-cover p-1 group-hover:scale-110 transition-transform' />
            )}
          </div>
          <p className='text-[10px] font-bold uppercase text-muted-foreground truncate'>{item.category}</p>
          <p className='text-xs font-semibold truncate leading-tight'>{item.name}</p>
        </motion.div>
      ))}
    </div>
  );
}