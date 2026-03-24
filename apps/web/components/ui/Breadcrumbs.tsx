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
        <nav className="flex items-center space-x-2 text-xs md:text-sm font-medium tracking-wide">
            <Link 
                href="/" 
                className="text-encre3 hover:text-or transition-colors flex items-center"
            >
                <Home size={14} className="mr-1" />
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
