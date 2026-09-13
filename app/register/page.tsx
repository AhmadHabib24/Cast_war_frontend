'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '@/lib/api';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSuccess = async (tokenResponse: any) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ token: tokenResponse.access_token })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                toast.success('Successfully logged in with Google');
                if (data.data.user.role === 'admin') router.push('/admin');
                else router.push('/');
            } else {
                toast.error(data.message || 'Google Login failed');
            }
        } catch (err) {
            toast.error('An error occurred during Google login');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => toast.error('Google Login Failed'),
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                toast.success('Registration successful!');
                router.push('/');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090d] flex flex-col justify-center py-12 px-6 font-sans">
            <div className="max-w-md w-full mx-auto relative">
                {/* Back Link */}
                <div className="absolute -top-12 left-0">
                    <Link href="/" className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                        ← Back to Battlefield
                    </Link>
                </div>

                <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-800/80 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-zinc-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Become a <span className="text-amber-400">Warrior</span></h2>
                        <p className="text-zinc-400 text-sm font-medium mt-1.5">Enlist in the Cast War</p>
                    </div>

                    <div className="space-y-4 mb-6 relative z-10">
                        <button 
                            type="button"
                            onClick={() => loginWithGoogle()}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-zinc-900 font-bold text-sm rounded-xl hover:bg-zinc-100 transition-colors shadow-sm disabled:opacity-70"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">or with email</span>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium text-white placeholder-zinc-600 text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium text-white placeholder-zinc-600 text-sm"
                                placeholder="warrior@example.com"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium text-white placeholder-zinc-600 pr-12 text-sm"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[32px] text-zinc-500 hover:text-zinc-300 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium text-white placeholder-zinc-600 pr-12 text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading ? 'ENLISTING...' : 'ENLIST NOW'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold text-zinc-500 relative z-10">
                        Already a warrior? <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
