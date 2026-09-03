'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Activity, Search, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import { API_URL, BASE_URL } from '@/lib/api';

export default function SecurityPage() {
    const [activeTab, setActiveTab] = useState<'risk' | 'audit'>('risk');
    
    // Risk Flags State
    const [riskFlags, setRiskFlags] = useState<any[]>([]);
    const [loadingRisk, setLoadingRisk] = useState(true);
    
    // Audit Logs State
    // Audit Logs State
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loadingAudit, setLoadingAudit] = useState(true);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [flagToResolve, setFlagToResolve] = useState<number | null>(null);

    const fetchRiskFlags = async () => {
        try {
            setLoadingRisk(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/security/risk-flags`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setRiskFlags(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch risk flags", error);
        } finally {
            setLoadingRisk(false);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            setLoadingAudit(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/security/audit-logs`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setAuditLogs(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoadingAudit(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'risk') fetchRiskFlags();
        if (activeTab === 'audit') fetchAuditLogs();
    }, [activeTab]);

    const confirmResolve = (id: number) => {
        setFlagToResolve(id);
        setModalOpen(true);
    };

    const resolveFlag = async () => {
        if (!flagToResolve) return;
        const id = flagToResolve;
        setModalOpen(false);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/security/risk-flags/${id}/resolve`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success('Risk flag resolved.');
                fetchRiskFlags(); // refresh list
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error occurred.');
        } finally {
            setFlagToResolve(null);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                        <ShieldCheck className="text-[var(--color-metallic-gold)]" size={24} />
                        <span>Security & Risk Center</span>
                    </h2>
                    <p className="text-gray-500 text-xs font-medium mt-1">Monitor automated fraud detection and administrative audit trails.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('risk')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${activeTab === 'risk' ? 'border-[var(--color-brand-black)] text-[var(--color-brand-black)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <AlertTriangle size={16} />
                    <span>Risk Flags</span>
                    {riskFlags.filter(f => f.status === 'open').length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {riskFlags.filter(f => f.status === 'open').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${activeTab === 'audit' ? 'border-[var(--color-brand-black)] text-[var(--color-brand-black)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Activity size={16} />
                    <span>Audit Logs</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                
                {/* RISK FLAGS TAB */}
                {activeTab === 'risk' && (
                    <div className="space-y-4">
                        {loadingRisk ? (
                            <div className="animate-pulse text-sm font-bold text-gray-500">Loading risk flags...</div>
                        ) : riskFlags.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <ShieldCheck size={48} className="mx-auto text-green-500 mb-3" />
                                <p className="text-gray-900 font-bold text-sm">System is secure</p>
                                <p className="text-gray-500 text-xs mt-1">No active risk flags detected.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {riskFlags.map((flag: any) => (
                                    <div key={flag.id} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${flag.status === 'open' ? 'border-red-200' : 'border-gray-200 opacity-60'}`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg ${flag.status === 'open' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${flag.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {flag.severity} RISK
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${flag.status === 'open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {flag.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-sm mt-2">{flag.reason}</h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Flagged User: <span className="font-bold text-gray-700">{flag.user?.name}</span> • {new Date(flag.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end justify-center min-w-[120px]">
                                            {flag.status === 'open' ? (
                                                <button 
                                                    onClick={() => confirmResolve(flag.id)}
                                                    className="bg-[var(--color-brand-black)] text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm w-full md:w-auto text-center"
                                                >
                                                    Mark Resolved
                                                </button>
                                            ) : (
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Resolved By</p>
                                                    <p className="text-xs font-bold text-gray-700">{flag.resolver?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(flag.resolved_at).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* AUDIT LOGS TAB */}
                {activeTab === 'audit' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {loadingAudit ? (
                            <div className="p-8 animate-pulse text-sm font-bold text-gray-500">Loading audit timeline...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Admin</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Details</th>
                                            <th className="px-6 py-4 hidden lg:table-cell">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {auditLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                                                    No audit logs found.
                                                </td>
                                            </tr>
                                        ) : (
                                            auditLogs.map((log: any) => (
                                                <tr key={log.id} className="hover:bg-gray-50/50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-900">{log.admin?.name || 'System'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                            {log.action.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell text-xs text-gray-600 font-mono">
                                                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell text-xs text-gray-400 font-mono">
                                                        {log.ip_address || '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title="Resolve Risk Flag"
                message="Are you sure you want to mark this flag as resolved?"
                confirmText="Mark Resolved"
                cancelText="Cancel"
                isDestructive={false}
                onConfirm={resolveFlag}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}
