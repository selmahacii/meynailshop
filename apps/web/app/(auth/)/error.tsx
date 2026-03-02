'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-creme flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 mx-auto text-rouge" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-encre mb-2">
          Erreur d'authentification
        </h1>

        <p className="text-encre3 mb-6">
          Une erreur s'est produite lors du traitement de votre demande.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-rouge hover:bg-rouge-mid text-white font-outfit font-medium rounded transition"
          >
            Réessayer
          </button>

          <Link
            href="/"
            className="px-6 py-2 border-2 border-rouge text-rouge hover:bg-rouge hover:text-white font-outfit font-medium rounded transition"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
