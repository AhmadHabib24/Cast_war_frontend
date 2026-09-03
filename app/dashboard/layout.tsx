'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Wallet, CreditCard, Settings, LogOut, ArrowLeft, Menu, X, Headset } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token) {
            router.replace('/login');
        } else {
            setIsAuthorized(true);
            if (userStr) {
                setUser(JSON.parse(userStr));
            }
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold text-gray-500">Checking credentials...</div>;
    }

    const navLinks = [
        { name: 'Headquarters', href: '/dashboard', icon: <Home size={20} /> },
        { name: 'My Wallet', href: '/dashboard/deposit', icon: <Wallet size={20} /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
        { name: 'Support', href: '/dashboard/support', icon: <Headset size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-[#FAF9F6] font-sans text-gray-900 pb-16 md:pb-0">
            {/* Dark Sidebar (Desktop Only) */}
            <aside className="hidden md:flex w-64 bg-[var(--color-brand-black)] text-white flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-gray-800 flex justify-center">
                    <Link href="/">
                        <img 
                            src="/cast-war-logo.png" 
                            alt="Cast War Dashboard" 
                            className="h-12 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                </div>
                


                <nav className="flex-1 px-4 mt-6 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                                    isActive 
                                    ? 'bg-[var(--color-metallic-gold)] text-[var(--color-brand-black)] shadow-md' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <span className={isActive ? "text-[var(--color-brand-black)]" : "text-gray-500"}>{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link 
                        href="/"
                        className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Game</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-3 text-sm font-bold text-gray-500 hover:text-red-500 transition"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-brand-black)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                {/* Top Header */}
                <header className="h-16 border-b border-gray-200 flex items-center justify-between md:justify-end px-4 md:px-8 z-20 sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-sm shrink-0">
                    <div className="md:hidden">
                        <img src="/cast-war-logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                    </div>
                    <div className="flex items-center space-x-3 md:space-x-6">
                        <NotificationBell />
                        <span className="hidden md:inline-block text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            {user?.name || 'Loading...'}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                    <div className="max-w-6xl mx-auto pb-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] z-50">
                <div className="flex items-center justify-around h-16 px-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                                    isActive 
                                    ? 'text-[var(--color-metallic-gold)]' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {link.icon}
                                <span className="text-[10px] font-bold leading-none text-center">
                                    {link.name.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                    
                    {/* More Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                            isMobileMenuOpen 
                            ? 'text-[var(--color-metallic-gold)]' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-[10px] font-bold leading-none">More</span>
                    </button>
                </div>
            </nav>

            {/* Mobile "More" Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 bottom-16 top-0 bg-[var(--color-brand-black)] z-40 animate-fade-in flex flex-col shadow-inner">
                    <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
                        <div className="h-10 w-10 bg-[var(--color-metallic-gold)] rounded-full flex items-center justify-center text-[var(--color-brand-black)] font-black text-lg">
                            W
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{user?.name || 'Warrior'}</p>
                            <p className="text-xs font-bold text-gray-400">{user?.email || 'Loading...'}</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
                        <div className="space-y-2">
                            <Link 
                                href="/"
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                <ArrowLeft size={20} className="text-gray-500" />
                                <span>Back to Game</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="p-6 mt-auto border-t border-gray-800">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-gray-800 py-3 rounded-xl transition"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
