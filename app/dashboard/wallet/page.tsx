'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {  fetchApi , API_URL, BASE_URL } from '@/lib/api';

interface Transaction {
    id: number;
    type: string;
    amount: string;
    status: string;
    created_at: string;
}

interface Wallet {
    balance: string;
    currency: string;
}

export default function WalletDashboardPage() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWallet = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/wallet`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const data = await res.json();
                
                if (data.success) {
                    setWallet(data.data.wallet);
                    setTransactions(data.data.transactions);
                }
            } catch (error) {
                console.error('Failed to load wallet', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadWallet(); 
    }, []);

    return (
        <div className="space-y-6 pb-12">
            <div>
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
                            <span>My War Chest</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage your deposits and contributions</p>
                    </div>
                    <Link href="/dashboard/deposit" className="bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] font-bold py-2 px-4 text-xs rounded-lg shadow-sm transition-all whitespace-nowrap">
                        Add Funds
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-[var(--color-metallic-gold)] font-bold animate-pulse">Loading War Chest...</div>
                ) : (
                    <>
                        {/* Balance Card */}
                        <div className="bg-[var(--color-brand-black)] rounded-xl p-6 mb-6 shadow-md relative overflow-hidden border border-[var(--color-charcoal)] group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform"></div>
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-metallic-gold)_1px,_transparent_1px)] bg-[size:16px_16px]"></div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                                <div>
                                    <p className="text-[var(--color-off-white)]/70 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                                        <span>Available Balance</span>
                                    </p>
                                    <h2 className="text-3xl font-black text-[var(--color-metallic-gold)] drop-shadow-md">
                                        {wallet?.currency} {wallet?.balance}
                                    </h2>
                                </div>
                                <div className="mt-4 md:mt-0 opacity-80">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-metallic-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="2" y1="10" x2="22" y2="10" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider">Recent Activity</h3>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <li key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
                                                <span className="text-[10px]">{tx.type === 'deposit' ? '⬇️' : '⬆️'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-xs capitalize">{tx.type}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-sm ${tx.type === 'deposit' ? 'text-[var(--color-success)]' : 'text-gray-900'}`}>
                                                {tx.type === 'deposit' ? '+' : ''}{tx.amount}
                                            </p>
                                            <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 bg-gray-100 font-bold text-gray-500 uppercase tracking-wider rounded">{tx.status}</span>
                                        </div>
                                    </li>
                                ))}
                                {transactions.length === 0 && (
                                    <li className="p-8 text-center text-[10px] text-gray-500">No transactions yet. Add funds to start your journey.</li>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
