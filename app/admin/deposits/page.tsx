'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, CreditCard, User, Hash, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL, BASE_URL } from '@/lib/api';

export default function AdminDepositsPage() {
    const [deposits, setDeposits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDeposits = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/deposits`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setDeposits(data.data);
                // If a deposit was selected but is no longer in the pending list, deselect it
                if (selectedDeposit && !data.data.find((d: any) => d.id === selectedDeposit.id)) {
                    setSelectedDeposit(null);
                    setShowRejectInput(false);
                }
            }
        } catch (error) {
            console.error("Failed to fetch deposits", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        if (action === 'reject' && !showRejectInput) {
            setShowRejectInput(true);
            return;
        }

        if (action === 'reject' && !rejectReason.trim()) {
            toast.error("Please provide a rejection reason.");
            return;
        }

        toast((t) => (
            <div>
                <p className="font-bold mb-3 text-sm text-zinc-800 tracking-wide">Confirm {action} deposit?</p>
                <div className="flex gap-2 justify-end">
                    <button 
                        className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 px-4 py-1.5 rounded-lg text-xs font-bold transition" 
                        onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button 
                        className="bg-zinc-900 text-white hover:bg-black px-4 py-1.5 rounded-lg text-xs font-bold transition" 
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeAction(id, action);
                        }}>
                        Yes, {action}
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const executeAction = async (id: number, action: 'approve' | 'reject') => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${API_URL}/admin/deposits/${id}/${action}`;
            
            const bodyData: any = {};
            if (action === 'reject') {
                bodyData.reason = rejectReason;
            }

            const res = await fetch(url, { 
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success(`Deposit ${action}ed successfully.`);
                setRejectReason('');
                setShowRejectInput(false);
                fetchDeposits(); // Refresh list
            } else {
                toast.error(data.message || `Failed to ${action} deposit.`);
            }
        } catch (err) {
            console.error(err);
            toast.error("A network error occurred.");
        } finally {
            setActionLoading(false);
        }
    };

    const filteredDeposits = deposits.filter(d => 
        d.reference?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading pending requests...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white">Pending Deposits</h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">{deposits.length} requests awaiting verification.</p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search reference or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 pl-9 pr-4 py-2 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-zinc-500"
                    />
                </div>
            </div>

            {/* Split View Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column: List of Deposits */}
                <div className="w-full lg:w-1/3 flex flex-col gap-3">
                    {filteredDeposits.length === 0 ? (
                        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 text-center shadow-sm">
                            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-3" />
                            <p className="text-white font-bold text-sm">You're all caught up!</p>
                            <p className="text-zinc-400 text-xs mt-1">No pending deposits.</p>
                        </div>
                    ) : (
                        filteredDeposits.map(d => (
                            <button 
                                key={d.id}
                                onClick={() => {
                                    setSelectedDeposit(d);
                                    setShowRejectInput(false);
                                    setRejectReason('');
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                    selectedDeposit?.id === d.id 
                                    ? 'bg-zinc-900 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)] transform scale-[1.02]' 
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1.5 rounded-md ${selectedDeposit?.id === d.id ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                            <Clock size={14} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedDeposit?.id === d.id ? 'text-amber-500/70' : 'text-zinc-500'}`}>
                                            ID: #{d.id}
                                        </span>
                                    </div>
                                    <span className="font-black text-sm">
                                        PKR {parseFloat(d.amount).toLocaleString()}
                                    </span>
                                </div>
                                <h3 className={`font-bold text-sm truncate ${selectedDeposit?.id === d.id ? 'text-white' : 'text-zinc-100'}`}>
                                    {d.user?.name || 'Unknown User'}
                                </h3>
                                <p className={`text-xs mt-1 truncate ${selectedDeposit?.id === d.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    Ref: {d.reference}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Right Column: Deposit Details */}
                <div className="w-full lg:w-2/3 sticky top-6">
                    {selectedDeposit ? (
                        <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden animate-fade-in">
                            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                                <h3 className="font-black text-white flex items-center space-x-2">
                                    <FileText size={18} className="text-amber-500" />
                                    <span>Deposit Request details</span>
                                </h3>
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap text-center">
                                    Pending Review
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-800">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Requested Amount</p>
                                        <p className="text-4xl font-black text-amber-500">PKR {parseFloat(selectedDeposit.amount).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-lg font-bold text-white capitalize">{selectedDeposit.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center space-x-1.5"><User size={12}/> <span>User</span></p>
                                            <p className="font-bold text-sm text-white mt-1">{selectedDeposit.user?.name}</p>
                                            <p className="text-xs text-zinc-400">{selectedDeposit.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center space-x-1.5"><Calendar size={12}/> <span>Date Submitted</span></p>
                                            <p className="font-bold text-sm text-white mt-1">
                                                {new Date(selectedDeposit.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center space-x-1.5"><CreditCard size={12}/> <span>Payment Method</span></p>
                                            <p className="font-bold text-sm text-white mt-1 uppercase">{selectedDeposit.payment_method?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center space-x-1.5"><Hash size={12}/> <span>Transaction Reference</span></p>
                                            <p className="font-mono text-sm font-bold text-amber-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded inline-block mt-1">
                                                {selectedDeposit.reference || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedDeposit.proof && (
                                    <div className="mb-8">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center space-x-1.5"><FileText size={12}/> <span>Payment Receipt / Proof</span></p>
                                        <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-xl text-center">
                                            <a href={`${BASE_URL}/storage/${selectedDeposit.proof}`} target="_blank" rel="noreferrer" className="block max-h-64 overflow-hidden rounded-lg group relative">
                                                <img src={`${BASE_URL}/storage/${selectedDeposit.proof}`} alt="Proof" className="w-auto mx-auto max-h-64 object-contain transition group-hover:opacity-75" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                                                    <span className="bg-zinc-900 text-white border border-zinc-700 px-4 py-2 rounded-full font-bold text-xs shadow-lg">Click to Enlarge</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {showRejectInput ? (
                                    <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/50 animate-fade-in">
                                        <label className="block text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Reason for Rejection</label>
                                        <textarea 
                                            rows={2}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Provide a reason to the user..."
                                            className="w-full px-4 py-2 bg-zinc-950 rounded-lg border border-red-900/50 text-white focus:ring-2 focus:ring-red-500 outline-none text-sm mb-3 resize-none placeholder-zinc-600"
                                            autoFocus
                                        />
                                        <div className="flex space-x-2 justify-end">
                                            <button 
                                                onClick={() => setShowRejectInput(false)}
                                                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-zinc-800 rounded-lg transition"
                                                disabled={actionLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleAction(selectedDeposit.id, 'reject')}
                                                disabled={actionLoading || !rejectReason.trim()}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
                                            >
                                                <XCircle size={14} />
                                                <span>Confirm Rejection</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                                        <button 
                                            onClick={() => handleAction(selectedDeposit.id, 'approve')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                                        >
                                            <CheckCircle size={18} />
                                            <span>Approve & Credit Wallet</span>
                                        </button>
                                        <button 
                                            onClick={() => handleAction(selectedDeposit.id, 'reject')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 hover:text-red-500 text-zinc-300 py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                                        >
                                            <XCircle size={18} />
                                            <span>Reject Deposit</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 h-64 flex flex-col items-center justify-center text-zinc-500">
                            <FileText size={48} className="mb-4 text-zinc-700" />
                            <p className="font-bold text-sm text-zinc-400">Select a deposit request</p>
                            <p className="text-xs mt-1">Click a request from the left list to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
