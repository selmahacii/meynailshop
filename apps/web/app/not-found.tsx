import Link from 'next/link';
import { Search } from 'lucide-react';

export const metadata = {
  title: '404 - Page non trouvée | MEEY',
  description: 'La page que vous recherchez n\'existe pas',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-creme flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Search className="w-16 h-16 mx-auto text-or" />
        </div>

        <h1 className="text-5xl font-serif font-bold text-encre mb-4">
          404
        </h1>

        <h2 className="text-2xl font-serif text-rouge mb-4">
          Page non trouvée
        </h2>

        <p className="text-encre3 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour continuer votre navigation.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-rouge hover:bg-rouge-mid text-white font-outfit font-medium rounded transition"
          >
            Retour à l'accueil
          </Link>

          <Link
            href="/catalogue"
            className="px-8 py-3 border-2 border-rouge text-rouge hover:bg-rouge hover:text-white font-outfit font-medium rounded transition"
          >
            Parcourir
          </Link>
        </div>
      </div>
    </div>
  );
}
