"use client";
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientLogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' })
        });
        router.push('/');
        router.refresh();
    }

    return (
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} />
        </button>
    );
}
