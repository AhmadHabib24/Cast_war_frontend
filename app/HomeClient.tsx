'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Trophy, Users, Sword, ArrowRight } from 'lucide-react';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/');
}

export default function Home() {
    const router = useRouter();
    const [casts, setCasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopCasts = async () => {
            try {
                const res = await fetch(`${API_URL}/leaderboard`);
                const data = await res.json();
                if (data.success) {
                    setCasts(data.data.slice(0, 10)); // Top 10 only
                }
            } catch (err) {
                console.error("Failed to fetch top casts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopCasts();
    }, []);

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

            {/* Top 10 Casts (Pill-shaped cards) */}
            <div className="w-full max-w-5xl mx-auto mt-24 px-6 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Today's Top Ranking</h2>
                    <Link href="/leaderboard" className="text-[var(--color-rich-gold)] text-sm font-bold hover:underline mt-2 inline-block">See all &gt;</Link>
                </div>

                {loading ? (
                    <div className="text-center text-[var(--color-muted-text)] font-bold animate-pulse py-10">
                        Loading rankings...
                    </div>
                ) : (
                    <div className="space-y-4">
                        {casts.map((cast: any, idx: number) => {
                            const isFirst = idx === 0;
                            const isSecond = idx === 1;
                            const isThird = idx === 2;

                            return (
                                <div 
                                    key={cast.id} 
                                    className="w-full flex items-center justify-between p-4 md:px-8 md:py-5 bg-white rounded-full shadow-sm border border-[var(--color-border-gray)] transition-all duration-300 hover:border-[var(--color-metallic-gold)] hover:shadow-md animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4 md:gap-6 w-1/2">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base shadow-sm ${
                                            isFirst ? 'bg-yellow-400 text-white' : 
                                            isSecond ? 'bg-gray-300 text-white' : 
                                            isThird ? 'bg-orange-400 text-white' : 'bg-gray-100 text-[var(--color-muted-text)]'
                                        }`}>
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg md:text-xl text-[var(--color-brand-black)] truncate max-w-[150px] md:max-w-[300px]">{cast.name}</div>
                                            <div className="text-[10px] md:text-xs text-[var(--color-muted-text)] font-medium flex items-center gap-1">
                                                <Users size={12} /> {cast.contributors_count} warriors
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 md:gap-8 justify-end w-1/2">
                                        <div className="text-right">
                                            <span className={`font-black text-lg md:text-2xl block ${isFirst ? 'text-[var(--color-rich-gold)]' : 'text-gray-800'}`}>
                                                {cast.total_points.toLocaleString()} <span className="text-xs md:text-sm font-bold text-gray-400">pts</span>
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/casts/${cast.id}`)}
                                            className="px-4 py-2 md:px-6 md:py-2.5 bg-[var(--color-brand-black)]/5 hover:bg-[var(--color-metallic-gold)] text-[var(--color-brand-black)] hover:text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-full transition-all shadow-sm whitespace-nowrap"
                                        >
                                            Boost
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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

            {/* SEO Content Section - How It Works */}
            <section className="w-full max-w-6xl mx-auto mt-32 px-6 relative z-10" aria-labelledby="how-it-works">
                <div className="text-center mb-12">
                    <h2 id="how-it-works" className="text-3xl md:text-4xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">How to Boost Your Biradari</h2>
                    <p className="text-[var(--color-muted-text)] font-medium text-lg mt-3 max-w-2xl mx-auto">
                        Joining the top Pakistani biradari ranking is simple. Follow these steps to elevate your cast's legacy on the global stage.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] text-center relative pt-12 hover:border-[var(--color-metallic-gold)] transition-colors group">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform">1</div>
                        <h3 className="text-xl font-black text-[var(--color-brand-black)] mb-3">Find Your Cast</h3>
                        <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Search for your specific Pakistani cast or biradari (like Jutt, Rajput, Arain, or Gujjar) in our directory.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] text-center relative pt-12 hover:border-[var(--color-metallic-gold)] transition-colors group">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform">2</div>
                        <h3 className="text-xl font-black text-[var(--color-brand-black)] mb-3">Boost with Power</h3>
                        <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Contribute to your cast's war chest. Every contribution directly increases your community's total power score.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border-gray)] text-center relative pt-12 hover:border-[var(--color-metallic-gold)] transition-colors group">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform">3</div>
                        <h3 className="text-xl font-black text-[var(--color-brand-black)] mb-3">Dominate Rankings</h3>
                        <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">Watch in real-time as your biradari climbs the official Pakistan cast leaderboard to claim the #1 spot.</p>
                    </div>
                </div>
            </section>

            {/* SEO Content Section - About */}
            <article className="w-full max-w-4xl mx-auto mt-24 px-6 text-center relative z-10" aria-labelledby="about-cast-war">
                <h2 id="about-cast-war" className="text-3xl md:text-4xl font-black text-[var(--color-brand-black)] uppercase tracking-tight mb-6">The Ultimate Pakistan Cast Leaderboard</h2>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-border-gray)] text-left space-y-4">
                    <p className="text-[var(--color-charcoal)] leading-relaxed font-medium">
                        Welcome to <strong>Cast War</strong>, the definitive platform for tracking the <em>top casts in Pakistan</em>. For generations, the cultural fabric of our society has been woven with the rich histories, legacies, and pride of various biradaris and casts.
                    </p>
                    <p className="text-[var(--color-charcoal)] leading-relaxed font-medium">
                        Whether you belong to the agricultural powerhouses, the historical warrior lineages, or the influential business communities, this platform serves as a modern, digital battleground. Our <strong>online cast ranking</strong> system is fully transparent, allowing users from across the globe to contribute power to their respective communities.
                    </p>
                    <p className="text-[var(--color-charcoal)] leading-relaxed font-medium">
                        The rules are simple: the cast with the most dedicated warriors and the largest war chest reigns supreme. Will your biradari secure its legacy at the top of the leaderboard today?
                    </p>
                </div>
            </article>

            {/* SEO Content Section - FAQ */}
            <section className="w-full max-w-4xl mx-auto mt-24 px-6 relative z-10 mb-10" aria-labelledby="faq">
                <div className="text-center mb-10">
                    <h2 id="faq" className="text-3xl md:text-4xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { q: "What is the Pakistani biradari ranking system?", a: "It is a competitive, real-time leaderboard where users can financially boost their specific cast to prove their community's dominance and power." },
                        { q: "How are the top casts in Pakistan determined here?", a: "Rankings are strictly based on the 'Total Power' (pts) accumulated. Power is generated when verified users contribute to their cast's war chest." },
                        { q: "Is my contribution safe and secure?", a: "Yes. All deposits are processed through highly secure, encrypted payment gateways. Every transaction is logged transparently on the platform." },
                        { q: "Can I support my cast anonymously?", a: "Absolutely. While you can choose to be displayed in the Hall of Warriors to show your pride, you also have the option to boost your cast entirely anonymously." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--color-border-gray)] hover:shadow-md transition-shadow">
                            <h3 className="text-lg md:text-xl font-black text-[var(--color-brand-black)] mb-2">{faq.q}</h3>
                            <p className="text-[var(--color-muted-text)] font-medium leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
