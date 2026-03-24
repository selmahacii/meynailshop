'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    id: number;
    name: string;
}

interface CheckoutProgressProps {
    currentStep: number;
    steps: Step[];
}

export default function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
    return (
        <div className="w-full max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center relative">
                            <div 
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 z-10",
                                    currentStep >= step.id 
                                        ? "bg-encre text-or shadow-lg shadow-encre/20" 
                                        : "bg-creme2 text-encre3 border border-creme"
                                )}
                            >
                                {currentStep > step.id ? (
                                    <Check size={18} />
                                ) : (
                                    <span>0{step.id}</span>
                                )}
                            </div>
                            <span 
                                className={cn(
                                    "absolute top-full mt-3 text-[10px] uppercase tracking-[0.2em] font-black whitespace-nowrap transition-colors duration-500",
                                    currentStep >= step.id ? "text-encre" : "text-encre3"
                                )}
                            >
                                {step.name}
                            </span>
                        </div>
                        
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-[2px] mx-4 bg-creme2 relative overflow-hidden">
                                <div 
                                    className={cn(
                                        "absolute inset-0 bg-or transition-transform duration-700 ease-in-out origin-left",
                                        currentStep > step.id ? "scale-x-100" : "scale-x-0"
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
