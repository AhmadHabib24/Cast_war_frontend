'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Wallet, Shield, Users, LogOut, Settings, Lock, Menu, X, Headset, Search, Webhook, FileText } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setAdminUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navLinks = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Deposits', href: '/admin/deposits', icon: <Wallet size={20} /> },
        { name: 'Wallet Settings', href: '/admin/wallet-settings', icon: <Settings size={20} /> },
        { name: 'Manage Casts', href: '/admin/casts', icon: <Shield size={20} /> },
        { name: 'User Moderation', href: '/admin/users', icon: <Users size={20} /> },
        { name: 'Reports', href: '/admin/reports', icon: <FileText size={20} /> },
        { name: 'Security & Risk', href: '/admin/security', icon: <Lock size={20} /> },
        { name: 'Social Requests', href: '/admin/social-requests', icon: <Users size={20} /> },
        { name: 'Support', href: '/admin/support', icon: <Headset size={20} /> },
        { name: 'SEO Panel', href: '/admin/seo', icon: <Search size={20} /> },
        { name: 'Webhooks', href: '/admin/webhooks', icon: <Webhook size={20} /> },
    ];

    const bottomNavLinks = navLinks.slice(0, 4); // First 4 for bottom bar
    const moreNavLinks = navLinks.slice(4); // Rest for the "More" menu

    return (
        <div className="flex h-screen bg-[#08090d] font-sans text-gray-100 pb-16 md:pb-0">
            {/* Sidebar (Desktop Only) */}
            <aside className="hidden md:flex w-64 bg-zinc-950/80 backdrop-blur-md text-white flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20 border-r border-zinc-800/50">
                <div className="p-6 border-b border-zinc-800/50 flex justify-center">
                    <Link href="/admin">
                        <img 
                            src="/cast-war-logo.png" 
                            alt="Cast War Admin" 
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                </div>
                <div className="p-4 text-xs font-bold text-amber-500/70 uppercase tracking-widest text-center mb-2 mt-4">
                    Admin Control Center
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm border border-transparent ${
                                    isActive 
                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-md' 
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                }`}
                            >
                                <span className={isActive ? "text-amber-500" : "text-zinc-500"}>{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 border-t border-zinc-800/50">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-zinc-500 hover:text-red-500 transition"
                    >
                        <LogOut size={18} />
                        <span>Exit Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-8 z-10 shadow-sm shrink-0">
                    <div className="flex items-center space-x-3 truncate">
                        {/* Mobile Logo & Title */}
                        <div className="md:hidden flex items-center space-x-2 truncate">
                            <img src="/cast-war-logo.png" alt="Logo" className="h-7 w-auto object-contain flex-shrink-0" />
                            <h2 className="text-lg font-black text-white tracking-tight truncate">
                                {navLinks.find(l => l.href === pathname)?.name || 'Admin'}
                            </h2>
                        </div>
                        {/* Desktop Title */}
                        <h2 className="text-xl font-black text-white tracking-tight hidden md:block">
                            {navLinks.find(l => l.href === pathname)?.name || 'Admin Panel'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3 md:space-x-6">
                        <NotificationBell />
                        <span className="hidden md:inline-block text-sm font-bold text-amber-500 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 shadow-inner">
                            {adminUser?.email || 'Loading...'}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <div className="max-w-6xl mx-auto pb-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] z-50">
                <div className="flex items-center justify-around h-16 px-2">
                    {bottomNavLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                                    isActive 
                                    ? 'text-amber-500' 
                                    : 'text-zinc-500 hover:text-zinc-300'
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
                            ? 'text-amber-500' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        <span className="text-[10px] font-bold leading-none">More</span>
                    </button>
                </div>
            </nav>

            {/* Mobile "More" Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 bottom-16 top-0 bg-zinc-950/95 backdrop-blur-xl z-40 animate-fade-in flex flex-col shadow-inner">
                    <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center space-x-3">
                        <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-amber-500 font-black text-lg">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{adminUser?.name || 'Admin'}</p>
                            <p className="text-xs font-bold text-zinc-400">{adminUser?.email || 'Loading...'}</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-2">More Actions</div>
                        {moreNavLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm border border-transparent ${
                                        isActive 
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                        : 'text-zinc-300 hover:bg-zinc-900'
                                    }`}
                                >
                                    <span className={isActive ? "text-amber-500" : "text-zinc-500"}>{link.icon}</span>
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                    
                    <div className="p-6 mt-auto border-t border-zinc-800">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition shadow-sm"
                        >
                            <LogOut size={18} />
                            <span>Exit Admin</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
