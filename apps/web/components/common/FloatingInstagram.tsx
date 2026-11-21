'use client';

import { usePathname } from 'next/navigation';

export default function FloatingInstagram() {
    const pathname = usePathname();

    // Ne pas afficher sur le panel admin ni sur la landing page (qui a son propre bouton optimisé)
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/lp/')) {
        return null;
    }

    return (
        <aside className="fixed bottom-6 right-6 z-50 animate-in fade-in duration-300">
            <a
                href="https://ig.me/m/meeynailshop"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white shadow-[0_6px_25px_rgba(214,36,159,0.45)] hover:shadow-[0_8px_30px_rgba(214,36,159,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group"
                title="Contactez-nous sur Instagram"
            >
                <div className="relative w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 border border-white"></span>
                    </span>
                </div>
                <span className="text-xs font-bold whitespace-nowrap drop-shadow-sm">
                    Chat Instagram
                </span>
            </a>
        </aside>
    );
}
