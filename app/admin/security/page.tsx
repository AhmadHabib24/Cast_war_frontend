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
            <div className="bg-zinc-900/50 p-5 rounded-2xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center space-x-2">
                        <ShieldCheck className="text-amber-500" size={24} />
                        <span>Security & Risk Center</span>
                    </h2>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Monitor automated fraud detection and administrative audit trails.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab('risk')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${activeTab === 'risk' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    <AlertTriangle size={16} />
                    <span>Risk Flags</span>
                    {riskFlags.filter(f => f.status === 'open').length > 0 && (
                        <span className="bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {riskFlags.filter(f => f.status === 'open').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${activeTab === 'audit' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
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
                            <div className="animate-pulse text-sm font-bold text-zinc-500">Loading risk flags...</div>
                        ) : riskFlags.length === 0 ? (
                            <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-sm">
                                <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-3" />
                                <p className="text-white font-bold text-sm">System is secure</p>
                                <p className="text-zinc-400 text-xs mt-1">No active risk flags detected.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {riskFlags.map((flag: any) => (
                                    <div key={flag.id} className={`bg-zinc-900/50 rounded-xl shadow-sm border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${flag.status === 'open' ? 'border-red-900/50' : 'border-zinc-800 opacity-60'}`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-lg border ${flag.status === 'open' ? 'bg-red-950/30 text-red-500 border-red-900/50' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${flag.severity === 'high' ? 'bg-red-950/30 text-red-400 border-red-900/50' : 'bg-orange-950/30 text-orange-400 border-orange-900/50'}`}>
                                                        {flag.severity} RISK
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${flag.status === 'open' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50' : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'}`}>
                                                        {flag.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-white text-sm mt-2">{flag.reason}</h3>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    Flagged User: <span className="font-bold text-zinc-300">{flag.user?.name}</span> • {new Date(flag.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end justify-center min-w-[120px]">
                                            {flag.status === 'open' ? (
                                                <button 
                                                    onClick={() => confirmResolve(flag.id)}
                                                    className="bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm w-full md:w-auto text-center"
                                                >
                                                    Mark Resolved
                                                </button>
                                            ) : (
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Resolved By</p>
                                                    <p className="text-xs font-bold text-zinc-300">{flag.resolver?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-zinc-500 mt-0.5">{new Date(flag.resolved_at).toLocaleDateString()}</p>
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
                    <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
                        {loadingAudit ? (
                            <div className="p-8 animate-pulse text-sm font-bold text-zinc-500">Loading audit timeline...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Admin</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Details</th>
                                            <th className="px-6 py-4 hidden lg:table-cell">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800 text-sm">
                                        {auditLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-medium">
                                                    No audit logs found.
                                                </td>
                                            </tr>
                                        ) : (
                                            auditLogs.map((log: any) => (
                                                <tr key={log.id} className="hover:bg-zinc-800/50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 font-medium">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-white">{log.admin?.name || 'System'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                                            {log.action.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell text-xs text-zinc-400 font-mono">
                                                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell text-xs text-zinc-500 font-mono">
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
