'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Share2 } from 'lucide-react';

interface Warrior {
    id: number;
    name: string;
    total_contributed: number | null;
    profile: {
        display_name: string | null;
        instagram_url: string | null;
        facebook_url: string | null;
        twitter_url: string | null;
        tiktok_url: string | null;
        youtube_url: string | null;
        show_social_links: boolean;
        show_contribution_amount: boolean;
    };
}

interface TopCast {
    name: string;
    slug: string;
    total_points: string;
}

export default function WarriorProfilePage() {
    const params = useParams();
    const id = params.id as string;
    
    const [warrior, setWarrior] = useState<Warrior | null>(null);
    const [topCasts, setTopCasts] = useState<TopCast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadWarrior = async () => {
            try {
                const res = await fetchApi(`/warriors/${id}`);
                setWarrior(res.data.warrior);
                setTopCasts(res.data.top_casts);
            } catch (err: any) {
                setError(err.message || 'Warrior not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadWarrior();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-metallic-gold)] font-bold text-xl bg-[var(--color-off-white)]">Loading Profile...</div>;
    
    if (error || !warrior) return <div className="min-h-screen flex items-center justify-center text-[var(--color-danger)] font-bold text-xl bg-[var(--color-off-white)]">{error || 'Profile Private or Not Found'}</div>;

    const displayName = warrior.profile.display_name || warrior.name;

    const handleShare = async () => {
        const url = window.location.href;
        const title = `Check out ${displayName}'s Profile on Cast War!`;
        const text = `${displayName} has contributed a total of ${warrior.total_contributed ? warrior.total_contributed.toLocaleString() : 0} Power to the war!`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-off-white)]">
            {/* Hero Section */}
            <div className="bg-[var(--color-brand-black)] py-20 px-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:15px_15px]"></div>
                
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-[var(--color-charcoal)] rounded-full border-4 border-[var(--color-metallic-gold)] flex items-center justify-center text-5xl font-black text-[var(--color-metallic-gold)] mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        {displayName[0].toUpperCase()}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        {displayName}
                    </h1>
                    
                    {warrior.profile.show_social_links && (warrior.profile.instagram_url || warrior.profile.facebook_url || warrior.profile.twitter_url || warrior.profile.tiktok_url || warrior.profile.youtube_url) && (
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {warrior.profile.instagram_url && (
                                <a href={warrior.profile.instagram_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                                    Instagram
                                </a>
                            )}
                            {warrior.profile.facebook_url && (
                                <a href={warrior.profile.facebook_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                                    Facebook
                                </a>
                            )}
                            {warrior.profile.twitter_url && (
                                <a href={warrior.profile.twitter_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                                    Twitter
                                </a>
                            )}
                            {warrior.profile.tiktok_url && (
                                <a href={warrior.profile.tiktok_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                                    TikTok
                                </a>
                            )}
                            {warrior.profile.youtube_url && (
                                <a href={warrior.profile.youtube_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                                    YouTube
                                </a>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={handleShare}
                        className="mt-6 mx-auto flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm transition-all border border-white/20 backdrop-blur-sm"
                    >
                        <Share2 size={16} />
                        <span>Share Profile</span>
                    </button>
                </div>
            </div>

            {/* Total Contribution Stat */}
            {warrior.profile.show_contribution_amount && (
                <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-[var(--color-border-gray)] text-center">
                        <span className="text-[var(--color-muted-text)] text-sm font-bold uppercase tracking-wider mb-2 block">Lifetime War Power Sent</span>
                        <span className="text-5xl font-black text-[var(--color-metallic-gold)] drop-shadow-sm">
                            {(warrior.total_contributed || 0).toLocaleString()} <span className="text-2xl text-[var(--color-charcoal)]">pts</span>
                        </span>
                    </div>
                </div>
            )}

            {/* Top Supported Casts */}
            <div className="max-w-4xl mx-auto px-6 pb-20 mt-12">
                <h3 className="text-2xl font-black text-[var(--color-brand-black)] mb-6 border-b-2 border-[var(--color-border-gray)] pb-4">Top Supported Casts</h3>
                
                {topCasts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topCasts.map((cast, idx) => (
                            <Link key={idx} href={`/casts/${cast.slug}`} className="block group">
                                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-[var(--color-border-gray)] transition-all group-hover:-translate-y-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xl font-bold text-[var(--color-brand-black)] group-hover:text-[var(--color-metallic-gold)] transition-colors">{cast.name}</h4>
                                        <span className="bg-[var(--color-off-white)] text-[var(--color-charcoal)] text-xs font-bold px-2 py-1 rounded">Rank #{idx + 1} Support</span>
                                    </div>
                                    {warrior.profile.show_contribution_amount && (
                                        <p className="text-[var(--color-muted-text)] font-semibold mt-4">
                                            Contributed: <strong className="text-[var(--color-brand-black)]">{parseInt(cast.total_points).toLocaleString()} pts</strong>
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-[var(--color-muted-text)] text-lg">
                        This warrior has not supported any casts yet.
                    </div>
                )}
            </div>
        </div>
    );
}
