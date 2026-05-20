'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative h-screen sm:h-[100dvh] flex items-end overflow-hidden bg-rouge-deep pb-24 md:pb-32">
            {/* Background Media */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Mobile: Image2 (Hidden on Desktop) */}
                <div className="md:hidden w-full h-full relative">
                    <Image
                        src="/image2.png"
                        alt="MEEY Nail Shop Mobile"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </div>

                {/* Desktop: Image with Cinematic Zoom (Hidden on Mobile) */}
                <div className="hidden md:block w-full h-full relative">
                    <Image
                        src="/image.png"
                        alt="MEEY Nail Shop Hero"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </div>
            </div>

            <div className="container mx-auto px-6 sm:px-12 md:px-16 z-10">
                <div className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start mx-auto md:mx-0">
                    <span className="text-gold-brand/80 text-[9px] md:text-xs font-normal uppercase tracking-[0.45em] mb-6 block">
                        Maison de Haute Onglerie
                    </span>

                    <h1 className="font-italiana font-light text-5xl md:text-7xl lg:text-9xl text-creme mb-8 leading-[1.1] tracking-[0.07em] drop-shadow-2xl">
                        La Signature <br />
                        <span className="font-playfair italic font-light text-gold-brand">
                            du Sublime
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-creme/80 mb-12 max-w-xl font-playfair font-extralight italic tracking-wide leading-relaxed border-l border-gold-brand/35 pl-6 md:pl-8">
                        L'alliance de la haute précision et du geste artistique. Des formules d'exception conçues pour révéler la singularité de chaque création.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                        <Link
                            href="/catalogue?isNew=true"
                            className="bg-gold-brand hover:bg-creme text-rouge-brand px-10 py-5 rounded-[4px] font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-gold-brand/20 active:scale-95 w-full sm:w-auto"
                        >
                            Découvrir la collection
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>

                        <Link
                            href="/catalogue?badge=top"
                            className="border border-gold-brand/50 hover:border-gold-brand text-gold-brand px-10 py-5 rounded-[4px] font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center backdrop-blur-md bg-black/20 hover:bg-gold-brand hover:text-rouge-brand active:scale-95 w-full sm:w-auto"
                        >
                            Meilleures ventes
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="text-or/50">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-or to-transparent mx-auto"></div>
                </div>
            </div>
        </section>
    );
}
