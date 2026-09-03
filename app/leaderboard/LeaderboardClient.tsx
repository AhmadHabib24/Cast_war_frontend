'use client';

import { useEffect, useState } from 'react';
import echo from '@/lib/echo';
import toast from 'react-hot-toast';
import { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/leaderboard');
}

export default function LeaderboardPage() {
    const [casts, setCasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch top casts
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/casts/leaderboard');
                const data = await res.json();
                if (data.success) setCasts(data.data);
            } catch (err) {
                console.error("Leaderboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        if (echo) {
            echo.channel('leaderboard')
                .listen('.leaderboard.updated', (e: any) => {
                    if (e.message) {
                        toast.success(e.message, { icon: '🚀', duration: 4000 });
                    }
                    
                    setCasts(prevCasts => {
                        // Create a new array, update the specific cast, and re-sort
                        const updatedCasts = [...prevCasts];
                        const index = updatedCasts.findIndex(c => c.id === e.cast.id);
                        
                        if (index !== -1) {
                            updatedCasts[index] = { ...updatedCasts[index], ...e.cast };
                        } else {
                            updatedCasts.push(e.cast); // if it wasn't on leaderboard before
                        }
                        
                        return updatedCasts.sort((a, b) => b.total_points - a.total_points);
                    });
                });
        }

        return () => {
            if (echo) echo.leaveChannel('leaderboard');
        };
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Global Leaderboard</h1>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg">The definitive ranking of power and legacy in Pakistan.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-[var(--color-border-gray)] overflow-hidden">
                    <div className="w-full">
                        {/* Header Row */}
                            <div className="bg-[var(--color-brand-black)] text-white px-4 md:px-8 py-5 flex items-center font-bold text-xs uppercase tracking-widest">
                                <div className="w-16 md:w-20">Rank</div>
                                <div className="flex-1">Cast / Biradari</div>
                                <div className="w-32 md:w-40 text-right text-[var(--color-metallic-gold)]">Total Power</div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="p-12 text-center text-[var(--color-muted-text)] font-bold animate-pulse">
                                    Tracking war movements...
                                </div>
                            )}

                            {/* Leaderboard Rows */}
                            {!loading && (
                                <div className="divide-y divide-gray-100">
                                    {casts.map((cast: any, idx: number) => {
                                        const isFirst = idx === 0;
                                        const isSecond = idx === 1;
                                        const isThird = idx === 2;

                                        return (
                                            <div 
                                                key={cast.id} 
                                                className={`px-4 md:px-8 py-6 flex items-center transition-all hover:bg-gray-50 ${isFirst ? 'bg-[var(--color-metallic-gold)]/5' : ''}`}
                                            >
                                                <div className="w-16 md:w-20 flex items-center">
                                                    {isFirst && <span className="text-2xl md:text-3xl drop-shadow-md">👑</span>}
                                                    {isSecond && <span className="text-xl md:text-2xl drop-shadow-md text-gray-400">🥈</span>}
                                                    {isThird && <span className="text-xl md:text-2xl drop-shadow-md text-orange-400">🥉</span>}
                                                    {!isFirst && !isSecond && !isThird && (
                                                        <span className="text-lg md:text-xl font-black text-gray-400">#{idx + 1}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <div className="font-black text-lg md:text-xl text-[var(--color-brand-black)]">{cast.name}</div>
                                                    <div className="text-[10px] md:text-xs text-[var(--color-muted-text)] mt-1 font-medium">{cast.contributors_count} warriors fighting</div>
                                                </div>

                                                <div className="w-32 md:w-40 text-right">
                                                    <span className={`font-black text-xl md:text-2xl ${isFirst ? 'text-[var(--color-rich-gold)]' : 'text-gray-900'}`}>
                                                        {cast.total_points.toLocaleString()} <span className="text-[10px] md:text-sm">pts</span>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
