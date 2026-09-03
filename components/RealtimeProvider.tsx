'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Setup Mock Context for UI preview
// In production, this would initialize Laravel Echo with Pusher/Reverb settings
const RealtimeContext = createContext<any>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Simulate real-time websocket events for the UI presentation
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomCasts = ['Rajput', 'Jat', 'Arain', 'Gujjar', 'Syed', 'Baloch'];
                const randomPoints = Math.floor(Math.random() * 5000) + 100;
                const cast = randomCasts[Math.floor(Math.random() * randomCasts.length)];
                
                addNotification(`⚡ ${cast} just received a boost of ${randomPoints} power!`);
            }
        }, 15000); // Check every 15s

        return () => clearInterval(interval);
    }, []);

    const addNotification = (message: string) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, text: message }]);
        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter(n => n.id !== id));
    };

    return (
        <RealtimeContext.Provider value={{ notifications }}>
            {children}
            {/* Live Toasts Overlay */}
            <div className="fixed bottom-24 md:bottom-8 right-4 z-50 flex flex-col gap-2">
                {notifications.map((note) => (
                    <div 
                        key={note.id} 
                        className="bg-[var(--color-brand-black)] text-[var(--color-metallic-gold)] border border-[var(--color-metallic-gold)] px-4 py-3 rounded-xl shadow-[0_10px_40px_rgba(212,175,55,0.3)] animate-[slideIn_0.3s_ease-out] font-bold flex items-center space-x-3 pointer-events-auto"
                    >
                        <span className="flex-1">{note.text}</span>
                        <button 
                            onClick={() => removeNotification(note.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            
            <style jsx global>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </RealtimeContext.Provider>
    );
}

export const useRealtime = () => useContext(RealtimeContext);
