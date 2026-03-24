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
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="md:hidden w-full h-full relative"
                >
                    <Image
                        src="/image2.png"
                        alt="MEEY Nail Shop Mobile"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </motion.div>

                {/* Desktop: Image with Cinematic Zoom (Hidden on Mobile) */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 12, ease: "easeOut" }}
                    className="hidden md:block w-full h-full relative"
                >
                    <Image
                        src="/image.png"
                        alt="MEEY Nail Shop Hero"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </motion.div>
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-rouge-deep/60 via-transparent to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 sm:px-12 md:px-16 z-10">
                <div className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start mx-auto md:mx-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-montserrat font-light text-4xl md:text-6xl lg:text-8xl text-gold-brand mb-8 leading-tight tracking-[0.15em] uppercase drop-shadow-md"
                    >
                        L'Art de <br className="hidden md:block" /> l'Excellence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm sm:text-base md:text-lg text-creme/80 mb-12 max-w-lg font-montserrat font-light tracking-[0.05em] leading-relaxed border-l-2 border-gold-brand/50 pl-8"
                    >
                        Sublimez votre talent avec notre collection exclusive de produits premium, pensée pour les artistes de l'onglerie.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto"
                    >
                        <Link
                            href="/catalogue"
                            className="bg-gold-brand hover:bg-[#D4C3AC] text-rouge-brand px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center group shadow-2xl w-full sm:w-auto"
                        >
                            Découvrir la collection
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <Link
                            href="/catalogue?badge=top"
                            className="border-2 border-gold-brand/60 hover:border-gold-brand hover:text-rouge-brand hover:bg-gold-brand text-gold-brand px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5 w-full sm:w-auto"
                        >
                            Meilleures ventes
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-or/50"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-or to-transparent mx-auto"></div>
                </motion.div>
            </div>
        </section>
    );
}
