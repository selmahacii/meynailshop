'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const displayImages = images.length > 0 ? images : ['/images/placeholder-product.webp'];

    const next = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-creme2 overflow-hidden border border-creme2 group">
                <Image
                    src={displayImages[currentIndex]}
                    alt="Product"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Zoom Button */}
                <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-4 right-4 bg-white/80 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ZoomIn size={20} className="text-encre" />
                </button>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative aspect-square border-2 transition-all ${currentIndex === idx ? 'border-or' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
