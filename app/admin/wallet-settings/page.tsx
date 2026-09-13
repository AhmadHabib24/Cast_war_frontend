'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi, API_URL, BASE_URL } from '@/lib/api';
import { Settings, Plus, Edit, Trash2, CheckCircle, XCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminWalletSettingsPage() {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [qrPreview, setQrPreview] = useState<string | null>(null);

    const fetchMethods = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setMethods(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch methods", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, []);

    const openCreateModal = () => {
        setCurrentMethod({
            name: '',
            type: 'wallet',
            account_title: '',
            account_number: '',
            bank_name: '',
            is_active: true
        });
        setQrFile(null);
        setQrPreview(null);
        setIsEditing(true);
    };

    const openEditModal = (method: any) => {
        setCurrentMethod({ ...method });
        setQrFile(null);
        setQrPreview(method.qr_code_path ? `${BASE_URL}/storage/${method.qr_code_path}` : null);
        setIsEditing(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setQrFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);

        const formData = new FormData();
        formData.append('name', currentMethod.name);
        formData.append('type', currentMethod.type);
        formData.append('account_title', currentMethod.account_title);
        formData.append('account_number', currentMethod.account_number);
        formData.append('is_active', currentMethod.is_active ? '1' : '0');
        if (currentMethod.type === 'bank' && currentMethod.bank_name) {
            formData.append('bank_name', currentMethod.bank_name);
        }
        if (qrFile) {
            formData.append('qr_code', qrFile);
        }

        try {
            const token = localStorage.getItem('token');
            const url = currentMethod.id 
                ? `${API_URL}/admin/payment-methods/${currentMethod.id}`
                : `${API_URL}/admin/payment-methods`;
            
            // For Laravel PUT with FormData, we use POST and append _method=PUT
            if (currentMethod.id) {
                formData.append('_method', 'PUT');
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Payment method saved successfully');
                setIsEditing(false);
                fetchMethods();
            } else {
                toast.error(data.message || 'Error saving payment method');
            }
        } catch (err) {
            console.error(err);
            toast.error('A network error occurred.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        toast((t) => (
            <div>
                <p className="font-bold mb-3 text-sm text-zinc-800 tracking-wide">Delete this payment method?</p>
                <div className="flex gap-2 justify-end">
                    <button 
                        className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 px-4 py-1.5 rounded-lg text-xs font-bold transition" 
                        onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button 
                        className="bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm" 
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeDelete(id);
                        }}>
                        Yes, delete
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const executeDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/payment-methods/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Payment method deleted');
                fetchMethods();
            } else {
                toast.error('Failed to delete payment method');
            }
        } catch (err) {
            console.error(err);
            toast.error('A network error occurred while deleting');
        }
    };

    if (loading) return <div className="animate-pulse font-bold text-zinc-500">Loading wallet settings...</div>;

    return (
        <div className="space-y-6 pb-12">
            
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center">
                        <Settings className="mr-2 text-amber-500" size={24}/> Wallet Settings
                    </h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Manage accepted payment methods for user deposits.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-xl text-sm font-black flex items-center transition shadow-sm whitespace-nowrap shrink-0"
                >
                    <Plus size={16} className="mr-1" /> Add Method
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methods.map(method => (
                    <div key={method.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 shadow-sm relative overflow-hidden flex flex-col h-full hover:border-zinc-700 transition">
                        {!method.is_active && (
                            <div className="absolute top-0 right-0 bg-red-950/50 text-red-400 border-b border-l border-red-900/50 px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase tracking-wider">
                                Inactive
                            </div>
                        )}
                        {method.is_active && (
                            <div className="absolute top-0 right-0 bg-emerald-950/50 text-emerald-400 border-b border-l border-emerald-900/50 px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase tracking-wider">
                                Active
                            </div>
                        )}
                        
                        <h3 className="font-black text-lg text-white mt-2 mb-1">{method.name}</h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                            {method.type === 'bank' ? method.bank_name : 'Digital Wallet'}
                        </p>
                        
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4 flex-grow">
                            <p className="text-xs text-zinc-500 mb-1">Account Title</p>
                            <p className="font-bold text-sm text-white truncate">{method.account_title}</p>
                            
                            <p className="text-xs text-zinc-500 mt-3 mb-1">Account Number</p>
                            <p className="font-bold text-sm text-amber-500 tracking-wide">{method.account_number}</p>
                        </div>
                        
                        {method.qr_code_path && (
                            <div className="mb-4">
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center">
                                    <ImageIcon size={12} className="mr-1"/> QR Code attached
                                </span>
                            </div>
                        )}

                        <div className="flex space-x-2 mt-auto border-t border-zinc-800 pt-4">
                            <button 
                                onClick={() => openEditModal(method)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                            >
                                <Edit size={14} className="mr-1" /> Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(method.id)}
                                className="bg-red-950/30 hover:bg-red-900/50 border border-red-900/30 hover:border-red-900 text-red-500 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit / Create Modal */}
            {isEditing && currentMethod && (
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
                                {currentMethod.id ? 'Edit Payment Method' : 'Add Payment Method'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-zinc-300 transition">
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="methodForm" onSubmit={handleSave} className="space-y-5">
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Name (e.g. Easypaisa)</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={currentMethod.name}
                                            onChange={e => setCurrentMethod({...currentMethod, name: e.target.value})}
                                            className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Type</label>
                                        <select 
                                            value={currentMethod.type}
                                            onChange={e => setCurrentMethod({...currentMethod, type: e.target.value})}
                                            className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        >
                                            <option value="wallet">Mobile Wallet</option>
                                            <option value="bank">Bank Transfer</option>
                                        </select>
                                    </div>
                                </div>

                                {currentMethod.type === 'bank' && (
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Bank Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={currentMethod.bank_name || ''}
                                            onChange={e => setCurrentMethod({...currentMethod, bank_name: e.target.value})}
                                            className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Account Title / Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={currentMethod.account_title}
                                        onChange={e => setCurrentMethod({...currentMethod, account_title: e.target.value})}
                                        className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Account Number / IBAN</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={currentMethod.account_number}
                                        onChange={e => setCurrentMethod({...currentMethod, account_number: e.target.value})}
                                        className="w-full bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">QR Code Image (Optional)</label>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 cursor-pointer"
                                    />
                                    {qrPreview && (
                                        <div className="mt-3 relative w-32 h-32 border border-dashed border-zinc-700 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900/50">
                                            <img src={qrPreview} alt="QR Code Preview" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-center space-x-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 cursor-pointer hover:bg-zinc-900 transition">
                                    <input 
                                        type="checkbox" 
                                        checked={currentMethod.is_active}
                                        onChange={e => setCurrentMethod({...currentMethod, is_active: e.target.checked})}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-950"
                                    />
                                    <span className="font-bold text-sm text-white">Active</span>
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
                                form="methodForm"
                                disabled={actionLoading}
                                className="px-6 py-2 rounded-lg font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-600 transition shadow-sm disabled:opacity-50 flex items-center"
                            >
                                {actionLoading && <Loader2 size={16} className="animate-spin mr-2"/>}
                                Save Method
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
