'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error caught by global error boundary:', error);
  }, [error]);

  return (
    <div className="bg-creme text-encre font-sans min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 mx-auto text-rouge" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-encre mb-2">
          Erreur Système
        </h1>

        <p className="text-encre3 mb-6">
          Une erreur inattendue s&apos;est produite. Nous travaillons pour la résoudre.
        </p>

        {error.message && (
          <p className="text-sm text-encre2 bg-creme2 p-4 rounded mb-6 font-mono">
            {error.message}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-rouge hover:bg-rouge-mid text-white font-medium rounded transition"
          >
            Réessayer
          </button>

          <Link
            href="/"
            className="px-6 py-2 border-2 border-rouge text-rouge hover:bg-rouge hover:text-white font-medium rounded transition"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
