'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== passwordConfirmation) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }
        
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                toast.success('Registration successful!');
                router.push('/dashboard');
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
        <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 px-6">
            
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-[var(--color-muted-text)] hover:text-[var(--color-brand-black)] transition-colors">
                    ← Back to Battlefield
                </Link>
            </div>

            <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-10 shadow-xl border border-[var(--color-border-gray)]">
                
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Become a <span className="text-[var(--color-metallic-gold)]">Warrior</span></h2>
                    <p className="text-[var(--color-muted-text)] font-medium mt-2">Enlist in the Cast War</p>
                </div>


                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-[var(--color-border-gray)] focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition-all font-medium text-[var(--color-brand-black)] bg-gray-50 focus:bg-white"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-[var(--color-border-gray)] focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition-all font-medium text-[var(--color-brand-black)] bg-gray-50 focus:bg-white"
                            placeholder="warrior@example.com"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-[var(--color-border-gray)] focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition-all font-medium text-[var(--color-brand-black)] bg-gray-50 focus:bg-white pr-12"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">Confirm Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-[var(--color-border-gray)] focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition-all font-medium text-[var(--color-brand-black)] bg-gray-50 focus:bg-white pr-12"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 mt-4 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] hover:bg-[var(--color-deep-black)] font-black text-lg rounded-xl shadow-md transition-all disabled:opacity-70"
                    >
                        {loading ? 'ENLISTING...' : 'ENLIST NOW'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-bold text-[var(--color-muted-text)]">
                    Already a warrior? <Link href="/login" className="text-[var(--color-rich-gold)] hover:text-[var(--color-metallic-gold)] transition-colors">Log In</Link>
                </div>
            </div>
        </div>
    );
}
