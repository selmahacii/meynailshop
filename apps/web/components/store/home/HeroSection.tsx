'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] md:h-screen flex items-center overflow-hidden bg-rouge-deep py-20">
            {/* Background Texture/Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-rouge-deep via-rouge-deep/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 z-10">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-creme mb-6 leading-[1.1]">
                            L'excellence de l'onglerie <br className="hidden sm:block" />
                            à portée <span className="italic text-or">de main.</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base md:text-xl text-creme2/80 mb-10 max-w-xl font-light leading-relaxed"
                    >
                        Découvrez notre collection de produits professionnels pour sublimer vos créations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <Link
                            href="/catalogue"
                            className="bg-or hover:bg-or-light text-rouge-deep px-8 py-4 rounded-sm font-medium transition-all duration-300 flex items-center justify-center group"
                        >
                            Découvrir la collection
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>

                        <Link
                            href="/catalogue?badge=top"
                            className="border border-creme/30 hover:border-or hover:text-or text-creme px-8 py-4 rounded-sm font-medium transition-all duration-300 flex items-center justify-center"
                        >
                            Meilleures ventes
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute right-[10%] bottom-[15%] hidden lg:block">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-64 h-96 border-2 border-or/30 rounded-full"
                >
                    {/* This could be a floating image product */}
                    <div className="absolute inset-4 rounded-full bg-rouge-mid/20 backdrop-blur-sm flex items-center justify-center border border-or/20">
                        <span className="font-serif text-or/40 text-8xl">M</span>
                    </div>
                </motion.div>
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
