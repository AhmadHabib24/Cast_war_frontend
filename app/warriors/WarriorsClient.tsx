'use client';

import { useEffect, useState } from 'react';
import { Shield, Trophy, Search } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/SocialIcons';
import { getSeoMetadata } from '@/lib/seo';
import {  fetchApi , API_URL, BASE_URL } from '@/lib/api';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/warriors');
}

export default function WarriorsPage() {
    const [warriors, setWarriors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWarriors = async () => {
            try {
                const res = await fetchApi('/warriors');
                if (res.success) {
                    setWarriors(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch warriors", err);
            } finally {
                setLoading(false);
            }
        };

        loadWarriors();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-off-white)] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Hall of Warriors</h1>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg">The most legendary contributors shaping the Cast War.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-[var(--color-border-gray)] overflow-hidden">
                    
                    {/* Header Row */}
                    <div className="bg-[var(--color-brand-black)] text-white px-4 md:px-8 py-5 flex items-center font-bold text-[10px] md:text-xs uppercase tracking-widest">
                        <div className="w-16 md:w-20">Rank</div>
                        <div className="flex-1">Warrior Name</div>
                        <div className="w-32 md:w-48 text-right text-[var(--color-metallic-gold)]">Total Power</div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-12 text-center text-[var(--color-muted-text)] font-bold animate-pulse">
                            Loading battlefield heroes...
                        </div>
                    )}

                    {/* Warriors List */}
                    {!loading && (
                        <div className="divide-y divide-gray-100">
                            {warriors.length === 0 ? (
                                <div className="p-16 text-center text-[var(--color-muted-text)] text-lg font-medium">
                                    No warriors have emerged on the battlefield yet.<br/>
                                    <span className="text-sm mt-2 block">Will you be the first?</span>
                                </div>
                            ) : (
                                warriors.map((warrior: any, idx: number) => (
                                    <Link href={`/warriors/${warrior.id}`} key={idx} className="block group">
                                        <div className="px-4 md:px-8 py-6 flex items-center group-hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0">
                                            <div className="w-12 md:w-20 text-lg md:text-xl font-black text-gray-400">#{idx + 1}</div>
                                            
                                            <div className="flex-1 flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-500 text-sm border-2 border-[var(--color-metallic-gold)] shadow-sm overflow-hidden">
                                                    {warrior.profile?.avatar ? (
                                                        <img src={`${BASE_URL}/${warrior.profile.avatar.replace('public/', 'storage/')}`} alt={warrior.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{warrior.name[0]}</span>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-base md:text-lg text-[var(--color-brand-black)] group-hover:text-[var(--color-metallic-gold)] transition-colors">{warrior.profile?.display_name || warrior.name}</span>
                                                        {warrior.profile?.show_social_links && (
                                                            <div className="flex space-x-1">
                                                                {warrior.profile.instagram_url && (
                                                                    <a href={warrior.profile.instagram_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-pink-600 transition">
                                                                        <InstagramIcon size={14} />
                                                                    </a>
                                                                )}
                                                                {warrior.profile.facebook_url && (
                                                                    <a href={warrior.profile.facebook_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-blue-600 transition">
                                                                        <FacebookIcon size={14} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-24 md:w-48 text-right font-black text-[var(--color-rich-gold)] text-lg md:text-xl">
                                                {warrior.contributions_sum_points ? warrior.contributions_sum_points.toLocaleString() : 0} <span className="text-xs">pts</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
