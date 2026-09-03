'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Trophy, Users, Sword, ArrowRight } from 'lucide-react';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/');
}

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 flex flex-col items-center">
            
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center px-6 space-y-6">
                <div className="inline-block px-4 py-1.5 bg-[var(--color-metallic-gold)]/10 text-[var(--color-rich-gold)] font-bold rounded-full text-xs uppercase tracking-widest border border-[var(--color-metallic-gold)]/30 mb-2 shadow-sm animate-fade-in-up">
                    The Ultimate Power Struggle
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] tracking-tight leading-snug animate-fade-in-up delay-100 opacity-0">
                    PROVE YOUR <br/>
                    <span className="text-[var(--color-metallic-gold)]">CAST'S LEGACY</span>
                </h1>
                
                <p className="text-base md:text-lg text-[var(--color-charcoal)] max-w-xl mx-auto font-medium mt-4 leading-relaxed animate-fade-in-up delay-200 opacity-0">
                    Join the war. Boost your cast to the top of the global leaderboard. Show the world who holds the real power in Pakistan.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up delay-300 opacity-0">
                    <button 
                        onClick={() => router.push('/leaderboard')}
                        className="w-full sm:w-auto px-6 py-3 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] hover:bg-[var(--color-deep-black)] font-black text-sm uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 animate-pulse-glow"
                    >
                        View Leaderboard
                    </button>
                    <button 
                        onClick={() => router.push('/casts')}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-[var(--color-brand-black)] hover:bg-gray-50 border-2 border-[var(--color-border-gray)] font-black text-sm uppercase tracking-wider rounded-lg shadow-sm transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        Find Your Cast
                    </button>
                </div>
            </div>

            {/* Visual Divider / Slider Placeholder */}
            <div className="w-full max-w-6xl mx-auto mt-20 px-6">
                <div className="bg-[var(--color-brand-black)] rounded-2xl h-56 md:h-80 flex items-center justify-center overflow-hidden relative shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
                    <img src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="War Banner" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute z-20 left-8 md:left-16">
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-snug">
                            Will your <span className="text-[var(--color-metallic-gold)]">Biradari</span><br/> reign supreme?
                        </h2>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 text-left pb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] hover:border-[var(--color-metallic-gold)]/50 group">
                    <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🏆</div>
                    <h3 className="text-2xl font-black text-[var(--color-brand-black)] mb-3">Real-Time Rankings</h3>
                    <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Watch the leaderboard shift instantly as warriors from across the globe boost their casts with immense power.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] hover:border-[var(--color-metallic-gold)]/50 group">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">⚔️</div>
                    <h3 className="text-2xl font-black text-[var(--color-brand-black)] mb-3">Hall of Warriors</h3>
                    <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Earn your place among the greatest contributors. Will you fight publicly or remain an anonymous hero in the shadows?</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] hover:border-[var(--color-metallic-gold)]/50 group">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                    <h3 className="text-2xl font-black text-[var(--color-brand-black)] mb-3">Secure War Chest</h3>
                    <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Deposit funds securely. Every PKR spent goes directly towards elevating your cast's global rank in the war.</p>
                </div>
            </div>

        </div>
    );
}
