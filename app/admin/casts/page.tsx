'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, Search } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import { toast } from 'react-hot-toast';
import { API_URL, BASE_URL } from '@/lib/api';

export default function AdminCastsPage() {
    const [casts, setCasts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState({ id: null, name: '', urdu_name: '', description: '', status: 'active', total_points: 0 });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [castToDelete, setCastToDelete] = useState<number | null>(null);

    const fetchCasts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/casts`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setCasts(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch casts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCasts();
    }, []);

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ id: null, name: '', urdu_name: '', description: '', status: 'active', total_points: 0 });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (cast: any) => {
        setModalMode('edit');
        setFormData({ id: cast.id, name: cast.name, urdu_name: cast.urdu_name || '', description: cast.description || '', status: cast.status, total_points: cast.total_points });
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        const url = modalMode === 'create' 
            ? `${API_URL}/admin/casts` 
            : `${API_URL}/admin/casts/${formData.id}`;
        
        const method = modalMode === 'create' ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                closeModal();
                fetchCasts();
            } else {
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('A network error occurred.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setCastToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!castToDelete) return;
        const id = castToDelete;
        setDeleteModalOpen(false);
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/casts/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Cast deleted successfully.');
                fetchCasts();
            } else {
                toast.error(data.message || 'Failed to delete cast.');
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error occurred.");
        } finally {
            setCastToDelete(null);
        }
    };

    const filteredCasts = casts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading Casts...</div>;

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white">Manage Casts</h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Total {casts.length} active factions on the battlefield.</p>
                </div>
                
                <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-zinc-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search casts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-950 pl-9 pr-4 py-2 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder-zinc-500"
                        />
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="bg-amber-500 text-zinc-950 px-4 py-2 rounded-lg font-black text-sm hover:bg-amber-600 transition shadow-sm flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Add Cast</span>
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            {filteredCasts.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500 text-sm font-bold">No casts found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCasts.map((cast: any) => (
                        <div key={cast.id} className="bg-zinc-900/50 rounded-xl shadow-sm border border-zinc-800 p-4 hover:border-zinc-700 transition relative flex flex-col">
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cast.status === 'active' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-red-950/50 text-red-400 border border-red-900/50'}`}>
                                    {cast.status}
                                </span>
                            </div>

                            <div className="mb-2 pr-14">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">ID: #{cast.id}</span>
                                <h3 className="text-lg font-black text-white truncate">{cast.name} {cast.urdu_name && <span className="text-amber-500 text-sm ml-1 font-normal">({cast.urdu_name})</span>}</h3>
                            </div>
                            
                            <div className="flex-1 text-xs text-zinc-400 mb-4 font-medium line-clamp-2">
                                {cast.description || "No description provided."}
                            </div>

                            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Power</p>
                                    <p className="font-black text-sm text-amber-500">{cast.total_points.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Warriors</p>
                                    <p className="font-black text-sm text-white">{cast.contributors_count}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-auto border-t border-zinc-800 pt-3">
                                <button 
                                    onClick={() => openEditModal(cast)}
                                    className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-md transition"
                                    title="Edit Cast"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => confirmDelete(cast.id)}
                                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-950/30 rounded-md transition"
                                    title="Delete Cast"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h3 className="text-lg font-black text-white">
                                {modalMode === 'create' ? 'Create New Cast' : 'Edit Cast details'}
                            </h3>
                            <button onClick={closeModal} className="text-zinc-500 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-950/20 text-red-400 p-3 rounded-lg text-sm font-bold text-center border border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Cast Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm font-medium placeholder-zinc-600"
                                        placeholder="e.g. Rajput"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Urdu Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.urdu_name}
                                        onChange={e => setFormData({...formData, urdu_name: e.target.value})}
                                        className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm font-medium placeholder-zinc-600 text-right"
                                        placeholder="e.g. راجپوت"
                                        dir="rtl"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea 
                                        rows={2}
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm font-medium resize-none placeholder-zinc-600"
                                        placeholder="Brief description of the cast..."
                                    />
                                </div>

                                {modalMode === 'edit' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Status</label>
                                            <select 
                                                value={formData.status}
                                                onChange={e => setFormData({...formData, status: e.target.value})}
                                                className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm font-medium"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Power Points</label>
                                            <input 
                                                type="number" 
                                                value={formData.total_points}
                                                onChange={e => setFormData({...formData, total_points: parseInt(e.target.value) || 0})}
                                                className="w-full bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm font-medium"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 font-bold text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-amber-500 text-zinc-950 hover:bg-amber-600 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                                >
                                    {submitLoading ? 'Saving...' : (modalMode === 'create' ? 'Create Cast' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Delete Cast"
                message="Are you sure you want to delete this cast? This cannot be undone."
                confirmText="Delete Cast"
                cancelText="Cancel"
                isDestructive={true}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
}
