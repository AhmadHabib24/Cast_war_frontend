'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Circle, CheckCircle } from 'lucide-react';
import { API_URL, BASE_URL } from '@/lib/api';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`${API_URL}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Polling as a fallback to websockets
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // 30 seconds

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-[var(--color-brand-black)] transition-colors rounded-full hover:bg-gray-100"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white justify-center items-center font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs font-bold text-[var(--color-metallic-gold)] hover:text-[var(--color-rich-gold)] transition-colors">
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-sm font-medium text-gray-500">
                                You have no notifications.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-4 flex items-start space-x-3 transition-colors ${!notification.read_at ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                                        onClick={() => { if (!notification.read_at) markAsRead(notification.id) }}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {!notification.read_at ? (
                                                <Circle size={10} className="text-[var(--color-metallic-gold)] fill-current" />
                                            ) : (
                                                <CheckCircle size={14} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 cursor-pointer">
                                            <p className={`text-sm ${!notification.read_at ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                {notification.data?.message || 'New Notification'}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-wider">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
