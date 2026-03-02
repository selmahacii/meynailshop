import Link from 'next/link';

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
                <Link href="/" className="inline-flex flex-col items-center mb-8">
                    <span className="font-serif text-4xl text-or leading-none">MEEY</span>
                    <span className="text-xs uppercase tracking-[0.4em] text-encre3">Nail Shop</span>
                </Link>
                {children}
            </div>
        </div>
    );
}
