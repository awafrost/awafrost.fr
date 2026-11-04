'use client';

import { FormEvent, useState } from 'react';
import { FaPaperPlane, FaTimes, FaTrashAlt } from 'react-icons/fa';

export function VideoRemovalRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus('');
    setError('');

    try {
      const response = await fetch('/api/video-removal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, reason }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'La demande n’a pas pu être envoyée.');
      setStatus('Demande envoyée. Elle sera examinée dès que possible.');
      setVideoUrl('');
      setReason('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue. Réessaie plus tard.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setIsOpen(true); setStatus(''); setError(''); }}
        className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-rose-100/70 transition hover:border-rose-200/40 hover:bg-rose-300/10 hover:text-white"
      >
        <FaTrashAlt size={11} aria-hidden="true" /> Demander la suppression d’une vidéo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="video-removal-title" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11111a] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-200/60">Demande de retrait</p>
                <h2 id="video-removal-title" className="mt-2 text-xl font-black text-white">Une vidéo TikTok te concerne ?</h2>
                <p className="mt-2 text-xs leading-5 text-white/50">Indique son lien et explique pourquoi tu souhaites son retrait.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer" className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"><FaTimes size={14} /></button>
            </div>

            <form onSubmit={submitRequest} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold text-white/75">Lien de la vidéo TikTok</span>
                <input
                  type="url"
                  required
                  maxLength={2048}
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  placeholder="https://www.tiktok.com/@.../video/..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white outline-none placeholder:text-white/30 focus:border-violet-200/40"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold text-white/75">Raison de la demande</span>
                <textarea
                  required
                  minLength={10}
                  maxLength={1200}
                  rows={5}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Explique la situation et pourquoi cette vidéo devrait être retirée…"
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs leading-5 text-white outline-none placeholder:text-white/30 focus:border-violet-200/40"
                />
                <span className="block text-right text-[10px] text-white/35">{reason.length}/1200</span>
              </label>

              {error && <p role="alert" className="rounded-lg border border-rose-200/20 bg-rose-300/[0.06] px-3 py-2 text-xs text-rose-100">{error}</p>}
              {status && <p role="status" className="rounded-lg border border-emerald-200/20 bg-emerald-300/[0.06] px-3 py-2 text-xs text-emerald-100">{status}</p>}

              <div className="flex flex-col-reverse justify-end gap-2 pt-1 sm:flex-row">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white">Fermer</button>
                <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50">
                  <FaPaperPlane size={11} aria-hidden="true" /> {sending ? 'Envoi…' : 'Envoyer la demande'}
                </button>
              </div>
              <p className="text-[10px] leading-4 text-white/35">Le lien et le motif seront transmis à l’équipe via Discord pour traiter la demande.</p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
