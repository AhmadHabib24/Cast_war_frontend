'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, CreditCard, User, Hash, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

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
            const res = await fetch('http://localhost:8000/api/v1/admin/deposits', {
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
                <p className="font-bold mb-3 text-sm text-gray-800 tracking-wide">Confirm {action} deposit?</p>
                <div className="flex gap-2 justify-end">
                    <button 
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-1.5 rounded-lg text-xs font-bold transition" 
                        onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button 
                        className="bg-[var(--color-brand-black)] text-white hover:bg-gray-800 px-4 py-1.5 rounded-lg text-xs font-bold transition" 
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
            const url = `http://localhost:8000/api/v1/admin/deposits/${id}/${action}`;
            
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
                fetchDeposits(); // Refresh list, will also clear selected if it's gone
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

    if (loading) return <div className="animate-pulse font-bold text-gray-500">Loading pending requests...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Pending Deposits</h2>
                    <p className="text-gray-500 text-xs font-medium mt-1">{deposits.length} requests awaiting verification.</p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search reference or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Split View Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column: List of Deposits */}
                <div className="w-full lg:w-1/3 flex flex-col gap-3">
                    {filteredDeposits.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
                            <CheckCircle size={32} className="mx-auto text-green-500 mb-3" />
                            <p className="text-gray-900 font-bold text-sm">You're all caught up!</p>
                            <p className="text-gray-500 text-xs mt-1">No pending deposits.</p>
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
                                    ? 'bg-[var(--color-brand-black)] border-black text-white shadow-md transform scale-[1.02]' 
                                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1.5 rounded-md ${selectedDeposit?.id === d.id ? 'bg-gray-800 text-[var(--color-metallic-gold)]' : 'bg-orange-50 text-orange-600'}`}>
                                            <Clock size={14} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedDeposit?.id === d.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                            ID: #{d.id}
                                        </span>
                                    </div>
                                    <span className="font-black text-sm">
                                        PKR {parseFloat(d.amount).toLocaleString()}
                                    </span>
                                </div>
                                <h3 className={`font-bold text-sm truncate ${selectedDeposit?.id === d.id ? 'text-white' : 'text-gray-900'}`}>
                                    {d.user?.name || 'Unknown User'}
                                </h3>
                                <p className={`text-xs mt-1 truncate ${selectedDeposit?.id === d.id ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Ref: {d.reference}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Right Column: Deposit Details */}
                <div className="w-full lg:w-2/3 sticky top-6">
                    {selectedDeposit ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 flex items-center space-x-2">
                                    <FileText size={18} className="text-[var(--color-metallic-gold)]" />
                                    <span>Deposit Request details</span>
                                </h3>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap text-center">
                                    Pending Review
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requested Amount</p>
                                        <p className="text-4xl font-black text-[var(--color-rich-gold)]">PKR {parseFloat(selectedDeposit.amount).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-lg font-bold text-gray-900 capitalize">{selectedDeposit.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center space-x-1.5"><User size={12}/> <span>User</span></p>
                                            <p className="font-bold text-sm text-gray-900 mt-1">{selectedDeposit.user?.name}</p>
                                            <p className="text-xs text-gray-500">{selectedDeposit.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center space-x-1.5"><Calendar size={12}/> <span>Date Submitted</span></p>
                                            <p className="font-bold text-sm text-gray-900 mt-1">
                                                {new Date(selectedDeposit.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center space-x-1.5"><CreditCard size={12}/> <span>Payment Method</span></p>
                                            <p className="font-bold text-sm text-gray-900 mt-1 uppercase">{selectedDeposit.payment_method?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center space-x-1.5"><Hash size={12}/> <span>Transaction Reference</span></p>
                                            <p className="font-mono text-sm font-bold text-[var(--color-brand-black)] bg-gray-100 px-3 py-1.5 rounded inline-block mt-1">
                                                {selectedDeposit.reference || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedDeposit.proof && (
                                    <div className="mb-8">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center space-x-1.5"><FileText size={12}/> <span>Payment Receipt / Proof</span></p>
                                        <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl text-center">
                                            <a href={`http://localhost:8000/storage/${selectedDeposit.proof}`} target="_blank" rel="noreferrer" className="block max-h-64 overflow-hidden rounded-lg group relative">
                                                <img src={`http://localhost:8000/storage/${selectedDeposit.proof}`} alt="Proof" className="w-auto mx-auto max-h-64 object-contain transition group-hover:opacity-75" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg">Click to Enlarge</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {showRejectInput ? (
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
                                        <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Reason for Rejection</label>
                                        <textarea 
                                            rows={2}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Provide a reason to the user..."
                                            className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-400 outline-none text-sm mb-3 resize-none"
                                            autoFocus
                                        />
                                        <div className="flex space-x-2 justify-end">
                                            <button 
                                                onClick={() => setShowRejectInput(false)}
                                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-red-100 rounded-lg transition"
                                                disabled={actionLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleAction(selectedDeposit.id, 'reject')}
                                                disabled={actionLoading || !rejectReason.trim()}
                                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
                                            >
                                                <XCircle size={14} />
                                                <span>Confirm Rejection</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleAction(selectedDeposit.id, 'approve')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                                        >
                                            <CheckCircle size={18} />
                                            <span>Approve & Credit Wallet</span>
                                        </button>
                                        <button 
                                            onClick={() => handleAction(selectedDeposit.id, 'reject')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-white hover:bg-red-50 border-2 border-red-100 text-red-600 py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                                        >
                                            <XCircle size={18} />
                                            <span>Reject Deposit</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 h-64 flex flex-col items-center justify-center text-gray-400">
                            <FileText size={48} className="mb-4 text-gray-300" />
                            <p className="font-bold text-sm">Select a deposit request</p>
                            <p className="text-xs mt-1">Click a request from the left list to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
