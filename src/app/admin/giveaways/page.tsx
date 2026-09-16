'use client';

import { FormEvent, useEffect, useState } from 'react';

type Participant = { username: string; joinedAt: string };
type Giveaway = {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl: string;
  endsAt: string;
  participants: Participant[];
  winner: string | null;
  winnerAnnouncedAt: string | null;
};

const emptyForm = { title: '', description: '', prize: '', imageUrl: '', endsAt: '' };

export default function GiveawayAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [form, setForm] = useState(emptyForm);
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadGiveaways() {
    const response = await fetch('/api/admin/giveaways', { cache: 'no-store' });
    if (response.status === 401) { setLoggedIn(false); return; }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Impossible de charger les giveaways.');
    setGiveaways(result);
  }

  useEffect(() => {
    if (loggedIn) loadGiveaways().catch((error: Error) => setMessage(error.message));
  }, [loggedIn]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    if (!response.ok) { setMessage('Identifiants invalides.'); return; }
    setLoggedIn(true);
  }

  async function createGiveaway(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage('');
    const response = await fetch('/api/giveaways', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage(result.error || 'Impossible de créer le giveaway.'); return; }
    setForm(emptyForm); setMessage('Giveaway créé.'); await loadGiveaways();
  }

  async function action(id: string, actionName: 'draw' | 'finish' | 'reroll') {
    setLoading(true); setMessage('');
    const response = await fetch(`/api/admin/giveaways/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: actionName }) });
    const result = await response.json();
    setLoading(false); setMessage(response.ok ? 'Giveaway mis à jour.' : result.error || 'Action impossible.');
    if (response.ok) await loadGiveaways();
  }

  return (
    <main className='min-h-screen bg-black px-6 py-12 text-white'>
      <div className='mx-auto max-w-6xl'>
        <a href='/' className='text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 transition hover:text-white'>Retour au site</a>
        <div className='mt-12 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end'>
          <div><p className='text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500'>Espace administration</p><h1 className='mt-3 text-4xl font-black tracking-tight'>Giveaways</h1></div>
          {loggedIn && <span className='text-[10px] font-mono uppercase tracking-widest text-emerald-400'>Session active</span>}
        </div>

        {!loggedIn ? (
          <form onSubmit={login} className='mx-auto mt-10 max-w-xl space-y-5 rounded-3xl border border-white/10 bg-[#0a0a0a] p-8'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Nom d’utilisateur<input required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' /></label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Mot de passe<input required type='password' value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' /></label>
            <button type='submit' className='w-full rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200'>Se connecter</button>
          </form>
        ) : (
          <div className='mt-10 grid gap-10 lg:grid-cols-[360px_1fr]'>
            <form onSubmit={createGiveaway} className='h-fit space-y-5 rounded-3xl border border-white/10 bg-[#0a0a0a] p-6'>
              <div><p className='text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500'>Nouveau</p><h2 className='mt-2 text-xl font-bold'>Créer un giveaway</h2></div>
              <input required placeholder='Titre' value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className='w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40' />
              <textarea required rows={4} placeholder='Description' value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className='w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40' />
              <input required placeholder='Lot à gagner' value={form.prize} onChange={(event) => setForm({ ...form, prize: event.target.value })} className='w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40' />
              <input required type='url' placeholder='Image HTTPS' value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className='w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40' />
              <input required type='datetime-local' value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className='w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/40' />
              <button disabled={loading} type='submit' className='w-full rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200 disabled:opacity-50'>Créer</button>
            </form>

            <section className='space-y-5'>
              <div className='flex items-center justify-between'><h2 className='text-xl font-bold'>Tous les giveaways</h2><span className='text-xs text-gray-500'>{giveaways.length} total</span></div>
              {giveaways.length === 0 && <p className='rounded-2xl border border-white/10 p-6 text-sm text-gray-500'>Aucun giveaway créé.</p>}
              {giveaways.map((giveaway) => {
                const ended = new Date(giveaway.endsAt).getTime() <= Date.now();
                return (
                  <article key={giveaway.id} className='rounded-2xl border border-white/10 bg-[#0a0a0a] p-6'>
                    <div className='flex flex-col justify-between gap-4 md:flex-row'>
                      <div><div className='flex flex-wrap items-center gap-3'><h3 className='text-xl font-bold'>{giveaway.title}</h3><span className={`text-[10px] font-mono uppercase tracking-wider ${giveaway.winnerAnnouncedAt ? 'text-amber-400' : ended ? 'text-red-400' : 'text-emerald-400'}`}>{giveaway.winnerAnnouncedAt ? 'Terminé' : ended ? 'À tirer' : 'En cours'}</span></div><p className='mt-2 text-sm text-gray-400'>{giveaway.prize} · fin {new Date(giveaway.endsAt).toLocaleString('fr-FR')}</p></div>
                      <div className='text-left md:text-right'><p className='text-2xl font-bold'>{giveaway.participants.length}</p><p className='text-[10px] uppercase tracking-wider text-gray-500'>participants</p></div>
                    </div>
                    {giveaway.winnerAnnouncedAt && <p className='mt-4 border-l-2 border-amber-400 pl-3 text-sm text-amber-200'>Gagnant : <strong>{giveaway.winner || 'aucun participant'}</strong></p>}
                    <div className='mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5'>
                      {!giveaway.winnerAnnouncedAt && ended && <button disabled={loading} onClick={() => action(giveaway.id, 'draw')} className='rounded-lg bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black disabled:opacity-50'>Tirer le gagnant</button>}
                      {!giveaway.winnerAnnouncedAt && !ended && <button disabled={loading} onClick={() => action(giveaway.id, 'finish')} className='rounded-lg border border-red-400/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-300 disabled:opacity-50'>Terminer maintenant</button>}
                      {giveaway.winnerAnnouncedAt && <button disabled={loading || giveaway.participants.length === 0} onClick={() => action(giveaway.id, 'reroll')} className='rounded-lg border border-white/20 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 disabled:opacity-50'>Reroll</button>}
                    </div>
                    <details className='mt-4 border-t border-white/10 pt-4'><summary className='cursor-pointer text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white'>Voir les participants</summary><div className='mt-3 grid gap-2 sm:grid-cols-2'>{giveaway.participants.map((participant) => <p key={`${giveaway.id}-${participant.username}`} className='rounded-lg bg-black px-3 py-2 text-sm text-gray-300'>{participant.username}<span className='ml-2 text-[10px] text-gray-600'>{new Date(participant.joinedAt).toLocaleString('fr-FR')}</span></p>)}{giveaway.participants.length === 0 && <p className='text-sm text-gray-600'>Aucun participant.</p>}</div></details>
                  </article>
                );
              })}
            </section>
          </div>
        )}
        {message && <p className='mt-5 text-sm text-gray-300'>{message}</p>}
      </div>
    </main>
  );
}
