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
    const [formData, setFormData] = useState({ id: null, name: '', description: '', status: 'active', total_points: 0 });
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
        setFormData({ id: null, name: '', description: '', status: 'active', total_points: 0 });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (cast: any) => {
        setModalMode('edit');
        setFormData({ id: cast.id, name: cast.name, description: cast.description || '', status: cast.status, total_points: cast.total_points });
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

    if (loading) return <div className="animate-pulse font-bold text-gray-500">Loading Casts...</div>;

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Manage Casts</h2>
                    <p className="text-gray-500 text-xs font-medium mt-1">Total {casts.length} active factions on the battlefield.</p>
                </div>
                
                <div className="flex w-full md:w-auto flex-col md:flex-row gap-3">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search casts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent transition"
                        />
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition shadow-sm flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Add Cast</span>
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            {filteredCasts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-sm font-bold">No casts found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCasts.map((cast: any) => (
                        <div key={cast.id} className="bg-white rounded-xl shadow-sm border border-[var(--color-border-gray)] p-4 hover:shadow-md transition relative flex flex-col">
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cast.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {cast.status}
                                </span>
                            </div>

                            <div className="mb-2 pr-14">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">ID: #{cast.id}</span>
                                <h3 className="text-lg font-black text-[var(--color-brand-black)] truncate">{cast.name}</h3>
                            </div>
                            
                            <div className="flex-1 text-xs text-gray-600 mb-4 font-medium line-clamp-2">
                                {cast.description || "No description provided."}
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Power</p>
                                    <p className="font-black text-sm text-[var(--color-rich-gold)]">{cast.total_points.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Warriors</p>
                                    <p className="font-black text-sm text-gray-800">{cast.contributors_count}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-auto border-t border-gray-100 pt-3">
                                <button 
                                    onClick={() => openEditModal(cast)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                                    title="Edit Cast"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => confirmDelete(cast.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">
                                {modalMode === 'create' ? 'Create New Cast' : 'Edit Cast details'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cast Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition text-sm font-medium"
                                        placeholder="e.g. Rajput"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea 
                                        rows={2}
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition text-sm font-medium resize-none"
                                        placeholder="Brief description of the cast..."
                                    />
                                </div>

                                {modalMode === 'edit' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                                            <select 
                                                value={formData.status}
                                                onChange={e => setFormData({...formData, status: e.target.value})}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] outline-none transition text-sm font-medium bg-white"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Power Points</label>
                                            <input 
                                                type="number" 
                                                value={formData.total_points}
                                                onChange={e => setFormData({...formData, total_points: parseInt(e.target.value) || 0})}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-transparent outline-none transition text-sm font-medium"
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
                                    className="px-4 py-2 font-bold text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] hover:bg-gray-800 rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
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
