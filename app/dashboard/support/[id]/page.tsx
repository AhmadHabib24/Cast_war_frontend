'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Clock, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

export default function TicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            const res = await fetchApi(`/tickets/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                setTicket(res.data);
            } else {
                toast.error('Ticket not found');
                router.push('/dashboard/support');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load ticket.');
            router.push('/dashboard/support');
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
            const res = await fetchApi(`/tickets/${id}/reply`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: reply })
            });

            if (res.success) {
                setReply('');
                // Append new message locally
                setTicket({
                    ...ticket,
                    status: 'open',
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

    const getStatusBadge = (status: string) => {
        if (status === 'open') return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Open</span>;
        if (status === 'answered') return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><MessageSquare size={12} className="mr-1"/> Answered</span>;
        if (status === 'closed') return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Closed</span>;
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500 font-bold animate-pulse">Loading Ticket...</div>;
    }

    if (!ticket) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
            {/* Header */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
                <Link href="/dashboard/support" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-bold text-sm mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Tickets
                </Link>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{ticket.subject}</h1>
                        <div className="flex items-center text-xs font-bold text-gray-500 space-x-3">
                            <span>Ticket #{ticket.id}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{new Date(ticket.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {getStatusBadge(ticket.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${ticket.priority === 'high' ? 'border-red-200 text-red-600 bg-red-50' : ticket.priority === 'medium' ? 'border-yellow-200 text-yellow-600 bg-yellow-50' : 'border-gray-200 text-gray-600 bg-gray-50'}`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50">
                    {ticket.messages.map((msg: any) => {
                        const isAdmin = msg.is_admin_reply === 1 || msg.is_admin_reply === true;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-bold text-gray-400">
                                        {isAdmin ? 'Support Agent' : 'You'}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-300">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`relative max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
                                    isAdmin 
                                    ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none' 
                                    : 'bg-[var(--color-brand-black)] text-white rounded-tr-none'
                                }`}>
                                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                    
                                    {isAdmin && (
                                        <div className="absolute -left-2 -top-2 bg-[var(--color-metallic-gold)] text-white p-1 rounded-full shadow-sm">
                                            <ShieldAlert size={12} />
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
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleReply} className="flex space-x-2">
                            <input 
                                type="text"
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-metallic-gold)] text-sm font-medium"
                            />
                            <button 
                                type="submit"
                                disabled={isSubmitting || !reply.trim()}
                                className="bg-[var(--color-metallic-gold)] text-[var(--color-brand-black)] h-12 w-12 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send size={18} className="ml-1" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm font-bold text-gray-500">
                        This ticket has been closed. You cannot reply to it anymore.
                    </div>
                )}
            </div>
        </div>
    );
}
