'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, Shield, Swords, LogIn, LayoutDashboard } from 'lucide-react';
import { API_URL, BASE_URL } from '@/lib/api';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [balance, setBalance] = useState<string>('0.00');

    const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.wallet && user.wallet.balance) {
                        setBalance(user.wallet.balance);
                    }
                } catch (e) {}
            }
            
            fetch(`${API_URL}/wallet`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.wallet) {
                    setBalance(data.data.wallet.balance);
                }
            })
            .catch(() => {});
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navLinks = [
        { name: 'Leaderboard', href: '/leaderboard' },
        { name: 'Casts', href: '/casts' },
        { name: 'Warriors', href: '/warriors' },
    ];

    if (isHidden) {
        return null;
    }

    return (
        <>
        <nav className="fixed w-full z-50 transition-all duration-300 py-4 glass-panel border-b border-[var(--color-border-gray)]">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center">
                    <img 
                        src="/cast-war-logo.png" 
                        alt="Cast War" 
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8 items-center font-bold text-sm tracking-widest uppercase">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`relative transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[var(--color-metallic-gold)] after:transition-transform after:duration-300 after:origin-right ${
                                    isActive 
                                    ? 'text-[var(--color-rich-gold)] after:scale-x-100 after:origin-left' 
                                    : 'text-[var(--color-charcoal)] hover:text-[var(--color-metallic-gold)] after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard/deposit" className="font-bold text-sm px-4 py-2 rounded-full border-2 transition-all border-gray-300 text-[var(--color-charcoal)] hover:border-gray-500">
                                💰 PKR {parseFloat(balance).toLocaleString()}
                            </Link>
                            <Link href="/dashboard" className="bg-[var(--color-metallic-gold)] hover:bg-[var(--color-rich-gold)] text-[var(--color-brand-black)] px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider transition-transform hover:scale-105 shadow-md">
                                HQ
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className="bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider hover:bg-gray-800 active:scale-95 transition-all shadow-md animate-pulse-glow">
                            Login
                        </Link>
                    )}
                </div>

                {/* We removed the hamburger button, mobile will use bottom nav instead */}
            </div>
        </nav>

        {/* Mobile Bottom Navigation (only visible on mobile, not hidden pages) */}
        {!isHidden && (
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--color-brand-black)] border-t border-gray-800 z-50 pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link href="/leaderboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/leaderboard' ? 'text-[var(--color-metallic-gold)]' : 'text-gray-400 hover:text-gray-300'}`}>
                        <Trophy size={20} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Rank</span>
                    </Link>
                    <Link href="/casts" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/casts' ? 'text-[var(--color-metallic-gold)]' : 'text-gray-400 hover:text-gray-300'}`}>
                        <Shield size={20} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Casts</span>
                    </Link>
                    <Link href="/warriors" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/warriors' ? 'text-[var(--color-metallic-gold)]' : 'text-gray-400 hover:text-gray-300'}`}>
                        <Swords size={20} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Warriors</span>
                    </Link>
                    
                    {isAuthenticated ? (
                        <Link href="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname.startsWith('/dashboard') ? 'text-[var(--color-metallic-gold)]' : 'text-gray-400 hover:text-gray-300'}`}>
                            <LayoutDashboard size={20} />
                            <span className="text-[9px] font-bold tracking-widest uppercase">HQ</span>
                        </Link>
                    ) : (
                        <Link href="/login" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/login' ? 'text-[var(--color-metallic-gold)]' : 'text-gray-400 hover:text-gray-300'}`}>
                            <LogIn size={20} />
                            <span className="text-[9px] font-bold tracking-widest uppercase">Login</span>
                        </Link>
                    )}
                </div>
            </div>
        )}
        </>
    );
}
