'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface Cast {
    id: number;
    name: string;
    slug: string;
    total_points: number;
}

export default function BoostCastPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [cast, setCast] = useState<Cast | null>(null);
    const [amount, setAmount] = useState('100');
    const [visibility, setVisibility] = useState('public');
    const [walletBalance, setWalletBalance] = useState(15000); // Mock starting balance for UI
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadCast = async () => {
            try {
                const res = await fetchApi(`/casts/${slug}`);
                setCast(res.data.cast);
                // Also fetch actual wallet balance here in real implementation
            } catch (err: any) {
                setError('Cast not found');
            } finally {
                setLoading(false);
            }
        };
        if (slug) loadCast();
    }, [slug]);

    const handleBoost = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (parseFloat(amount) > walletBalance) {
            setError('Insufficient wallet balance. Please add funds first.');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Mock transaction or real fetch
            /*
            const res = await fetchApi(`/casts/${slug}/contribute`, {
                method: 'POST',
                body: JSON.stringify({ amount, visibility })
            });
            */
            setTimeout(() => {
                setSuccess(`Successfully boosted ${cast?.name} by ${amount} points!`);
                setWalletBalance(prev => prev - parseFloat(amount));
                setSubmitting(false);
                setTimeout(() => router.push(`/casts/${slug}`), 2000);
            }, 1500);
            
        } catch (err: any) {
            setError(err.message || 'Failed to process boost.');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--color-metallic-gold)] font-bold text-xl bg-[var(--color-brand-black)]">Loading Armory...</div>;
    if (error && !cast) return <div className="min-h-screen flex items-center justify-center text-[var(--color-danger)] font-bold text-xl bg-[var(--color-brand-black)]">{error}</div>;

    return (
        <div className="min-h-screen bg-[var(--color-brand-black)] text-white p-6 pt-24 relative overflow-hidden">
            {/* Background Hint */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-metallic-gold)_1px,_transparent_1px)] bg-[size:30px_30px]"></div>
            
            <div className="max-w-xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--color-metallic-gold)] tracking-tight mb-2">BOOST YOUR CAST</h1>
                    <p className="text-[var(--color-off-white)]/80 text-lg">Send power to <strong className="text-white">{cast?.name}</strong></p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
                    
                    {/* Wallet Status */}
                    <div className="flex justify-between items-center p-4 bg-[var(--color-off-white)] rounded-xl border border-[var(--color-border-gray)] mb-8">
                        <div>
                            <span className="text-xs text-[var(--color-muted-text)] font-bold uppercase tracking-wider block mb-1">Available War Chest</span>
                            <span className="text-2xl font-black text-[var(--color-brand-black)]">PKR {walletBalance.toLocaleString()}</span>
                        </div>
                        <button onClick={() => router.push('/dashboard/deposit')} className="text-xs font-bold text-[var(--color-metallic-gold)] hover:text-[var(--color-rich-gold)] uppercase tracking-wider underline">
                            Add Funds
                        </button>
                    </div>

                    {error && <div className="mb-6 p-4 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm font-bold">{error}</div>}
                    {success && <div className="mb-6 p-4 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm font-bold text-center text-lg">{success}</div>}

                    <form onSubmit={handleBoost} className="space-y-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-charcoal)] mb-3">Power Amount (1 PKR = 1 Point)</label>
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {[100, 500, 1000, 5000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className={`py-2 rounded-lg font-bold border-2 transition-all ${amount === val.toString() ? 'border-[var(--color-metallic-gold)] bg-[var(--color-metallic-gold)]/10 text-[var(--color-brand-black)]' : 'border-[var(--color-border-gray)] text-[var(--color-charcoal)] hover:border-gray-300'}`}
                                    >
                                        +{val}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                min="10"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border-gray)] focus:ring-4 focus:ring-[var(--color-metallic-gold)]/30 focus:border-[var(--color-metallic-gold)] outline-none transition-all text-2xl font-black text-[var(--color-brand-black)] text-center"
                                placeholder="Custom Amount"
                            />
                        </div>

                        {/* Visibility */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-charcoal)] mb-2">Contribution Visibility</label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border-gray)] focus:ring-4 focus:ring-[var(--color-metallic-gold)]/30 focus:border-[var(--color-metallic-gold)] outline-none font-bold text-[var(--color-charcoal)] bg-white appearance-none"
                            >
                                <option value="public">Public (Show Name & Amount)</option>
                                <option value="private_amount">Private Amount (Show Name Only)</option>
                                <option value="anonymous">Anonymous Warrior (Hide Identity)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-[var(--color-metallic-gold)] hover:bg-[var(--color-rich-gold)] text-[var(--color-brand-black)] font-black text-xl rounded-xl shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-1 flex justify-center items-center"
                        >
                            {submitting ? 'CHANNELING POWER...' : 'IGNITE BOOST'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
