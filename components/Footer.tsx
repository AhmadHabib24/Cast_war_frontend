'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Shield, Swords } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

    if (isHidden) {
        return null;
    }

    return (
        <footer className="bg-[var(--color-brand-black)] text-white pt-16 pb-8 border-t border-gray-800 mt-20 md:pb-8 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div>
                        <img src="/cast-war-logo.png" alt="Cast War" className="h-16 w-auto mb-6 object-contain" />
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Join the ultimate power struggle. Boost your cast to the top of the global leaderboard and etch your name in the Hall of Warriors.
                        </p>
                        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-metallic-gold)]">
                            Power • Legacy • Dominance
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-widest text-[var(--color-metallic-gold)] mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/leaderboard" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                                    <Trophy size={16} className="mr-3 text-gray-500 group-hover:text-[var(--color-metallic-gold)] transition-colors" />
                                    <span className="font-bold text-sm">Global Leaderboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/casts" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                                    <Shield size={16} className="mr-3 text-gray-500 group-hover:text-[var(--color-metallic-gold)] transition-colors" />
                                    <span className="font-bold text-sm">All Casts</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/warriors" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                                    <Swords size={16} className="mr-3 text-gray-500 group-hover:text-[var(--color-metallic-gold)] transition-colors" />
                                    <span className="font-bold text-sm">Hall of Warriors</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-widest text-[var(--color-metallic-gold)] mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/dashboard/support" className="text-gray-300 hover:text-white font-bold text-sm transition-colors">
                                    Help Center / Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-white font-bold text-sm transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white font-bold text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-500 text-xs font-bold tracking-wide">
                        &copy; {new Date().getFullYear()} Cast War. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6 text-gray-500">
                        <span className="text-xs font-bold tracking-wider uppercase">Built for Pakistan</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
