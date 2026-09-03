'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { MessageSquare, Clock, CheckCircle2, Filter } from 'lucide-react';

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadTickets(filter);
    }, [filter]);

    const loadTickets = async (status: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = status === 'all' ? '/admin/tickets' : `/admin/tickets?status=${status}`;
            const res = await fetchApi(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                setTickets(res.data.data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load tickets.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'open') return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Open</span>;
        if (status === 'answered') return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><MessageSquare size={12} className="mr-1"/> Answered</span>;
        if (status === 'closed') return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Closed</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[var(--color-brand-black)] uppercase tracking-tight">Support Tickets</h1>
                    <p className="text-sm font-bold text-gray-500">Manage and respond to user requests.</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <Filter size={16} className="text-gray-400 ml-2" />
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 outline-none pr-4"
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open</option>
                        <option value="answered">Answered</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="bg-white p-12 rounded-3xl text-center text-gray-500 font-bold animate-pulse shadow-sm border border-gray-100">
                    Loading tickets...
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {tickets.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">No Tickets Found</h3>
                            <p className="text-gray-500 font-medium">Inbox zero! Good job.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {tickets.map(ticket => (
                                <Link href={`/admin/support/${ticket.id}`} key={ticket.id} className="block hover:bg-gray-50 transition p-6 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-[var(--color-metallic-gold)] transition-colors line-clamp-1">
                                                {ticket.subject}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 mt-1">
                                                From: <span className="font-bold text-gray-700">{ticket.user?.name}</span> ({ticket.user?.email})
                                            </p>
                                        </div>
                                        <div>{getStatusBadge(ticket.status)}</div>
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-gray-400 space-x-4 mt-2">
                                        <span>Ticket #{ticket.id}</span>
                                        <span>•</span>
                                        <span className={`uppercase ${ticket.priority === 'high' ? 'text-red-500' : ticket.priority === 'medium' ? 'text-yellow-600' : ''}`}>
                                            {ticket.priority} Priority
                                        </span>
                                        <span>•</span>
                                        <span>{ticket.messages_count} messages</span>
                                        <span>•</span>
                                        <span>Updated: {new Date(ticket.updated_at).toLocaleString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
