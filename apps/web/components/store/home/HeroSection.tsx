'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] md:h-screen flex items-center overflow-hidden bg-rouge-deep py-20">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="w-full h-full"
                >
                    <Image
                        src="/image.png"
                        alt="MEEY Nail Shop Hero"
                        fill
                        priority
                        className="object-cover"
                    />
                </motion.div>
                {/* Minimal overlay for better contrast if needed, but much lighter */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-rouge-deep/40 via-transparent to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 sm:px-12 md:px-16 z-10">
                <div className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start mx-auto md:mx-0">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-2xl text-creme mb-12 max-w-xl font-medium leading-relaxed drop-shadow-xl"
                    >
                        Découvrez notre collection de produits professionnels pour sublimer vos créations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto"
                    >
                        <Link
                            href="/catalogue"
                            className="bg-or hover:bg-or-light text-rouge-deep px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center group shadow-2xl w-full sm:w-auto"
                        >
                            Découvrir la collection
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <Link
                            href="/catalogue?badge=top"
                            className="border-2 border-creme hover:border-or hover:text-or text-creme px-10 py-5 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/5 w-full sm:w-auto"
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
