'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp, Users } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
    const [activeTab, setActiveTab] = useState<'deposits' | 'wallets'>('deposits');
    
    const [depositReport, setDepositReport] = useState<any[]>([]);
    const [walletReport, setWalletReport] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

            const [depRes, walRes] = await Promise.all([
                fetch(`${API_URL}/admin/reports/deposits`, { headers }),
                fetch(`${API_URL}/admin/reports/wallets`, { headers })
            ]);

            const depData = await depRes.json();
            const walData = await walRes.json();

            if (depData.success) setDepositReport(depData.data);
            if (walData.success) setWalletReport(walData.data);

        } catch (error) {
            console.error("Failed to fetch reports", error);
            toast.error("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Generating reports...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center">
                        <FileText className="mr-2 text-amber-500" size={24}/> Financial Reports
                    </h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Detailed breakdown of platform economy and user deposits.</p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('deposits')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition ${activeTab === 'deposits' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                        <Users size={16} className="mr-1.5" /> By User
                    </button>
                    <button 
                        onClick={() => setActiveTab('wallets')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition ${activeTab === 'wallets' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                        <TrendingUp size={16} className="mr-1.5" /> By Wallet
                    </button>
                </div>
            </div>

            {/* Content area */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                
                {activeTab === 'deposits' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="bg-zinc-900/80 text-xs uppercase font-black text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4 text-center">Total Txns</th>
                                    <th className="px-6 py-4 text-right">Total Deposited</th>
                                    <th className="px-6 py-4 text-right">Pending Amount</th>
                                    <th className="px-6 py-4 text-right text-emerald-500">Approved Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {depositReport.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-bold">No deposit data available.</td>
                                    </tr>
                                ) : (
                                    depositReport.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-900/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-white">{row.user_name}</div>
                                                <div className="text-xs text-zinc-500">{row.user_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold">{row.total_deposits_count}</td>
                                            <td className="px-6 py-4 text-right font-mono text-zinc-400">Rs {Number(row.total_deposited_amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-mono text-amber-500">Rs {Number(row.total_pending_amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-mono font-black text-emerald-400">Rs {Number(row.total_approved_amount).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'wallets' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="bg-zinc-900/80 text-xs uppercase font-black text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">Payment Method</th>
                                    <th className="px-6 py-4 text-center">Total Txns</th>
                                    <th className="px-6 py-4 text-right">Pending Amount</th>
                                    <th className="px-6 py-4 text-right text-emerald-500">Approved Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {walletReport.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-bold">No wallet data available.</td>
                                    </tr>
                                ) : (
                                    walletReport.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-900/30 transition">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-white">
                                                {row.payment_method || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold">{row.total_transactions}</td>
                                            <td className="px-6 py-4 text-right font-mono text-amber-500">Rs {Number(row.total_pending_amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-mono font-black text-emerald-400">Rs {Number(row.total_approved_amount).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}
