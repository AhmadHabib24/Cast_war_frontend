'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, BASE_URL } from '@/lib/api';
import { Wallet, Image as ImageIcon, CheckSquare, Square, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PublicDepositPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('1000');
    const [email, setEmail] = useState('');
    const [methods, setMethods] = useState<any[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [reference, setReference] = useState('');
    
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [loadingMethods, setLoadingMethods] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            // Optionally redirect to dashboard deposit, but we can also just let them use this form
            // router.push('/dashboard/deposit');
        }
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            // Public endpoint to get payment methods, or we can use the same if it doesn't strictly require auth
            const res = await fetch(`${API_URL}/payment-methods`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setMethods(data.data);
                setSelectedMethodId(data.data[0].id);
            }
        } catch (err) {
            console.error('Failed to load payment methods', err);
        } finally {
            setLoadingMethods(false);
        }
    };

    const selectedMethod = methods.find(m => m.id === selectedMethodId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProofPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLoggedIn && !email) { toast.error('Please provide an email address.'); return; }
        if (!selectedMethod) { toast.error('Please select a payment method.'); return; }
        if (!proofFile) { toast.error('Please upload a screenshot/proof of the transaction.'); return; }
        if (!termsAccepted) { toast.error('You must agree to the terms and conditions.'); return; }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('payment_method', selectedMethod.name);
        formData.append('reference', reference);
        formData.append('proof', proofFile);
        if (!isLoggedIn) {
            formData.append('email', email);
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = isLoggedIn ? '/deposits' : '/guest-deposit';
            const headers: any = { 'Accept': 'application/json' };
            if (isLoggedIn && token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Deposit submitted successfully!');
                
                // If it was a guest deposit and they created a new account, we can log them in automatically
                if (data.data?.token) {
                    localStorage.setItem('token', data.data.token);
                    // toast.success('You have been automatically logged in.');
                    setTimeout(() => router.push('/dashboard/deposit'), 2000);
                } else {
                    setTimeout(() => router.push(isLoggedIn ? '/dashboard/deposit' : '/'), 2000);
                }
            } else {
                toast.error(data.message || 'Failed to submit deposit request');
                if (data.errors) {
                    const errorMsgs = Object.values(data.errors).flat().join(' ');
                    toast.error(errorMsgs);
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'A network error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-brand-black)] flex flex-col items-center justify-center p-4">
            
            <div className="w-full max-w-lg mb-6">
                <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white font-bold text-sm transition">
                    <ArrowLeft size={16} className="mr-1" /> Back to Home
                </Link>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
                
                <div className="px-5 py-6 border-b border-zinc-800 bg-zinc-900/50 text-center">
                    <h3 className="font-black text-white text-2xl flex items-center justify-center">
                        <Wallet size={24} className="mr-2 text-amber-500" />
                        Add Funds
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mt-2 max-w-sm mx-auto">
                        Securely deposit funds to your war chest.
                        {!isLoggedIn && " If you don't have an account, we will create one for you automatically."}
                    </p>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="publicDepositForm" onSubmit={handleSubmit} className="space-y-5">
                        
                        {!isLoggedIn && (
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Your Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-800 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-bold text-white bg-zinc-900 placeholder-zinc-600"
                                    placeholder="warrior@example.com"
                                />
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Deposit Amount (PKR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-sm">Rs.</span>
                                <input
                                    type="number"
                                    min="100"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-800 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-black text-white bg-zinc-900"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        {loadingMethods ? (
                            <div className="h-12 bg-zinc-900 animate-pulse rounded-lg"></div>
                        ) : methods.length > 0 ? (
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Select Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {methods.map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setSelectedMethodId(m.id)}
                                            className={`py-3 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                                selectedMethodId === m.id 
                                                ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-sm' 
                                                : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                            }`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-950/30 text-amber-500 p-4 rounded-lg font-bold text-xs border border-amber-900/50">
                                No payment methods currently available. Please try again later.
                            </div>
                        )}

                        {/* Instructions */}
                        {selectedMethod && (
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                <p className="text-xs text-zinc-400 leading-snug">
                                    Transfer exactly <strong className="text-white">Rs. {amount || '0'}</strong> to:
                                </p>
                                
                                <div className="mt-3 flex items-start justify-between gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800 shadow-sm">
                                    <div>
                                        {selectedMethod.type === 'bank' && (
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase">{selectedMethod.bank_name}</p>
                                        )}
                                        <p className="font-mono text-base font-black tracking-wider text-amber-500 leading-tight my-1">
                                            {selectedMethod.account_number}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">
                                            {selectedMethod.account_title}
                                        </p>
                                    </div>

                                    {selectedMethod.qr_code_path && (
                                        <div className="flex-shrink-0 bg-zinc-900 p-2 rounded-lg border border-zinc-800 text-center">
                                            <img 
                                                src={`${BASE_URL}/storage/${selectedMethod.qr_code_path}`} 
                                                alt="QR" 
                                                className="w-14 h-14 object-contain mx-auto rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Proof Upload */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Payment Receipt (Snap)</label>
                            <div className={`border-2 border-dashed rounded-xl p-4 transition-all ${
                                proofPreview ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {proofPreview ? (
                                            <img src={proofPreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg shadow-sm border border-zinc-700" />
                                        ) : (
                                            <div className="bg-zinc-800 p-3 rounded-lg text-zinc-500">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-zinc-300">{proofFile ? proofFile.name : 'Upload Screenshot'}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Max 5MB (JPG, PNG)</p>
                                        </div>
                                    </div>
                                    <label className="cursor-pointer bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition shadow-sm">
                                        Browse
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Transaction Reference (Optional)</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-zinc-800 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono text-white text-sm bg-zinc-900 placeholder-zinc-600"
                                placeholder="e.g. TID123456789"
                            />
                        </div>

                        {/* Terms */}
                        <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-900/30 flex items-start space-x-3 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                            <div className="mt-0.5">
                                {termsAccepted ? (
                                    <CheckSquare size={16} className="text-amber-500" />
                                ) : (
                                    <Square size={16} className="text-zinc-600" />
                                )}
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-snug font-medium select-none">
                                I verify this transfer is complete and accurate. Submitting false receipts will result in an immediate account ban.
                            </p>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                    <button
                        type="submit"
                        form="publicDepositForm"
                        disabled={submitting || methods.length === 0}
                        className="w-full py-4 rounded-xl font-black text-sm bg-amber-500 text-zinc-950 hover:bg-amber-600 transition shadow-lg disabled:opacity-50 flex justify-center items-center space-x-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>Submit Deposit Request</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
