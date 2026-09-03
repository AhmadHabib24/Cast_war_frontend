'use client';

import { useState, useEffect, useRef } from 'react';
import {  fetchApi , API_URL, BASE_URL } from '@/lib/api';
import { Upload, CheckSquare, Square, FileText, Image as ImageIcon, Plus, Wallet, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Hash, Calendar, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepositDashboardPage() {
    // --- Dashboard State ---
    const [wallet, setWallet] = useState<any>(null);
    const [deposits, setDeposits] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // --- Modal & Form State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [amount, setAmount] = useState('1000');
    const [methods, setMethods] = useState<any[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [reference, setReference] = useState('');
    
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [loadingMethods, setLoadingMethods] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // --- Data Fetching ---
    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [walletRes, depositsRes] = await Promise.all([
                fetch(`${API_URL}/wallet`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                }),
                fetch(`${API_URL}/deposits`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                })
            ]);
            
            const walletData = await walletRes.json();
            const depositsData = await depositsRes.json();

            if (walletData.success) setWallet(walletData.data.wallet);
            if (depositsData.success) setDeposits(depositsData.data);
            
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoadingData(false);
        }
    };

    const loadMethods = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setMethods(data.data);
                setSelectedMethodId(data.data[0].id);
            }
        } catch (err) {
            console.error('Failed to load payment methods', err);
        } finally {
            setLoadingMethods(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        loadMethods();
    }, []);

    const selectedMethod = methods.find(m => m.id === selectedMethodId);

    // --- Calculations ---
    const totalDeposited = deposits
        .filter(d => d.status === 'approved' || d.status === 'completed')
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);
        
    const totalPending = deposits
        .filter(d => d.status === 'pending')
        .reduce((sum, d) => sum + parseFloat(d.amount), 0);

    // --- Form Handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setAmount('1000');
        setReference('');
        setProofFile(null);
        setProofPreview(null);
        setTermsAccepted(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedMethod) { toast.error('Please select a payment method.'); return; }
        if (!proofFile) { toast.error('Please upload a screenshot/proof of the transaction.'); return; }
        if (!termsAccepted) { toast.error('You must agree to the terms and conditions.'); return; }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('payment_method', selectedMethod.name);
        formData.append('reference', reference);
        formData.append('proof', proofFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/deposits`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'Deposit request submitted successfully!');
                resetForm();
                loadDashboardData(); // Refresh list immediately
                setTimeout(() => {
                    setIsModalOpen(false);
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to submit deposit request');
                if (data.errors) {
                    const errorMsgs = Object.values(data.errors).flat().join(' ');
                    toast.error(errorMsgs);
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'A network error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) {
        return <div className="animate-pulse font-bold text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6 pb-12">
            
            {/* Header & Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-4">
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
                        <Wallet className="text-[var(--color-metallic-gold)]" size={20} />
                        <span>Wallet & Deposits</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage your funds, track requests, and recharge your balance.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] px-4 py-2 rounded-lg font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center space-x-2 whitespace-nowrap"
                >
                    <Plus size={14} />
                    <span>Add Funds</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 mb-1">
                            <ArrowUpRight size={12} className="text-green-500"/> <span>Total Deposited</span>
                        </p>
                        <h3 className="text-2xl font-black text-gray-900">PKR {totalDeposited.toLocaleString()}</h3>
                        <p className="text-[10px] text-gray-500 mt-1">Lifetime approved funds</p>
                    </div>
                </div>

                <div className="bg-[var(--color-brand-black)] p-4 rounded-xl shadow-md relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 mb-1">
                            <Wallet size={12} className="text-[var(--color-metallic-gold)]"/> <span>Current Balance</span>
                        </p>
                        <h3 className="text-2xl font-black text-[var(--color-metallic-gold)]">PKR {parseFloat(wallet?.balance || 0).toLocaleString()}</h3>
                        <p className="text-[10px] text-gray-400 mt-1">Available for purchasing points</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-50 rounded-full group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 mb-1">
                            <Clock size={12} className="text-orange-500"/> <span>Pending Approval</span>
                        </p>
                        <h3 className="text-2xl font-black text-gray-900">PKR {totalPending.toLocaleString()}</h3>
                        <p className="text-[10px] text-gray-500 mt-1">Currently under review by Admin</p>
                    </div>
                </div>
            </div>

            {/* Deposit History Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider">Deposit Request History</h3>
                </div>
                
                {deposits.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FileText size={24} className="text-gray-400" />
                        </div>
                        <p className="font-bold text-gray-900 mb-1">No deposit requests yet</p>
                        <p className="text-[10px] text-gray-500 mb-6">Your deposit history will appear here once you add funds.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                        >
                            Make your first deposit
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">ID / Reference</th>
                                    <th className="px-5 py-3">Method</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-900">
                                {deposits.map(d => (
                                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <p className="font-bold text-xs">#{d.id}</p>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{d.reference}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-gray-100 text-[9px] font-bold uppercase tracking-wider">
                                                {d.payment_method.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-black text-sm">
                                            PKR {parseFloat(d.amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-[10px] text-gray-500 whitespace-nowrap">
                                            {new Date(d.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {d.status === 'pending' && <span className="inline-flex items-center space-x-1 text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase"><Clock size={10}/><span>Pending</span></span>}
                                            {d.status === 'approved' || d.status === 'completed' ? <span className="inline-flex items-center space-x-1 text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase"><CheckCircle size={10}/><span>Approved</span></span> : null}
                                            {d.status === 'rejected' && <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase"><XCircle size={10}/><span>Rejected</span></span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- ADD FUNDS MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in relative border border-gray-200">
                        
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-black text-gray-900 text-lg flex items-center">
                                    <Wallet size={18} className="mr-2 text-[var(--color-metallic-gold)]" />
                                    Add Funds
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Secure Deposit Request</p>
                            </div>
                            <button 
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">

                            <form id="depositForm" onSubmit={handleSubmit} className="space-y-5">
                                
                                {/* Amount */}
                                <div>
                                    <label className="block text-[10px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-1.5">Deposit Amount (PKR)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">Rs.</span>
                                        <input
                                            type="number"
                                            min="100"
                                            required
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] focus:border-[var(--color-metallic-gold)] outline-none transition-all text-sm font-black text-gray-900 bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                {loadingMethods ? (
                                    <div className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>
                                ) : methods.length > 0 ? (
                                    <div>
                                        <label className="block text-[10px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-1.5">Select Method</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {methods.map((m) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    onClick={() => setSelectedMethodId(m.id)}
                                                    className={`py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all ${
                                                        selectedMethodId === m.id 
                                                        ? 'border-[var(--color-brand-black)] bg-[var(--color-brand-black)] text-white shadow-sm' 
                                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {m.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 text-orange-800 p-3 rounded-lg font-bold text-xs">
                                        No payment methods available.
                                    </div>
                                )}

                                {/* Instructions */}
                                {selectedMethod && (
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <p className="text-[10px] text-gray-600 leading-snug">
                                            Transfer exactly <strong className="text-gray-900 bg-white px-1 border border-gray-200 rounded">Rs. {amount || '0'}</strong> to:
                                        </p>
                                        
                                        <div className="mt-2 flex items-start justify-between gap-3 bg-white p-2 rounded border border-gray-100 shadow-sm">
                                            <div>
                                                {selectedMethod.type === 'bank' && (
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase">{selectedMethod.bank_name}</p>
                                                )}
                                                <p className="font-mono text-sm font-black tracking-wider text-[var(--color-brand-black)] leading-tight">
                                                    {selectedMethod.account_number}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                                                    {selectedMethod.account_title}
                                                </p>
                                            </div>

                                            {selectedMethod.qr_code_path && (
                                                <div className="flex-shrink-0 bg-gray-50 p-1 rounded border border-gray-100 text-center">
                                                    <img 
                                                        src={`${BASE_URL}/storage/${selectedMethod.qr_code_path}`} 
                                                        alt="QR" 
                                                        className="w-12 h-12 object-contain mx-auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Proof Upload */}
                                <div>
                                    <label className="block text-[10px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-1.5">Payment Receipt (Snap)</label>
                                    <div className={`border border-dashed rounded-lg p-3 transition-all ${
                                        proofPreview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {proofPreview ? (
                                                    <img src={proofPreview} alt="Preview" className="h-10 w-10 object-cover rounded shadow-sm border border-black/10" />
                                                ) : (
                                                    <div className="bg-gray-200 p-2 rounded text-gray-400">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700">{proofFile ? proofFile.name : 'Upload Screenshot'}</p>
                                                    <p className="text-[9px] text-gray-500 uppercase font-medium mt-0.5">Max 5MB (JPG, PNG)</p>
                                                </div>
                                            </div>
                                            <label className="cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-gray-50 transition shadow-sm">
                                                Browse
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction ID */}
                                <div>
                                    <label className="block text-[10px] font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-1.5">Transaction Reference (Optional)</label>
                                    <input
                                        type="text"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-metallic-gold)] outline-none transition-all font-mono text-gray-900 text-xs bg-gray-50"
                                        placeholder="e.g. TID123456789"
                                    />
                                </div>

                                {/* Terms */}
                                <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100 flex items-start space-x-2 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                                    <div className="mt-0.5">
                                        {termsAccepted ? (
                                            <CheckSquare size={14} className="text-orange-600" />
                                        ) : (
                                            <Square size={14} className="text-orange-300" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-orange-800 leading-snug font-medium select-none">
                                        I verify this transfer is complete and accurate. Submitting false receipts will result in an immediate account ban.
                                    </p>
                                </div>

                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="px-4 py-2 rounded-lg font-bold text-xs text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="depositForm"
                                disabled={submitting || methods.length === 0}
                                className="px-6 py-2 rounded-lg font-black text-xs bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] hover:bg-gray-800 transition shadow-md disabled:opacity-50 flex items-center space-x-2"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                <span>Submit Request</span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
