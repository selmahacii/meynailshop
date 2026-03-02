import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminTopbar from '@/components/admin/layout/AdminTopbar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#F9FAFB] min-h-screen">
            <AdminSidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <AdminTopbar />
                <main className="p-8 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
