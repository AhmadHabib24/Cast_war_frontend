'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Search } from 'lucide-react';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/casts');
}

interface Cast {
    id: number;
    name: string;
    slug: string;
    description: string;
    total_points: number;
    current_rank: number | null;
}

export default function CastDirectoryPage() {
    const [allCasts, setAllCasts] = useState<Cast[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCasts = async () => {
            try {
                const res = await fetchApi('/casts');
                // The API might return { data: { data: [...] } } or { data: [...] } depending on pagination
                const castsData = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setAllCasts(castsData);
            } catch (error) {
                console.error('Failed to load casts', error);
            } finally {
                setLoading(false);
            }
        };
        loadCasts();
    }, []);

    const filteredCasts = allCasts.filter(cast => 
        cast.name.toLowerCase().includes(search.toLowerCase()) || 
        (cast.description && cast.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6 mt-6 md:mt-0">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">CAST DIRECTORY</h1>
                    <p className="text-xl font-medium text-[var(--color-muted-text)]">Find your Cast. Join the War.</p>
                </div>

                <div className="max-w-2xl mx-auto mb-16 relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for a Cast or Alias..."
                        className="w-full pl-8 pr-16 py-5 rounded-full border-2 border-[var(--color-border-gray)] focus:ring-4 focus:ring-[var(--color-metallic-gold)]/20 focus:border-[var(--color-metallic-gold)] outline-none transition-all text-lg font-bold shadow-md text-[var(--color-brand-black)] bg-white truncate"
                    />
                    <button className="absolute right-3 top-3 bottom-3 w-12 bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer">
                        <Search size={20} strokeWidth={3} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-[var(--color-muted-text)] font-bold animate-pulse text-lg">Loading Battlefield Data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCasts.map((cast) => (
                            <Link key={cast.id} href={`/casts/${cast.slug}`} className="block group h-full">
                                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-[var(--color-border-gray)] transition-all transform group-hover:-translate-y-2 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <h2 className="text-2xl font-black text-[var(--color-brand-black)] group-hover:text-[var(--color-rich-gold)] transition-colors leading-tight">
                                            {cast.name}
                                        </h2>
                                        {cast.total_points === 0 ? (
                                            <span className="bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                                                Unranked
                                            </span>
                                        ) : (
                                            <span className="bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                                                RANK #{cast.current_rank || '?'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[var(--color-muted-text)] text-sm mb-8 line-clamp-2 font-medium flex-grow">
                                        {cast.description || `The legendary ${cast.name} community. Prove your power.`}
                                    </p>
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-auto">
                                        <span className="text-[var(--color-charcoal)] text-xs font-bold uppercase tracking-widest">Total Power</span>
                                        <span className={`text-xl font-black ${cast.total_points > 0 ? 'text-[var(--color-rich-gold)]' : 'text-gray-400'}`}>
                                            {cast.total_points.toLocaleString()} <span className="text-sm">pts</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {filteredCasts.length === 0 && (
                            <div className="col-span-full text-center py-24 text-[var(--color-muted-text)] text-xl font-medium bg-white rounded-3xl border border-gray-100">
                                No casts found matching "{search}".<br/>
                                <span className="text-sm mt-2 block">The battlefield is quiet here.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
