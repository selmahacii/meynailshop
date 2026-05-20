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
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-gold-brand/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-6 block"
                    >
                        Maison de Beauté Ongulaire
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-italiana text-5xl md:text-7xl lg:text-9xl text-creme mb-8 leading-[1.1] tracking-[0.05em] drop-shadow-2xl"
                    >
                        L'Art de <br />
                        <span className="font-playfair italic font-medium text-gold-brand">
                            l'Excellence
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl text-creme/90 mb-12 max-w-xl font-playfair font-light italic tracking-wide leading-relaxed border-l-[3px] border-gold-brand pl-6 md:pl-8"
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
