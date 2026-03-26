'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] overflow-x-auto no-scrollbar pb-1 whitespace-nowrap">
            <Link 
                href="/" 
                className="text-encre3 hover:text-or transition-colors flex items-center flex-shrink-0"
            >
                <Home size={12} className="mr-1.5" />
                <span>Accueil</span>
            </Link>
            
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight size={12} className="text-encre3/40" />
                    {item.href ? (
                        <Link 
                            href={item.href}
                            className="text-encre3 hover:text-or transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-encre font-bold underline decoration-or/40 underline-offset-4">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
