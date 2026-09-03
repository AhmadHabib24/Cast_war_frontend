'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {  fetchApi , API_URL, BASE_URL } from '@/lib/api';
import toast from 'react-hot-toast';
import { Wallet, Shield, X, Loader2, ArrowRight, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/SocialIcons';
import Link from 'next/link';
import echo from '@/lib/echo';

interface Cast {
    id: number;
    name: string;
    slug: string;
    description: string;
    total_points: number;
    total_contributors: number;
    current_rank: number | null;
    overtake_points?: number | null;
    overtake_target_name?: string | null;
}

interface Warrior {
    id: number;
    name: string;
    profile: any;
    total_points: number | null;
    is_hidden: boolean;
}

export default function CastProfilePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [cast, setCast] = useState<Cast | null>(null);
    const [warriors, setWarriors] = useState<Warrior[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingWarriors, setLoadingWarriors] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [amount, setAmount] = useState('100');
    const [visibility, setVisibility] = useState('public');
    const [submitting, setSubmitting] = useState(false);

    // Optional Socials State
    const [showSocials, setShowSocials] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');

    useEffect(() => {
        const loadCastAndWarriors = async () => {
            try {
                const res = await fetchApi(`/casts/${slug}`);
                
                const castData = res.data.cast;
                castData.overtake_points = res.data.overtake_points;
                castData.overtake_target_name = res.data.overtake_target_name;
                
                setCast(castData);
                
                const warriorsRes = await fetchApi(`/casts/${slug}/warriors`);
                if (warriorsRes.success) {
                    setWarriors(warriorsRes.data);
                }
            } catch (err: any) {
                setError(err.message || 'Cast not found');
            } finally {
                setLoading(false);
                setLoadingWarriors(false);
            }
        };

        if (slug) loadCastAndWarriors();

        if (echo && slug) {
            echo.channel('leaderboard')
                .listen('.leaderboard.updated', async (e: any) => {
                    if (e.cast && e.cast.slug === slug) {
                        // Update cast points in real-time
                        setCast(prev => prev ? { 
                            ...prev, 
                            total_points: e.cast.total_points,
                            total_contributors: e.cast.total_contributors
                        } : prev);
                        
                        // Refetch warriors to update the Top Warriors list instantly
                        const warriorsRes = await fetchApi(`/casts/${slug}/warriors`);
                        if (warriorsRes.success) {
                            setWarriors(warriorsRes.data);
                        }
                    }
                });
        }

        return () => {
            if (echo) echo.leaveChannel('leaderboard');
        };
    }, [slug]);

    const handleContributeClick = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to contribute.");
            router.push('/login');
            return;
        }

        setIsModalOpen(true);
        setLoadingWallet(true);

        try {
            const res = await fetch(`${API_URL}/wallet`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setWalletBalance(parseFloat(data.data.wallet.balance));
            } else {
                toast.error("Could not fetch wallet balance.");
            }
        } catch (err) {
            toast.error("Network error while fetching wallet.");
        } finally {
            setLoadingWallet(false);
        }
    };

    const handleBoostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 10) {
            toast.error("Minimum boost amount is 10 PKR.");
            return;
        }

        if (walletBalance !== null && numAmount > walletBalance) {
            toast.error("Insufficient wallet balance.");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('amount', numAmount.toString());
            formData.append('visibility', visibility);
            
            if (avatarFile) formData.append('avatar_file', avatarFile);
            if (instagramUrl) formData.append('instagram_url', instagramUrl);
            if (facebookUrl) formData.append('facebook_url', facebookUrl);

            const res = await fetch(`${API_URL}/casts/${slug}/contribute`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                if (cast) {
                    setCast({
                        ...cast,
                        total_points: data.data.cast_total_points,
                    });
                }
                
                // Refresh warriors list to show the new contribution
                const warriorsRes = await fetchApi(`/casts/${slug}/warriors`);
                if (warriorsRes.success) {
                    setWarriors(warriorsRes.data);
                }
                
                // Refresh cast to update rank reversal stats if needed
                const castRes = await fetchApi(`/casts/${slug}`);
                if (castRes.success) {
                    const castData = castRes.data.cast;
                    castData.overtake_points = castRes.data.overtake_points;
                    castData.overtake_target_name = castRes.data.overtake_target_name;
                    setCast(castData);
                }

                setIsModalOpen(false);
                setAmount('100');
                setAvatarFile(null);
                setAvatarPreview('');
                setInstagramUrl('');
                setFacebookUrl('');
                setShowSocials(false);
            } else {
                toast.error(data.message || "Failed to boost cast.");
            }
        } catch (err: any) {
            toast.error("A network error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-metallic-gold)] font-bold text-xl bg-[var(--color-off-white)]">Loading Cast Profile...</div>;
    
    if (error || !cast) return <div className="min-h-screen flex items-center justify-center text-[var(--color-danger)] font-bold text-xl bg-[var(--color-off-white)]">{error || 'Not Found'}</div>;

    const handleShare = async () => {
        const url = window.location.href;
        const title = `Vote for ${cast.name} in Cast War!`;
        const text = `${cast.name} is currently ranked #${cast.current_rank || 'Unranked'} with ${cast.total_points.toLocaleString()} Power. Join the war!`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-off-white)]">
            {/* Hero Section */}
            <div className="bg-[var(--color-brand-black)] py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-metallic-gold)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
                
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-[var(--color-metallic-gold)] mb-6 drop-shadow-md">
                        {cast.name.toUpperCase()}
                    </h1>
                    <p className="text-xl text-[var(--color-off-white)] max-w-2xl mx-auto leading-relaxed">
                        {cast.description || "The warriors of this cast are gathering their strength."}
                    </p>
                    <button 
                        onClick={handleShare}
                        className="mt-6 mx-auto flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm transition-all border border-white/20 backdrop-blur-sm"
                    >
                        <Share2 size={16} />
                        <span>Share Cast</span>
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 mb-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border-gray)] border border-[var(--color-border-gray)]">
                    
                    <div className="text-center flex flex-col pt-4 md:pt-0">
                        <span className="text-[var(--color-muted-text)] text-sm font-bold uppercase tracking-wider mb-2">Current Rank</span>
                        <span className="text-4xl font-black text-[var(--color-brand-black)]">
                            {cast.current_rank ? `#${cast.current_rank}` : 'Unranked'}
                        </span>
                    </div>

                    <div className="text-center flex flex-col pt-4 md:pt-0">
                        <span className="text-[var(--color-muted-text)] text-sm font-bold uppercase tracking-wider mb-2">Total War Power</span>
                        <span className="text-4xl font-black text-[var(--color-metallic-gold)] drop-shadow-sm">
                            {cast.total_points.toLocaleString()}
                        </span>
                    </div>

                    <div className="text-center flex flex-col pt-4 md:pt-0">
                        <span className="text-[var(--color-muted-text)] text-sm font-bold uppercase tracking-wider mb-2">Warriors</span>
                        <span className="text-4xl font-black text-[var(--color-charcoal)]">
                            {cast.total_contributors.toLocaleString()}
                        </span>
                    </div>

                </div>
            </div>

            {/* Action Section */}
            <div className="max-w-4xl mx-auto px-6 pb-12 text-center">
                <button 
                    onClick={handleContributeClick}
                    className="bg-[var(--color-brand-black)] hover:bg-[var(--color-deep-black)] text-[var(--color-metallic-gold)] font-black text-xl py-5 px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                    CONTRIBUTE TO {cast.name.toUpperCase()}
                </button>
                <p className="text-sm text-[var(--color-muted-text)] mt-4 font-semibold">Boost your cast's ranking on the leaderboard.</p>
            </div>

            {/* Top Warriors Section */}
            <div className="max-w-4xl mx-auto px-6 pb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top Warriors</h2>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{warriors.length} Contributors</span>
                </div>
                
                {loadingWarriors ? (
                    <div className="animate-pulse text-center py-10 text-[var(--color-metallic-gold)] font-bold">Summoning Warriors...</div>
                ) : warriors.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <Shield size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-900 font-bold text-sm">No warriors have stepped forward yet.</p>
                        <p className="text-gray-500 text-xs mt-1">Be the first to boost this cast!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {warriors.map((warrior, idx) => (
                            <div key={warrior.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-metallic-gold)]"></div>
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-500 text-sm border-2 border-[var(--color-metallic-gold)] shadow-sm overflow-hidden">
                                    {warrior.profile?.avatar ? (
                                        <img src={`${BASE_URL}/${warrior.profile.avatar.replace('public/', 'storage/')}`} alt={warrior.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{idx + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-bold text-sm text-gray-900 truncate">
                                            {warrior.profile?.display_name || warrior.name}
                                        </p>
                                        {warrior.profile?.show_social_links && (
                                            <div className="flex space-x-1">
                                                {warrior.profile.instagram_url && (
                                                    <a href={warrior.profile.instagram_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition">
                                                        <InstagramIcon size={14} />
                                                    </a>
                                                )}
                                                {warrior.profile.facebook_url && (
                                                    <a href={warrior.profile.facebook_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                                                        <FacebookIcon size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {warrior.is_hidden ? (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 flex items-center">
                                            <span className="mr-1">🔒</span> Classified
                                        </p>
                                    ) : (
                                        <p className="text-xs font-black text-[var(--color-metallic-gold)] mt-0.5">
                                            {warrior.total_points?.toLocaleString()} WP
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contribution Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-fade-in relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <div>
                                <h3 className="font-black text-gray-900 text-xl flex items-center">
                                    <Shield size={20} className="mr-2 text-[var(--color-metallic-gold)]" />
                                    Boost {cast.name}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {/* Wallet Info */}
                            <div className="mb-6 p-4 rounded-xl border border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-[var(--color-brand-black)] p-2 rounded-lg">
                                        <Wallet size={16} className="text-[var(--color-metallic-gold)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available Balance</p>
                                        {loadingWallet ? (
                                            <div className="h-5 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                                        ) : (
                                            <p className="font-black text-gray-900 text-lg leading-none mt-0.5">
                                                PKR {walletBalance !== null ? walletBalance.toLocaleString() : '0'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Link 
                                    href="/dashboard/deposit" 
                                    className="text-[10px] font-bold text-[var(--color-brand-black)] bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Add Funds
                                </Link>
                            </div>

                            <form onSubmit={handleBoostSubmit} className="space-y-5">
                                {/* Amount Input */}
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 space-y-2 sm:space-y-0 gap-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider shrink-0">Contribution Amount (PKR)</label>
                                        {cast.overtake_points && (
                                            <button 
                                                type="button"
                                                onClick={() => setAmount(cast.overtake_points!.toString())}
                                                className="bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-black uppercase px-2 py-1 rounded-md transition border border-red-200 text-left"
                                            >
                                                🚀 Bid to Overtake {cast.overtake_target_name} (+{cast.overtake_points.toLocaleString()})
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">Rs.</span>
                                        <input
                                            type="number"
                                            min="10"
                                            required
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:ring-0 focus:border-[var(--color-metallic-gold)] outline-none transition-all text-lg font-black text-gray-900"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-semibold mt-2">1 PKR = 1 War Power Point</p>
                                </div>

                                {/* Visibility Option */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contribution Visibility</label>
                                    <div className="space-y-2">
                                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${visibility === 'public' ? 'border-[var(--color-metallic-gold)] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)] w-4 h-4" />
                                            <div className="ml-3">
                                                <p className="font-bold text-gray-900 text-sm">Public Hero</p>
                                                <p className="text-[10px] text-gray-500">Name and amount visible on leaderboard</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${visibility === 'private_amount' ? 'border-[var(--color-metallic-gold)] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="visibility" value="private_amount" checked={visibility === 'private_amount'} onChange={() => setVisibility('private_amount')} className="text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)] w-4 h-4" />
                                            <div className="ml-3">
                                                <p className="font-bold text-gray-900 text-sm">Hidden Amount</p>
                                                <p className="text-[10px] text-gray-500">Name visible, but amount remains a secret</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${visibility === 'anonymous' ? 'border-[var(--color-metallic-gold)] bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="visibility" value="anonymous" checked={visibility === 'anonymous'} onChange={() => setVisibility('anonymous')} className="text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)] w-4 h-4" />
                                            <div className="ml-3">
                                                <p className="font-bold text-gray-900 text-sm">Silent Warrior</p>
                                                <p className="text-[10px] text-gray-500">Completely anonymous contribution</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Optional Socials */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowSocials(!showSocials)}
                                        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                            Customize Appearance <span className="ml-2 text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>
                                        </span>
                                        {showSocials ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                                    </button>
                                    
                                    {showSocials && (
                                        <div className="p-4 space-y-4 animate-fade-in border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-2 font-semibold">Attach your social links to be displayed on the Leaderboard. If you previously saved them in your profile, you can skip this.</p>
                                            
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-[var(--color-metallic-gold)] flex items-center justify-center overflow-hidden shrink-0 relative cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                                    {avatarPreview ? (
                                                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-400 text-center leading-tight">Upload<br/>Avatar</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                                        <span className="text-white font-bold text-xl">+</span>
                                                    </div>
                                                </div>
                                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                                <div className="flex-1 text-xs text-gray-500">
                                                    We recommend a small circular image (e.g., your Instagram profile picture). Max 5MB.
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center"><InstagramIcon size={12} className="mr-1" /> Instagram URL</label>
                                                <input 
                                                    type="url" 
                                                    value={instagramUrl}
                                                    onChange={(e) => setInstagramUrl(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)]"
                                                    placeholder="https://instagram.com/yourusername"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center"><FacebookIcon size={12} className="mr-1" /> Facebook URL</label>
                                                <input 
                                                    type="url" 
                                                    value={facebookUrl}
                                                    onChange={(e) => setFacebookUrl(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)]"
                                                    placeholder="https://facebook.com/yourusername"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Warning if insufficient balance */}
                                {walletBalance !== null && parseFloat(amount || '0') > walletBalance && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-bold flex items-start">
                                        <span className="mr-2">⚠️</span>
                                        <p>You don't have enough balance. Please add funds to your wallet first.</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting || loadingWallet || (walletBalance !== null && parseFloat(amount || '0') > walletBalance)}
                                    className="w-full bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] hover:bg-gray-800 py-4 rounded-xl font-black text-sm transition shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirm Boost - {amount || 0} Points</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
