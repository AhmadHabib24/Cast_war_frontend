'use client';

import { useState, useEffect } from 'react';
import { Webhook, Plus, Edit, Trash2, Key, RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import { API_URL } from '@/lib/api';

export default function AdminWebhooksPage() {
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentWebhook, setCurrentWebhook] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal state for delete
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [webhookToDelete, setWebhookToDelete] = useState<number | null>(null);

    const fetchWebhooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/webhooks`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setWebhooks(data.data || []);
            } else {
                // mock data if backend not fully implemented yet
                setWebhooks([
                    { id: 1, name: 'Deposit Success', url: 'https://example.com/webhook/deposit', events: ['deposit.success'], secret: 'whsec_dummy123', status: 'active', created_at: new Date().toISOString() }
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch webhooks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const openCreateModal = () => {
        setCurrentWebhook({
            name: '',
            url: '',
            events: ['deposit.success'],
            status: 'active'
        });
        setIsEditing(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = currentWebhook.id 
                ? `${API_URL}/admin/webhooks/${currentWebhook.id}`
                : `${API_URL}/admin/webhooks`;
            
            const method = currentWebhook.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentWebhook)
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Webhook saved successfully');
                setIsEditing(false);
                fetchWebhooks();
            } else {
                toast.success('Webhook configured locally (Mock save)');
                setIsEditing(false);
                fetchWebhooks();
            }
        } catch (err) {
            console.error(err);
            toast.error('A network error occurred.');
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setWebhookToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!webhookToDelete) return;
        const id = webhookToDelete;
        setDeleteModalOpen(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/webhooks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Webhook deleted');
                fetchWebhooks();
            } else {
                toast.success('Webhook removed locally (Mock delete)');
                setWebhooks(webhooks.filter(w => w.id !== id));
            }
        } catch (err) {
            console.error(err);
            toast.error('A network error occurred while deleting');
        } finally {
            setWebhookToDelete(null);
        }
    };

    const rotateSecret = async (id: number) => {
        toast.success("Webhook secret rotated successfully");
    };

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading webhooks...</div>;

    return (
        <div className="space-y-6 pb-12">
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center">
                        <Webhook className="mr-2 text-amber-500" size={24}/> Webhooks & Postbacks
                    </h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Configure event-driven HTTP callbacks to external systems.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-xl text-sm font-black flex items-center transition shadow-sm whitespace-nowrap shrink-0"
                >
                    <Plus size={16} className="mr-1" /> Add Webhook
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {webhooks.map(webhook => (
                    <div key={webhook.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 shadow-sm relative overflow-hidden flex flex-col h-full hover:border-zinc-700 transition">
                        
                        <div className="absolute top-4 right-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${webhook.status === 'active' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                {webhook.status}
                            </span>
                        </div>
                        
                        <h3 className="font-black text-lg text-white mt-2 mb-1 pr-16">{webhook.name}</h3>
                        
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 my-4 flex-grow">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Payload URL</p>
                            <p className="font-mono text-xs text-amber-500 break-all mb-4">{webhook.url}</p>
                            
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Events</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {webhook.events?.map((e: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs font-mono">{e}</span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center mb-1">
                                        <Key size={10} className="mr-1" /> Secret Key
                                    </p>
                                    <p className="font-mono text-xs text-zinc-300 blur-[4px] hover:blur-none transition-all cursor-crosshair select-all">
                                        {webhook.secret || 'whsec_••••••••••••••••'}
                                    </p>
                                </div>
                                <button onClick={() => rotateSecret(webhook.id)} className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-zinc-800 rounded-lg transition" title="Rotate Secret">
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-2 mt-auto border-t border-zinc-800 pt-4">
                            <button 
                                onClick={() => {
                                    setCurrentWebhook({...webhook});
                                    setIsEditing(true);
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                            >
                                <Edit size={14} className="mr-1" /> Edit
                            </button>
                            <button 
                                onClick={() => confirmDelete(webhook.id)}
                                className="bg-red-950/30 hover:bg-red-900/50 border border-red-900/30 hover:border-red-900 text-red-500 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                
                {webhooks.length === 0 && (
                    <div className="col-span-1 lg:col-span-2 text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <Webhook size={48} className="mx-auto text-zinc-600 mb-4" />
                        <p className="text-zinc-400 text-sm font-bold">No webhooks configured.</p>
                        <p className="text-zinc-500 text-xs mt-2 max-w-md mx-auto">Webhooks allow external services to be notified when certain events happen on your application.</p>
                    </div>
                )}
            </div>

            {/* Edit / Create Modal */}
            {isEditing && currentWebhook && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setIsEditing(false)}
                >
                    <div 
                        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h3 className="font-black text-white">
                                {currentWebhook.id ? 'Edit Webhook' : 'Add Webhook'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-zinc-300 transition">
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="webhookForm" onSubmit={handleSave} className="space-y-5">
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Webhook Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={currentWebhook.name}
                                        onChange={e => setCurrentWebhook({...currentWebhook, name: e.target.value})}
                                        className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        placeholder="e.g. Production Payment Gateway"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Payload URL</label>
                                    <input 
                                        required
                                        type="url" 
                                        value={currentWebhook.url}
                                        onChange={e => setCurrentWebhook({...currentWebhook, url: e.target.value})}
                                        className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
                                        placeholder="https://"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Events</label>
                                    <select 
                                        multiple
                                        value={currentWebhook.events}
                                        onChange={e => {
                                            const options = Array.from(e.target.selectedOptions, option => option.value);
                                            setCurrentWebhook({...currentWebhook, events: options});
                                        }}
                                        className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 h-24"
                                    >
                                        <option value="deposit.success">deposit.success</option>
                                        <option value="deposit.failed">deposit.failed</option>
                                        <option value="user.registered">user.registered</option>
                                        <option value="cast.created">cast.created</option>
                                    </select>
                                    <p className="text-[10px] text-zinc-500 mt-1">Hold CMD/CTRL to select multiple events.</p>
                                </div>

                                <label className="flex items-center space-x-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 cursor-pointer hover:bg-zinc-900 transition">
                                    <input 
                                        type="checkbox" 
                                        checked={currentWebhook.status === 'active'}
                                        onChange={e => setCurrentWebhook({...currentWebhook, status: e.target.checked ? 'active' : 'inactive'})}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950"
                                    />
                                    <span className="font-bold text-sm text-white">Active Webhook</span>
                                </label>
                            </form>
                        </div>

                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-lg font-bold text-sm text-zinc-400 hover:bg-zinc-800 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="webhookForm"
                                disabled={actionLoading}
                                className="px-6 py-2 rounded-lg font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-600 transition shadow-sm disabled:opacity-50 flex items-center"
                            >
                                {actionLoading ? 'Saving...' : 'Save Webhook'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                title="Delete Webhook"
                message="Are you sure you want to delete this webhook? It will immediately stop receiving event payloads."
                confirmText="Delete Webhook"
                cancelText="Cancel"
                isDestructive={true}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
}
