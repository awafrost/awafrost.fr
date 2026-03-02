'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Game {
  gameId: number;
  gameName: string;
  position: number;
}

interface Affiliate {
  _id: string;
  affiliateCode: string;
  youtube?: { url: string; displayName: string };
  twitter?: { url: string; displayName: string };
  roblox?: { username: string; userId: number };
  favoriteGames?: Game[];
  discordUsername: string;
  profileDescription?: string;
}

export default function EditAffiliate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    youtube: { url: '', displayName: '' },
    twitter: { url: '', displayName: '' },
    roblox: { username: '', userId: 0 },
    favoriteGames: [] as Game[],
    profileDescription: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAffiliate();
    }
  }, [status]);

  const fetchAffiliate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliate');

      if (!res.ok) throw new Error('Failed to fetch affiliate');
      const data = await res.json();
      setAffiliate(data);

      setFormData({
        youtube: data.youtube || { url: '', displayName: '' },
        twitter: data.twitter || { url: '', displayName: '' },
        roblox: data.roblox || { username: '', userId: 0 },
        favoriteGames: data.favoriteGames || [],
        profileDescription: data.profileDescription || '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    subField: string | null,
    value: string | number
  ) => {
    setFormData((prev) => {
      if (subField) {
        const fieldValue = prev[field as keyof typeof prev] as any;
        return {
          ...prev,
          [field]: {
            ...fieldValue,
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const addGame = () => {
    if (formData.favoriteGames.length < 3) {
      setFormData((prev) => ({
        ...prev,
        favoriteGames: [
          ...prev.favoriteGames,
          {
            gameId: 0,
            gameName: '',
            position: prev.favoriteGames.length + 1,
          },
        ],
      }));
    }
  };

  const removeGame = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGames: prev.favoriteGames.filter((_, i) => i !== index),
    }));
  };

  const removeField = (field: 'youtube' | 'twitter' | 'roblox') => {
    setFormData((prev) => ({
      ...prev,
      [field]: { url: '', displayName: '' },
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Validation: Roblox ID is required
      if (!formData.roblox.userId || formData.roblox.userId === 0) {
        setError('L\'ID Roblox est obligatoire');
        return;
      }

      if (!formData.roblox.username) {
        setError('Le pseudo Roblox est obligatoire');
        return;
      }

      setSaving(true);
      const res = await fetch('/api/affiliate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save affiliate');
      const data = await res.json();
      setAffiliate(data);
      
      setSuccessMessage('Profil mis à jour avec succès! ✓');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/affiliate"
            className="mb-4 inline-block text-primary hover:underline"
          >
            ← Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Éditer votre profil d&apos;affiliation
          </h1>
        </div>

        {error && (
          <div className="animation-slideIn mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="animation-slideIn mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-400">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        <div className="space-y-6 rounded-lg border border-border bg-card p-6">
          {/* Discord Info (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground">
              Compte Discord
            </label>
            <p className="mt-2 text-muted-foreground">
              {affiliate?.discordUsername} (Non modifiable)
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-muted-foreground">
              Description du profil
            </label>
            <textarea
              id="description"
              value={formData.profileDescription}
              onChange={(e) =>
                handleInputChange('profileDescription', null, e.target.value)
              }
              maxLength={500}
              className="mt-2 w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
              placeholder="Décrivez-vous brièvement..."
              rows={4}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.profileDescription.length}/500
            </p>
          </div>

          {/* YouTube */}
          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-semibold text-muted-foreground">
                YouTube
              </label>
              {formData.youtube.url && (
                <button
                  onClick={() => removeField('youtube')}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Nom d'affichage"
              value={formData.youtube.displayName}
              onChange={(e) =>
                handleInputChange('youtube', 'displayName', e.target.value)
              }
              className="mb-2 w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
            <input
              type="url"
              placeholder="URL YouTube (ex: https://youtube.com/@username)"
              value={formData.youtube.url}
              onChange={(e) =>
                handleInputChange('youtube', 'url', e.target.value)
              }
              className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Twitter */}
          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-semibold text-muted-foreground">
                Twitter/X
              </label>
              {formData.twitter.url && (
                <button
                  onClick={() => removeField('twitter')}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Supprimer
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Nom d'affichage"
              value={formData.twitter.displayName}
              onChange={(e) =>
                handleInputChange('twitter', 'displayName', e.target.value)
              }
              className="mb-2 w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
            <input
              type="url"
              placeholder="URL Twitter (ex: https://twitter.com/username)"
              value={formData.twitter.url}
              onChange={(e) =>
                handleInputChange('twitter', 'url', e.target.value)
              }
              className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Roblox */}
          <div className="rounded-lg border border-border p-4">
            <label className="mb-3 block text-sm font-semibold text-muted-foreground">
              Roblox <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Pseudo Roblox"
              value={formData.roblox.username}
              onChange={(e) =>
                handleInputChange('roblox', 'username', e.target.value)
              }
              className="mb-2 w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
            <input
              type="number"
              placeholder="ID Roblox (obligatoire)"
              value={formData.roblox.userId || ''}
              onChange={(e) =>
                handleInputChange('roblox', 'userId', parseInt(e.target.value) || 0)
              }
              required
              className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Favorite Games */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-semibold text-muted-foreground">
                Jeux favoris (Max 3)
              </label>
            </div>
            <div className="space-y-3">
              {formData.favoriteGames.map((game, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="number"
                    placeholder="ID du jeu Roblox"
                    value={game.gameId || ''}
                    onChange={(e) => {
                      const newGames = [...formData.favoriteGames];
                      newGames[index].gameId = parseInt(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        favoriteGames: newGames,
                      }));
                    }}
                    className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Nom du jeu"
                    value={game.gameName}
                    onChange={(e) => {
                      const newGames = [...formData.favoriteGames];
                      newGames[index].gameName = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        favoriteGames: newGames,
                      }));
                    }}
                    className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-foreground placeholder-muted-foreground"
                  />
                  <button
                    onClick={() => removeGame(index)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {formData.favoriteGames.length < 3 && (
              <button
                onClick={addGame}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                + Ajouter un jeu
              </button>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
            <Link
              href="/dashboard/affiliate"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-foreground transition-colors hover:bg-muted"
            >
              Annuler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
