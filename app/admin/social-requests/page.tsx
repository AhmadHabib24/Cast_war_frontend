'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Link as LinkIcon, User, Clock, AlertCircle } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { API_URL, BASE_URL } from '@/lib/api';

export default function AdminSocialRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
    const [modalRequestId, setModalRequestId] = useState<number | null>(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/social-requests`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
                if (selectedRequest && !data.data.find((r: any) => r.id === selectedRequest.id)) {
                    setSelectedRequest(null);
                }
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const confirmAction = (id: number, action: 'approve' | 'reject') => {
        setModalAction(action);
        setModalRequestId(id);
        setModalOpen(true);
    };

    const handleAction = async () => {
        if (!modalAction || !modalRequestId) return;
        
        const action = modalAction;
        const id = modalRequestId;
        
        setModalOpen(false);

        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `${API_URL}/admin/social-requests/${id}/${action}`;
            
            const res = await fetch(url, { 
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success(`Social request ${action}d successfully.`);
                fetchRequests();
            } else {
                toast.error(data.message || `Failed to ${action} request.`);
            }
        } catch (err) {
            console.error(err);
            toast.error("A network error occurred.");
        } finally {
            setActionLoading(false);
            setModalAction(null);
            setModalRequestId(null);
        }
    };

    const filteredRequests = requests.filter(r => 
        r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading pending requests...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white">Social Connection Requests</h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">{requests.length} profile updates awaiting review.</p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 pl-9 pr-4 py-2 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-zinc-500"
                    />
                </div>
            </div>

            {/* Split View Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column: List */}
                <div className="w-full lg:w-1/3 flex flex-col gap-3">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 text-center shadow-sm">
                            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-3" />
                            <p className="text-white font-bold text-sm">All Caught Up!</p>
                            <p className="text-zinc-400 text-xs mt-1">No pending social link requests.</p>
                        </div>
                    ) : (
                        filteredRequests.map(r => (
                            <button 
                                key={r.id}
                                onClick={() => setSelectedRequest(r)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                    selectedRequest?.id === r.id 
                                    ? 'bg-zinc-900 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.1)] transform scale-[1.02]' 
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1.5 rounded-md ${selectedRequest?.id === r.id ? 'bg-amber-500/20 text-amber-500' : 'bg-orange-500/10 text-orange-400'}`}>
                                            <AlertCircle size={14} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedRequest?.id === r.id ? 'text-amber-500/70' : 'text-zinc-500'}`}>
                                            Profile #{r.id}
                                        </span>
                                    </div>
                                </div>
                                <h3 className={`font-bold text-sm truncate ${selectedRequest?.id === r.id ? 'text-white' : 'text-zinc-100'}`}>
                                    {r.user?.name || 'Unknown User'}
                                </h3>
                                <p className={`text-xs mt-1 truncate ${selectedRequest?.id === r.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {r.user?.email}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-2/3 lg:sticky lg:top-6">
                    {selectedRequest ? (
                        <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden animate-fade-in">
                            <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                                <h3 className="font-black text-white flex items-center space-x-2">
                                    <LinkIcon size={18} className="text-amber-500" />
                                    <span>Review Social Links</span>
                                </h3>
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap text-center">
                                    Pending Review
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-zinc-800">
                                    <div className="p-4 bg-zinc-950 rounded-full text-zinc-500 border border-zinc-800">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{selectedRequest.user?.name}</h3>
                                        <p className="text-sm text-zinc-400">{selectedRequest.user?.email}</p>
                                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">
                                            Display Name: {selectedRequest.display_name || selectedRequest.user?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Requested Instagram URL</p>
                                        {selectedRequest.pending_instagram_url ? (
                                            <a href={selectedRequest.pending_instagram_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline break-all">
                                                {selectedRequest.pending_instagram_url}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-zinc-500 italic">No change requested</p>
                                        )}
                                        {selectedRequest.instagram_url && (
                                            <p className="text-xs text-zinc-400 mt-2">
                                                Current Active: <a href={selectedRequest.instagram_url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">{selectedRequest.instagram_url}</a>
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Requested Facebook URL</p>
                                        {selectedRequest.pending_facebook_url ? (
                                            <a href={selectedRequest.pending_facebook_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline break-all">
                                                {selectedRequest.pending_facebook_url}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-zinc-500 italic">No change requested</p>
                                        )}
                                        {selectedRequest.facebook_url && (
                                            <p className="text-xs text-zinc-400 mt-2">
                                                Current Active: <a href={selectedRequest.facebook_url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">{selectedRequest.facebook_url}</a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                                    <button 
                                        onClick={() => confirmAction(selectedRequest.id, 'approve')}
                                        disabled={actionLoading}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
                                    >
                                        <CheckCircle size={18} />
                                        <span>Approve Links</span>
                                    </button>
                                    <button 
                                        onClick={() => confirmAction(selectedRequest.id, 'reject')}
                                        disabled={actionLoading}
                                        className="flex-1 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 hover:text-red-500 text-zinc-300 py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
                                    >
                                        <XCircle size={18} />
                                        <span>Reject Links</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 h-64 flex flex-col items-center justify-center text-zinc-500">
                            <LinkIcon size={48} className="mb-4 text-zinc-700" />
                            <p className="font-bold text-sm text-zinc-400">Select a pending request</p>
                            <p className="text-xs mt-1">Click a user profile from the list to review links.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title={`Confirm ${modalAction === 'approve' ? 'Approval' : 'Rejection'}`}
                message={`Are you sure you want to ${modalAction} these social links?`}
                confirmText={modalAction === 'approve' ? 'Approve' : 'Reject'}
                cancelText="Cancel"
                isDestructive={modalAction === 'reject'}
                onConfirm={handleAction}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
