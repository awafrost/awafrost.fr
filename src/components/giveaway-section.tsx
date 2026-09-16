'use client';

import { FormEvent, useEffect, useState } from 'react';

type Giveaway = {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl: string;
  endsAt: string;
  participantCount: number;
};

export function GiveawaySection() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    fetch('/api/giveaways')
      .then((response) => response.json())
      .then(setGiveaways)
      .catch(() => setMessage('Impossible de charger les giveaways.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function formatRemaining(endsAt: string) {
    const remaining = Math.max(0, new Date(endsAt).getTime() - now);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${days}j ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }

  async function participate(event: FormEvent<HTMLFormElement>, giveawayId: string) {
    event.preventDefault();
    setMessage('');
    const response = await fetch(`/api/giveaways/${giveawayId}/participate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || 'Une erreur est survenue.');
      return;
    }
    setGiveaways((current) => current.map((giveaway) => giveaway.id === giveawayId ? { ...giveaway, participantCount: result.participantCount } : giveaway));
    setUsername('');
    setMessage('Participation enregistrée. Bonne chance !');
  }

  return (
    <div className='space-y-6'>
      {loading && <p className='text-sm text-gray-500'>Chargement des giveaways...</p>}
      {!loading && giveaways.length === 0 && <p className='text-sm text-gray-500'>Aucun giveaway en cours pour le moment.</p>}
      {giveaways.map((giveaway) => (
        <article key={giveaway.id} className='rounded-2xl border border-white/10 bg-[#111111] p-6'>
          <div className='mb-6 overflow-hidden rounded-xl border border-white/10 bg-black'>
            <div role='img' aria-label={giveaway.title} className='h-52 w-full bg-cover bg-center' style={{ backgroundImage: `url(${giveaway.imageUrl})` }} />
          </div>
          <div className='flex flex-col justify-between gap-4 md:flex-row'>
            <div>
              <p className='text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500'>Giveaway en cours</p>
              <h4 className='mt-2 text-2xl font-bold text-white'>{giveaway.title}</h4>
              <p className='mt-3 text-sm leading-6 text-gray-400'>{giveaway.description}</p>
            </div>
            <div className='shrink-0 md:text-right'>
              <p className='text-xs uppercase tracking-widest text-gray-500'>À gagner</p>
              <p className='mt-1 font-bold text-white'>{giveaway.prize}</p>
              <p className='mt-3 font-mono text-xs text-white'>Temps restant : {formatRemaining(giveaway.endsAt)}</p>
            </div>
          </div>
          <form onSubmit={(event) => participate(event, giveaway.id)} className='mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row'>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder='Ton pseudo Roblox' maxLength={20} className='min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-white/40' />
            <button type='submit' className='rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200'>Participer</button>
          </form>
          <p className='mt-3 text-[10px] uppercase tracking-wider text-gray-600'>{giveaway.participantCount} participant(s)</p>
        </article>
      ))}
      {message && <p className='text-sm text-gray-300'>{message}</p>}
    </div>
  );
}
