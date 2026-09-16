'use client';

import { FormEvent, useState } from 'react';

export default function GiveawayAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [form, setForm] = useState({ title: '', description: '', prize: '', imageUrl: '', endsAt: '' });
  const [message, setMessage] = useState('');

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      setMessage('Identifiants invalides.');
      return;
    }
    setLoggedIn(true);
  }

  async function createGiveaway(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/giveaways', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || 'Impossible de créer le giveaway.');
      return;
    }
    setForm({ title: '', description: '', prize: '', imageUrl: '', endsAt: '' });
    setMessage('Giveaway créé et visible sur la page d’accueil.');
  }

  return (
    <main className='min-h-screen bg-black px-6 py-16 text-white'>
      <div className='mx-auto max-w-2xl'>
        <a href='/' className='text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 transition hover:text-white'>Retour au site</a>
        <p className='mt-16 text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500'>Espace administration</p>
        <h1 className='mt-3 text-4xl font-black tracking-tight'>Gestion des giveaways</h1>

        {!loggedIn ? (
          <form onSubmit={login} className='mt-10 space-y-5 rounded-3xl border border-white/10 bg-[#0a0a0a] p-8'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Nom d’utilisateur
              <input required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Mot de passe
              <input required type='password' value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <button type='submit' className='w-full rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200'>Se connecter</button>
          </form>
        ) : (
          <form onSubmit={createGiveaway} className='mt-10 space-y-5 rounded-3xl border border-white/10 bg-[#0a0a0a] p-8'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Titre
              <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Description
              <textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className='mt-2 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Lot à gagner
              <input required value={form.prize} onChange={(event) => setForm({ ...form, prize: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Image du giveaway (URL HTTPS)
              <input required type='url' placeholder='https://...' value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-400'>Date de fin
              <input required type='datetime-local' value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className='mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40' />
            </label>
            <button type='submit' className='w-full rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-gray-200'>Créer le giveaway</button>
          </form>
        )}
        {message && <p className='mt-5 text-sm text-gray-300'>{message}</p>}
      </div>
    </main>
  );
}
