import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-creme flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-rouge-deep/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-or/5 rounded-full blur-3xl"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
                <Link href="/" className="inline-flex flex-col items-center mb-8 group">
                    <div className="relative w-[72px] h-[72px] mb-2 transform transition-all duration-500 group-hover:scale-110">
                        <Image
                            src="/images/logo2.png"
                            alt="MEEY"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col items-center mt-2">
                        <span className="font-italiana text-2xl font-normal leading-none text-rouge-brand tracking-[0.2em] uppercase">MEEY</span>
                        <span className="font-playfair text-[8px] font-normal italic tracking-[0.3em] uppercase text-or leading-none mt-1">Nail Shop</span>
                    </div>
                </Link>
                {children}
            </div>
        </div>
    );
}
