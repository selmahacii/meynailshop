'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    productName?: string;
    selectedImage?: string | null;
}

export default function ProductGallery({ images, productName = 'Produit', selectedImage = null }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const displayImages = images.length > 0 ? images : ['/images/placeholder-product.png'];

    const goTo = useCallback((index: number, dir: 'left' | 'right') => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(dir);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 200);
    }, [isAnimating]);

    const next = useCallback(() => {
        const nextIndex = (currentIndex + 1) % displayImages.length;
        goTo(nextIndex, 'right');
    }, [currentIndex, displayImages.length, goTo]);

    const prev = useCallback(() => {
        const prevIndex = (currentIndex - 1 + displayImages.length) % displayImages.length;
        goTo(prevIndex, 'left');
    }, [currentIndex, displayImages.length, goTo]);

    // Keyboard navigation for modal
    useEffect(() => {
        if (!isZoomOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') setZoomIndex(i => (i + 1) % displayImages.length);
            if (e.key === 'ArrowLeft') setZoomIndex(i => (i - 1 + displayImages.length) % displayImages.length);
            if (e.key === 'Escape') setIsZoomOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isZoomOpen, displayImages.length]);

    // Lock body scroll when modal open
    useEffect(() => {
        if (isZoomOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isZoomOpen]);

    const openZoom = (index: number) => {
        setZoomIndex(index);
        setIsZoomOpen(true);
    };

    // Update index if selectedImage changes from parent (e.g. variants)
    useEffect(() => {
        if (selectedImage) {
            const index = displayImages.indexOf(selectedImage);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [selectedImage, displayImages]);

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-creme2 overflow-hidden border border-creme2 group rounded-sm shadow-lg">
                    <div
                        className={cn(
                            "absolute inset-0 transition-all duration-200",
                            isAnimating && direction === 'right' ? "opacity-0 translate-x-4" :
                            isAnimating && direction === 'left' ? "opacity-0 -translate-x-4" :
                            "opacity-100 translate-x-0"
                        )}
                    >
                        <Image
                            src={displayImages[currentIndex]}
                            alt={`${productName} - photo ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                                aria-label="Photo précédente"
                            >
                                <ChevronLeft size={18} className="text-encre" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                                aria-label="Photo suivante"
                            >
                                <ChevronRight size={18} className="text-encre" />
                            </button>
                        </>
                    )}

                    {/* Zoom Button */}
                    <button
                        onClick={() => openZoom(currentIndex)}
                        className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-or hover:text-creme z-10"
                        aria-label="Agrandir l'image"
                    >
                        <Expand size={16} className="text-encre group-hover:text-creme" />
                    </button>

                    {/* Image counter badge */}
                    {displayImages.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {currentIndex + 1} / {displayImages.length}
                        </div>
                    )}

                    {/* Dot indicators (always visible on mobile) */}
                    {displayImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            {displayImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i, i > currentIndex ? 'right' : 'left')}
                                    className={cn(
                                        "rounded-full transition-all duration-300",
                                        i === currentIndex
                                            ? "w-5 h-1.5 bg-white shadow"
                                            : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Voir photo ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnails strip */}
                {displayImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                        {displayImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx, idx > currentIndex ? 'right' : 'left')}
                                className={cn(
                                    "relative aspect-square border-2 rounded-sm overflow-hidden transition-all duration-200 hover:opacity-100",
                                    currentIndex === idx
                                        ? "border-or shadow-md scale-105"
                                        : "border-transparent opacity-50 hover:border-creme2 hover:scale-102"
                                )}
                                aria-label={`Photo ${idx + 1}`}
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} - miniature ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Zoom Modal */}
            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setIsZoomOpen(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsZoomOpen(false)}
                        className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
                        aria-label="Fermer"
                    >
                        <X size={22} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold uppercase tracking-widest">
                        {zoomIndex + 1} / {displayImages.length}
                    </div>

                    {/* Main zoom image */}
                    <div
                        className="relative w-full max-w-3xl max-h-[80vh] aspect-square"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={displayImages[zoomIndex]}
                            alt={`${productName} - vue agrandie ${zoomIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="80vw"
                            priority
                        />
                    </div>

                    {/* Navigation in modal */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setZoomIndex(i => (i - 1 + displayImages.length) % displayImages.length); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                aria-label="Photo précédente"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setZoomIndex(i => (i + 1) % displayImages.length); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                aria-label="Photo suivante"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Thumbnail strip in modal */}
                    {displayImages.length > 1 && (
                        <div
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {displayImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setZoomIndex(idx)}
                                    className={cn(
                                        "relative w-12 h-12 border-2 rounded-sm overflow-hidden transition-all",
                                        zoomIndex === idx
                                            ? "border-or opacity-100 scale-110"
                                            : "border-white/20 opacity-40 hover:opacity-70"
                                    )}
                                >
                                    <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
