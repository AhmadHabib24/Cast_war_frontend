'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { User, Camera, Shield, Eye, Loader2, AlertCircle, ExternalLink, Globe, MessageCircle, Play, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [name, setName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [twitter, setTwitter] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [youtube, setYoutube] = useState('');
    const [showSocials, setShowSocials] = useState(true);
    const [showAmount, setShowAmount] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetchApi('/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data?.user) {
                    const u = res.data.user;
                    setProfile(u.profile || {});
                    setName(u.name || '');
                    setDisplayName(u.profile?.display_name || '');
                    setInstagram(u.profile?.pending_instagram_url || u.profile?.instagram_url || '');
                    setFacebook(u.profile?.pending_facebook_url || u.profile?.facebook_url || '');
                    setTwitter(u.profile?.pending_twitter_url || u.profile?.twitter_url || '');
                    setTiktok(u.profile?.pending_tiktok_url || u.profile?.tiktok_url || '');
                    setYoutube(u.profile?.pending_youtube_url || u.profile?.youtube_url || '');
                    setShowSocials(u.profile?.show_social_links ?? true);
                    setShowAmount(u.profile?.show_contribution_amount ?? true);
                    setPublicProfile(u.profile?.public_profile_enabled ?? true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setInitialLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi('/profile', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name,
                    display_name: displayName,
                    instagram_url: instagram,
                    facebook_url: facebook,
                    twitter_url: twitter,
                    tiktok_url: tiktok,
                    youtube_url: youtube,
                    show_social_links: showSocials,
                    show_contribution_amount: showAmount,
                    public_profile_enabled: publicProfile
            })
        });
        toast.success('Profile settings saved successfully.');
        
        // Update local state if it went to pending
        if (res.data?.user?.profile) {
            setProfile(res.data.user.profile);
        }
    } catch (err: any) {
        toast.error(err.message || 'Error saving settings.');
    } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="flex items-center justify-center h-64 text-gray-500 font-bold"><Loader2 className="animate-spin mr-2"/> Loading Settings...</div>;

    const isPending = profile?.social_links_status === 'pending';

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Profile Settings</h2>
                    <p className="text-gray-500 text-xs font-medium mt-0.5">Manage your identity in the Hall of Warriors.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <form onSubmit={handleSave} className="p-5 md:p-6 space-y-6">
                    
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3 flex items-center">
                            <User size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> Basic Identity
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Full Name (Private)</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Display Name (Public)</label>
                                <input 
                                    type="text" 
                                    value={displayName} 
                                    onChange={(e) => setDisplayName(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition" 
                                    placeholder="Leave blank to use Full Name" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <div className="flex justify-between items-end border-b border-gray-100 pb-2 mb-3">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center">
                                <Camera size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> Social Connections
                            </h3>
                            {isPending && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider animate-pulse">
                                    Pending Approval
                                </span>
                            )}
                            {profile?.social_links_status === 'rejected' && (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                    Last Request Rejected
                                </span>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            {isPending && (
                                <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-lg"></div>
                            )}
                            <div>
                                <label className="flex items-center text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                    <Camera size={10} className="mr-1" /> Instagram URL
                                </label>
                                <input 
                                    type="url" 
                                    value={instagram} 
                                    onChange={(e) => setInstagram(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition disabled:bg-gray-100 disabled:text-gray-400" 
                                    placeholder="https://instagram.com/..." 
                                    disabled={isPending}
                                />
                            </div>
                            <div>
                                <label className="flex items-center text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                    <Globe size={10} className="mr-1" /> Facebook URL
                                </label>
                                <input 
                                    type="url" 
                                    value={facebook} 
                                    onChange={(e) => setFacebook(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition disabled:bg-gray-100 disabled:text-gray-400" 
                                    placeholder="https://facebook.com/..."
                                    disabled={isPending}
                                />
                                {profile?.facebook_url && !isPending && (
                                    <div className="mt-1 text-right">
                                        <a href={profile.facebook_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[9px] font-bold text-[var(--color-metallic-gold)] hover:underline">
                                            <ExternalLink size={8} className="mr-0.5"/> Preview
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative mt-4">
                            {isPending && (
                                <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-lg"></div>
                            )}
                            <div>
                                <label className="flex items-center text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                    <MessageCircle size={10} className="mr-1" /> Twitter URL
                                </label>
                                <input 
                                    type="url" 
                                    value={twitter} 
                                    onChange={(e) => setTwitter(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition disabled:bg-gray-100 disabled:text-gray-400" 
                                    placeholder="https://twitter.com/..."
                                    disabled={isPending}
                                />
                                {profile?.twitter_url && !isPending && (
                                    <div className="mt-1 text-left">
                                        <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[9px] font-bold text-[var(--color-metallic-gold)] hover:underline">
                                            <ExternalLink size={8} className="mr-0.5"/> Preview
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="flex items-center text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                    <Video size={10} className="mr-1" /> TikTok URL
                                </label>
                                <input 
                                    type="url" 
                                    value={tiktok} 
                                    onChange={(e) => setTiktok(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition disabled:bg-gray-100 disabled:text-gray-400" 
                                    placeholder="https://tiktok.com/..."
                                    disabled={isPending}
                                />
                                {profile?.tiktok_url && !isPending && (
                                    <div className="mt-1 text-right">
                                        <a href={profile.tiktok_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[9px] font-bold text-[var(--color-metallic-gold)] hover:underline">
                                            <ExternalLink size={8} className="mr-0.5"/> Preview
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative mt-4">
                            {isPending && (
                                <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-lg"></div>
                            )}
                            <div>
                                <label className="flex items-center text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                                    <Play size={10} className="mr-1" /> YouTube URL
                                </label>
                                <input 
                                    type="url" 
                                    value={youtube} 
                                    onChange={(e) => setYoutube(e.target.value)} 
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-[var(--color-metallic-gold)] outline-none transition disabled:bg-gray-100 disabled:text-gray-400" 
                                    placeholder="https://youtube.com/..."
                                    disabled={isPending}
                                />
                                {profile?.youtube_url && !isPending && (
                                    <div className="mt-1 text-left">
                                        <a href={profile.youtube_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[9px] font-bold text-[var(--color-metallic-gold)] hover:underline">
                                            <ExternalLink size={8} className="mr-0.5"/> Preview
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isPending && (
                            <p className="text-[10px] text-orange-600 font-bold mt-2 border border-orange-100 bg-orange-50 p-2 rounded">Your social links are currently under review by an administrator. You cannot change them until the review is complete.</p>
                        )}
                        {!isPending && profile?.instagram_url && (
                             <div className="mt-1 text-left">
                                <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-[9px] font-bold text-[var(--color-metallic-gold)] hover:underline">
                                    <ExternalLink size={8} className="mr-0.5"/> Preview Instagram
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Privacy */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3 flex items-center">
                            <Eye size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> Privacy Settings
                        </h3>
                        
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)]" />
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">Enable Public Profile</p>
                                    <p className="text-[10px] text-gray-500">Allow your profile to be seen in the Hall of Warriors.</p>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 cursor-pointer transition ${!publicProfile ? 'opacity-50' : 'hover:opacity-80'}`}>
                                <input type="checkbox" checked={showAmount} onChange={(e) => setShowAmount(e.target.checked)} disabled={!publicProfile} className="w-3.5 h-3.5 rounded border-gray-300 text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)] disabled:cursor-not-allowed" />
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">Show Total Contributions</p>
                                    <p className="text-[10px] text-gray-500">Show the total War Power you've sent on your profile.</p>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 cursor-pointer transition ${!publicProfile ? 'opacity-50' : 'hover:opacity-80'}`}>
                                <input type="checkbox" checked={showSocials} onChange={(e) => setShowSocials(e.target.checked)} disabled={!publicProfile} className="w-3.5 h-3.5 rounded border-gray-300 text-[var(--color-metallic-gold)] focus:ring-[var(--color-metallic-gold)] disabled:cursor-not-allowed" />
                                <div>
                                    <p className="font-bold text-gray-900 text-xs">Show Social Links</p>
                                    <p className="text-[10px] text-gray-500">Display your social media links on your public profile.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || isPending}
                            className="w-full md:w-auto px-6 py-2 bg-[var(--color-brand-black)] hover:bg-gray-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
