'use client';

import { useEffect, useState } from 'react';
import echo from '@/lib/echo';
import toast from 'react-hot-toast';
import { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import { API_URL, BASE_URL } from '@/lib/api';

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
                const res = await fetch(`${API_URL}/leaderboard`);
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCasts = casts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(casts.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-6 mt-6 md:mt-0">
                
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Global Leaderboard</h1>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg">The definitive ranking of power and legacy in Pakistan.</p>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-[var(--color-muted-text)] font-bold animate-pulse text-lg">
                        Tracking war movements...
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {currentCasts.map((cast: any, idx: number) => {
                                const actualRank = indexOfFirstItem + idx + 1;
                                const isFirst = actualRank === 1;
                                const isSecond = actualRank === 2;
                                const isThird = actualRank === 3;

                                return (
                                    <div 
                                        key={cast.id} 
                                        className="w-full flex items-center justify-between p-4 md:px-8 md:py-5 bg-white rounded-full shadow-sm border border-[var(--color-border-gray)] transition-all duration-300 hover:border-[var(--color-metallic-gold)] hover:shadow-md animate-fade-in-up"
                                    >
                                        <div className="flex items-center gap-4 md:gap-6 w-1/2">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-base md:text-lg shadow-sm ${
                                                isFirst ? 'bg-yellow-400 text-white shadow-yellow-200' : 
                                                isSecond ? 'bg-gray-300 text-white shadow-gray-200' : 
                                                isThird ? 'bg-orange-400 text-white shadow-orange-200' : 'bg-gray-100 text-[var(--color-muted-text)]'
                                            }`}>
                                                #{actualRank}
                                            </div>
                                            <div>
                                                <div className="font-black text-lg md:text-2xl text-[var(--color-brand-black)] truncate max-w-[150px] md:max-w-[400px]">{cast.name}</div>
                                                <div className="text-[10px] md:text-xs text-[var(--color-muted-text)] font-medium mt-0.5">
                                                    {cast.contributors_count} warriors fighting
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 md:gap-8 justify-end w-1/2">
                                            <div className="text-right">
                                                <span className={`font-black text-xl md:text-3xl block ${isFirst ? 'text-[var(--color-rich-gold)]' : 'text-gray-800'}`}>
                                                    {cast.total_points.toLocaleString()} <span className="text-xs md:text-sm font-bold text-gray-400">pts</span>
                                                </span>
                                            </div>
                                            <a 
                                                href={`/casts/${cast.id}`}
                                                className="px-5 py-2 md:px-8 md:py-3 bg-[var(--color-brand-black)]/5 hover:bg-[var(--color-metallic-gold)] text-[var(--color-brand-black)] hover:text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-full transition-all shadow-sm whitespace-nowrap cursor-pointer"
                                            >
                                                Boost
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 rounded-full font-bold text-sm bg-white border border-[var(--color-border-gray)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-[var(--color-muted-text)] font-bold text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 rounded-full font-bold text-sm bg-white border border-[var(--color-border-gray)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
