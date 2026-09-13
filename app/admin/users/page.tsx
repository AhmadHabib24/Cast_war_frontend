'use client';

import { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle, Mail } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { API_URL, BASE_URL } from '@/lib/api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<{ id: number; currentStatus: string } | null>(null);
    const [sendingEmailId, setSendingEmailId] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const confirmToggleStatus = (id: number, currentStatus: string) => {
        setModalAction({ id, currentStatus });
        setModalOpen(true);
    };

    const toggleStatus = async () => {
        if (!modalAction) return;
        const { id, currentStatus } = modalAction;
        const action = currentStatus === 'active' ? 'suspend' : 'unsuspend';
        setModalOpen(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users/${id}/toggle-status`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`User ${action}ed successfully.`);
                fetchUsers(); // refresh list
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error occurred.");
        } finally {
            setModalAction(null);
        }
    };

    const handleSendCredentials = async (id: number) => {
        setSendingEmailId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users/${id}/send-credentials`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Credentials successfully sent to user email.');
            } else {
                toast.error(data.message || 'Failed to send credentials.');
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error occurred while sending credentials.");
        } finally {
            setSendingEmailId(null);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading Users...</div>;

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white">User Moderation</h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Total {users.length} users registered on the platform.</p>
                </div>
                
                <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-950 pl-9 pr-4 py-2 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-zinc-500"
                        />
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500 text-sm font-bold">No users found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUsers.map((user: any) => (
                        <div key={user.id} className="bg-zinc-900/50 rounded-xl shadow-sm border border-zinc-800 p-4 hover:border-zinc-700 transition relative flex flex-col">
                            
                            {/* Role Badge */}
                            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                                {user.is_guest ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/50 text-amber-400 border border-amber-900/50 shadow-sm shadow-amber-900/20">
                                        GUEST
                                    </span>
                                ) : null}
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-950/50 text-purple-400 border border-purple-900/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                    {user.role}
                                </span>
                            </div>

                            <div className="mb-2 pr-16">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">ID: #{user.id}</span>
                                <h3 className="text-lg font-black text-white truncate">{user.name}</h3>
                                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                            </div>
                            
                            <div className="flex-1"></div>

                            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex justify-between items-center mb-3 mt-4">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Wallet</p>
                                    <p className="font-black text-sm text-amber-500">
                                        PKR {user.wallet ? user.wallet.balance.toLocaleString() : '0'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Contributions</p>
                                    <p className="font-black text-sm text-white">{user.contributions_count || 0}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-auto border-t border-zinc-800 pt-3">
                                <div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-emerald-950/50 text-emerald-400' : 'bg-red-950/50 text-red-400'}`}>
                                        {user.status}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleSendCredentials(user.id)}
                                        disabled={sendingEmailId === user.id}
                                        className="p-1.5 rounded-md transition text-zinc-500 hover:text-blue-400 hover:bg-blue-950/30 disabled:opacity-50"
                                        title="Email Login Credentials"
                                    >
                                        {sendingEmailId === user.id ? (
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Mail size={16} />
                                        )}
                                    </button>

                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => confirmToggleStatus(user.id, user.status)}
                                            className={`p-1.5 rounded-md transition ${user.status === 'active' ? 'text-zinc-500 hover:text-red-500 hover:bg-red-950/30' : 'text-zinc-500 hover:text-emerald-500 hover:bg-emerald-950/30'}`}
                                            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                        >
                                            {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={modalOpen}
                title={`Confirm ${modalAction?.currentStatus === 'active' ? 'Suspension' : 'Unsuspend'}`}
                message={`Are you sure you want to ${modalAction?.currentStatus === 'active' ? 'suspend' : 'unsuspend'} this user?`}
                confirmText={modalAction?.currentStatus === 'active' ? 'Suspend' : 'Unsuspend'}
                cancelText="Cancel"
                isDestructive={modalAction?.currentStatus === 'active'}
                onConfirm={toggleStatus}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
