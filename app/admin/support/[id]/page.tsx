'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Clock, CheckCircle2, MessageSquare, ShieldAlert, Power } from 'lucide-react';

export default function AdminTicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTicket();
    }, [id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [ticket?.messages]);

    const loadTicket = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi(`/admin/tickets/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                setTicket(res.data);
            } else {
                toast.error('Ticket not found');
                router.push('/admin/support');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load ticket.');
            router.push('/admin/support');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi(`/admin/tickets/${id}/reply`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: reply })
            });

            if (res.success) {
                setReply('');
                setTicket({
                    ...ticket,
                    status: 'answered',
                    messages: [...ticket.messages, res.data]
                });
            } else {
                toast.error(res.message || 'Error sending reply');
            }
        } catch (err: any) {
            toast.error(err.message || 'Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi(`/admin/tickets/${id}/status`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.success) {
                toast.success('Status updated');
                setTicket({ ...ticket, status: newStatus });
            } else {
                toast.error(res.message || 'Failed to update status');
            }
        } catch (err: any) {
            toast.error(err.message || 'Network error');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'open') return <span className="bg-amber-950/50 text-amber-500 border border-amber-900/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Open</span>;
        if (status === 'answered') return <span className="bg-emerald-950/50 text-emerald-500 border border-emerald-900/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><MessageSquare size={12} className="mr-1"/> Answered</span>;
        if (status === 'closed') return <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Closed</span>;
    };

    if (loading) {
        return <div className="p-12 text-center text-zinc-500 font-bold animate-pulse">Loading Ticket...</div>;
    }

    if (!ticket) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
            {/* Header */}
            <div className="bg-zinc-900/50 p-4 md:p-6 rounded-3xl shadow-sm border border-zinc-800 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-auto">
                    <Link href="/admin/support" className="inline-flex items-center text-zinc-500 hover:text-white font-bold text-sm mb-4 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Tickets
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black text-white mb-1">{ticket.subject}</h1>
                    <div className="flex flex-wrap items-center text-xs font-bold text-zinc-500 gap-3">
                        <span>Ticket #{ticket.id}</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full hidden md:inline-block"></span>
                        <span className="text-amber-500">{ticket.user?.name} ({ticket.user?.email})</span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full hidden md:inline-block"></span>
                        <span className={`uppercase ${ticket.priority === 'high' ? 'text-red-500' : ticket.priority === 'medium' ? 'text-amber-500' : 'text-zinc-400'}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end border-t border-zinc-800 md:border-t-0 pt-4 md:pt-0">
                    <div className="mr-2">{getStatusBadge(ticket.status)}</div>
                    
                    {ticket.status !== 'closed' && (
                        <button 
                            onClick={() => handleStatusChange('closed')}
                            disabled={isUpdatingStatus}
                            className="bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors disabled:opacity-50"
                        >
                            <Power size={14} className="mr-1" /> Close Ticket
                        </button>
                    )}
                    {ticket.status === 'closed' && (
                        <button 
                            onClick={() => handleStatusChange('open')}
                            disabled={isUpdatingStatus}
                            className="bg-amber-950/30 hover:bg-amber-900/50 border border-amber-900/50 text-amber-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors disabled:opacity-50"
                        >
                            <Clock size={14} className="mr-1" /> Reopen Ticket
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-zinc-900/50 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-zinc-950/50">
                    {ticket.messages.map((msg: any) => {
                        const isAdmin = msg.is_admin_reply === 1 || msg.is_admin_reply === true;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-bold text-zinc-500">
                                        {isAdmin ? 'You (Admin)' : ticket.user?.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-600">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
                                    isAdmin 
                                    ? 'bg-amber-500 text-zinc-950 rounded-tr-none' 
                                    : 'bg-zinc-900 text-white border border-zinc-800 rounded-tl-none'
                                }`}>
                                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed font-medium">{msg.message}</p>
                                    
                                    {!isAdmin && (
                                        <div className="absolute -left-2 -top-2 bg-zinc-800 text-amber-500 p-1 rounded-full shadow-sm border border-zinc-700">
                                            <MessageSquare size={12} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                {ticket.status !== 'closed' ? (
                    <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                        <form onSubmit={handleReply} className="flex space-x-2">
                            <input 
                                type="text"
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                placeholder="Type your reply to the user..."
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-white text-sm font-medium placeholder-zinc-500"
                            />
                            <button 
                                type="submit"
                                disabled={isSubmitting || !reply.trim()}
                                className="bg-amber-500 text-zinc-950 h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shrink-0"
                            >
                                <Send size={18} className="-ml-1" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center text-sm font-bold text-zinc-500">
                        This ticket is closed. Reopen it to send a reply.
                    </div>
                )}
            </div>
        </div>
    );
}
