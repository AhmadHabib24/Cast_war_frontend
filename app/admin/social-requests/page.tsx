'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Link as LinkIcon, User, Clock, AlertCircle } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'react-hot-toast';

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
            const res = await fetch('http://localhost:8000/api/v1/admin/social-requests', {
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
            const url = `http://localhost:8000/api/v1/admin/social-requests/${id}/${action}`;
            
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

    if (loading) return <div className="animate-pulse font-bold text-gray-500">Loading pending requests...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Social Connection Requests</h2>
                    <p className="text-gray-500 text-xs font-medium mt-1">{requests.length} profile updates awaiting review.</p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Split View Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Column: List */}
                <div className="w-full lg:w-1/3 flex flex-col gap-3">
                    {filteredRequests.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
                            <CheckCircle size={32} className="mx-auto text-green-500 mb-3" />
                            <p className="text-gray-900 font-bold text-sm">All Caught Up!</p>
                            <p className="text-gray-500 text-xs mt-1">No pending social link requests.</p>
                        </div>
                    ) : (
                        filteredRequests.map(r => (
                            <button 
                                key={r.id}
                                onClick={() => setSelectedRequest(r)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                    selectedRequest?.id === r.id 
                                    ? 'bg-[var(--color-brand-black)] border-black text-white shadow-md transform scale-[1.02]' 
                                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`p-1.5 rounded-md ${selectedRequest?.id === r.id ? 'bg-gray-800 text-[var(--color-metallic-gold)]' : 'bg-orange-50 text-orange-600'}`}>
                                            <AlertCircle size={14} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedRequest?.id === r.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                            Profile #{r.id}
                                        </span>
                                    </div>
                                </div>
                                <h3 className={`font-bold text-sm truncate ${selectedRequest?.id === r.id ? 'text-white' : 'text-gray-900'}`}>
                                    {r.user?.name || 'Unknown User'}
                                </h3>
                                <p className={`text-xs mt-1 truncate ${selectedRequest?.id === r.id ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {r.user?.email}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="w-full lg:w-2/3 lg:sticky lg:top-6">
                    {selectedRequest ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 flex items-center space-x-2">
                                    <LinkIcon size={18} className="text-[var(--color-metallic-gold)]" />
                                    <span>Review Social Links</span>
                                </h3>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap text-center">
                                    Pending Review
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                                    <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{selectedRequest.user?.name}</h3>
                                        <p className="text-sm text-gray-500">{selectedRequest.user?.email}</p>
                                        <p className="text-xs font-bold text-[var(--color-metallic-gold)] uppercase tracking-wider mt-1">
                                            Display Name: {selectedRequest.display_name || selectedRequest.user?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Requested Instagram URL</p>
                                        {selectedRequest.pending_instagram_url ? (
                                            <a href={selectedRequest.pending_instagram_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-all">
                                                {selectedRequest.pending_instagram_url}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No change requested</p>
                                        )}
                                        {selectedRequest.instagram_url && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Current Active: <a href={selectedRequest.instagram_url} target="_blank" rel="noreferrer" className="text-[var(--color-metallic-gold)] hover:underline">{selectedRequest.instagram_url}</a>
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Requested Facebook URL</p>
                                        {selectedRequest.pending_facebook_url ? (
                                            <a href={selectedRequest.pending_facebook_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-all">
                                                {selectedRequest.pending_facebook_url}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No change requested</p>
                                        )}
                                        {selectedRequest.facebook_url && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Current Active: <a href={selectedRequest.facebook_url} target="_blank" rel="noreferrer" className="text-[var(--color-metallic-gold)] hover:underline">{selectedRequest.facebook_url}</a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={() => confirmAction(selectedRequest.id, 'approve')}
                                        disabled={actionLoading}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
                                    >
                                        <CheckCircle size={18} />
                                        <span>Approve Links</span>
                                    </button>
                                    <button 
                                        onClick={() => confirmAction(selectedRequest.id, 'reject')}
                                        disabled={actionLoading}
                                        className="flex-1 bg-white hover:bg-red-50 border-2 border-red-100 text-red-600 py-3 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
                                    >
                                        <XCircle size={18} />
                                        <span>Reject Links</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 h-64 flex flex-col items-center justify-center text-gray-400">
                            <LinkIcon size={48} className="mb-4 text-gray-300" />
                            <p className="font-bold text-sm">Select a pending request</p>
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
