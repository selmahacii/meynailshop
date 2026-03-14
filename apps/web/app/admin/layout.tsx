'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminTopbar from '@/components/admin/layout/AdminTopbar';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="bg-[#F9FAFB] h-screen flex overflow-hidden">
            {/* Sidebar Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition duration-300 ease-in-out w-64",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Content Wrapper */}
            <div className="flex flex-col flex-1 w-0 h-screen lg:ml-64 overflow-hidden">
                <AdminTopbar onMenuClick={toggleSidebar} />
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-8 bg-[#F9FAFB] scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
