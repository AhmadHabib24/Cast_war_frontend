'use client';

import { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<{ id: number; currentStatus: string } | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/v1/admin/users', {
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
            const res = await fetch(`http://localhost:8000/api/v1/admin/users/${id}/toggle-status`, { 
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

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="animate-pulse font-bold text-gray-500">Loading Users...</div>;

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900">User Moderation</h2>
                    <p className="text-gray-500 text-xs font-medium mt-1">Total {users.length} users registered on the platform.</p>
                </div>
                
                <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent transition"
                        />
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold">No users found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUsers.map((user: any) => (
                        <div key={user.id} className="bg-white rounded-xl shadow-sm border border-[var(--color-border-gray)] p-4 hover:shadow-md transition relative flex flex-col">
                            
                            {/* Role Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {user.role}
                                </span>
                            </div>

                            <div className="mb-2 pr-16">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">ID: #{user.id}</span>
                                <h3 className="text-lg font-black text-[var(--color-brand-black)] truncate">{user.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            
                            <div className="flex-1"></div>

                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-3 mt-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Wallet</p>
                                    <p className="font-black text-sm text-[var(--color-rich-gold)]">
                                        PKR {user.wallet ? user.wallet.balance.toLocaleString() : '0'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Contributions</p>
                                    <p className="font-black text-sm text-gray-800">{user.contributions_count || 0}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-3">
                                <div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {user.status}
                                    </span>
                                </div>
                                
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => confirmToggleStatus(user.id, user.status)}
                                        className={`p-1.5 rounded-md transition ${user.status === 'active' ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                                    >
                                        {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                    </button>
                                )}
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
