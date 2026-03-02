'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null): string => {
    switch (error) {
      case 'AccessDenied':
        return 'Accès refusé. Veuillez vérifier vos informations d\'identification.';
      case 'OAuthSignin':
        return 'Erreur lors de la connexion avec Discord.';
      case 'OAuthCallback':
        return 'Erreur de rappel OAuth Discord.';
      case 'OAuthCreateAccount':
        return 'Impossible de créer un compte à partir du fournisseur Discord.';
      case 'EmailCreateAccount':
        return 'Impossible de créer un compte avec cet e-mail.';
      case 'Callback':
        return 'Une erreur de rappel s\'est produite.';
      case 'OAuthSignin':
      case 'OAuthCallback':
        return 'Essayez une autre méthode de connexion.';
      case 'EmailSignInError':
        return 'Impossible d\'envoyer un e-mail de connexion.';
      case 'CredentialsSignin':
        return 'Identifiants invalides.';
      default:
        return 'Une erreur est survenue lors de la validation du code d\'authentification.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h1 className="mb-4 text-2xl font-bold text-red-400">
            Erreur d&apos;authentification
          </h1>
          <p className="mb-6 text-gray-300">{getErrorMessage(error)}</p>
          <Link
            href="/auth/signin"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Réessayer
          </Link>
        </div>
      </div>
    </div>
  );
}
