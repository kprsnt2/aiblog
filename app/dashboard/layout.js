import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, LogOut, LayoutDashboard, PlusCircle, Globe } from 'lucide-react';

export default async function DashboardLayout({ children }) {
    const token = (await cookies()).get('auth-token')?.value;
    if (!token) redirect('/login');

    const user = await verifyToken(token);
    if (!user) redirect('/login');

    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-4 px-8 flex justify-between items-center bg-slate-900 border-b border-white/10 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="text-blue-400" size={20} /> AIBlog
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-slate-400">
                        <Link href="/dashboard" className="hover:text-white flex items-center gap-2">
                            <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link href="/dashboard/new" className="hover:text-white flex items-center gap-2">
                            <PlusCircle size={16} /> New Post
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <Link href={`/blog/${user.username}`} target="_blank" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2">
                        <Globe size={16} /> My Blog
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="text-sm font-medium text-slate-300">
                        {user.username}
                    </div>
                    <ClientLogoutButton />
                </div>
            </header>

            <main className="flex-grow p-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}

// Small client component for logout action inside the server layout
import ClientLogoutButton from './ClientLogoutButton';
