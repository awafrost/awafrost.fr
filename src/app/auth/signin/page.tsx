'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    const result = await signIn('discord', {
      redirect: false,
      callbackUrl: '/dashboard/affiliate',
    });

    if (result?.ok) {
      router.push('/dashboard/affiliate');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Affiliation</h1>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous avec Discord pour créer votre lien d&apos;affiliation
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 backdrop-blur">
          <button
            onClick={handleDiscordSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.3671a19.8062 19.8062 0 00-4.8851-1.5152.074.074 0 00-.0784.0336c-.211.3667-.444.8428-.607 1.2207-.56-.0838-1.115-.0893-1.668-.0278-.553-.0615-1.108-.0447-1.667.0278-.163-.3779-.399-.8540-.609-1.2207a.077.077 0 00-.0785-.0336c-1.6291.2952-3.2191.7742-4.8851 1.5152a.070.070 0 00-.0330.0316C.5891 9.04.3017 13.585.403 18.097a.082.082 0 00.0331.056c1.644.972 3.237 1.562 4.798 1.954.385.063.738.942.404 1.109-.738.257-1.432.564-2.093.923a.077.077 0 00-.011.128c.140.106.284.213.426.317a.05.05 0 00.053-.007c4.382-3.256 9.144-3.256 13.514 0a.05.05 0 00.053.007c.142-.104.286-.211.426-.317a.077.077 0 00-.009-.129c-.66-.36-1.354-.666-2.093-.923-.334-.167.019-1.046.404-1.109 1.561-.392 3.154-.982 4.798-1.954a.077.077 0 00.032-.056c.12-4.413-.187-8.722-2.639-12.824a.070.070 0 00-.032-.031zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.948-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.948 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.948-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            )}
            {isLoading ? 'Connexion...' : 'Connexion avec Discord'}
          </button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            En continuant, vous acceptez notre{' '}
            <a href="/privacy" className="text-primary hover:underline">
              politique de confidentialité
            </a>
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card/50 p-6">
          <h3 className="font-semibold text-foreground">Avantages:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              Créez votre lien d&apos;affiliation unique
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              Personnalisez votre profil
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              Suivez les statistiques de visite
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              Partagez votre lien avec la communauté
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
