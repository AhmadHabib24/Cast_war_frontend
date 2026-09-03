'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('low');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi('/tickets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                setTickets(res.data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load tickets.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi('/tickets', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ subject, priority, message })
            });
            if (res.success) {
                toast.success('Ticket created successfully!');
                setIsModalOpen(false);
                setSubject('');
                setMessage('');
                setPriority('low');
                loadTickets();
            } else {
                toast.error(res.message || 'Error creating ticket');
            }
        } catch (err: any) {
            toast.error(err.message || 'Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'open') return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Open</span>;
        if (status === 'answered') return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><MessageSquare size={12} className="mr-1"/> Answered</span>;
        if (status === 'closed') return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Closed</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Support Tickets</h1>
                    <p className="text-sm font-bold text-gray-500">Need help? We've got your back.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] px-6 py-3 rounded-xl font-bold flex items-center shadow-md transition-all"
                >
                    <Plus size={18} className="mr-2" /> New Ticket
                </button>
            </div>

            {loading ? (
                <div className="bg-white p-12 rounded-3xl text-center text-gray-500 font-bold animate-pulse shadow-sm border border-gray-100">
                    Loading your tickets...
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {tickets.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">No Tickets Found</h3>
                            <p className="text-gray-500 font-medium">You haven't opened any support requests yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {tickets.map(ticket => (
                                <Link href={`/dashboard/support/${ticket.id}`} key={ticket.id} className="block hover:bg-gray-50 transition p-6 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-black text-gray-900 group-hover:text-[var(--color-metallic-gold)] transition-colors line-clamp-1">{ticket.subject}</h3>
                                        <div>{getStatusBadge(ticket.status)}</div>
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-gray-500 space-x-4">
                                        <span>Ticket #{ticket.id}</span>
                                        <span>•</span>
                                        <span className={`uppercase ${ticket.priority === 'high' ? 'text-red-500' : ticket.priority === 'medium' ? 'text-yellow-600' : ''}`}>
                                            {ticket.priority} Priority
                                        </span>
                                        <span>•</span>
                                        <span>Last Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Create Ticket Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-black mb-6 uppercase">Create New Ticket</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Subject</label>
                                <input 
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] font-medium text-gray-900"
                                    placeholder="Brief description of the issue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Priority</label>
                                <select 
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] font-bold text-gray-900"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Message</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] font-medium text-gray-900 resize-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] px-6 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
