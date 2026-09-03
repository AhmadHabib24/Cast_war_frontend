'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, moved: false });
    
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to Cast War! I am your AI assistant. Ask me how to play, deposit, or overtake other casts!",
            sender: 'bot'
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI Response Logic
        setTimeout(() => {
            const query = userMsg.text.toLowerCase();
            let botResponse = "I'm not sure about that. The rules of war are ever-changing. Ask me about 'how to play', 'deposit', or 'rank'.";

            if (query.includes('how to play') || query.includes('concept') || query.includes('what is')) {
                botResponse = "Cast War is a gamified contribution platform where factions (Casts) battle for dominance. Every PKR 1 contributed equals 1 Power Point. The Cast with the most power ranks #1!";
            } else if (query.includes('deposit') || query.includes('money') || query.includes('wallet') || query.includes('pay')) {
                botResponse = "To contribute to a Cast, you must first add funds to your Wallet. Go to your Wallet, click 'Add Funds', submit a screenshot of your transfer, and wait for admin approval.";
            } else if (query.includes('overtake') || query.includes('rank') || query.includes('bid')) {
                botResponse = "To overtake a rival cast, click the '🚀 Bid to Overtake' button on your Cast's page. It will automatically calculate the exact amount needed to beat the cast directly above you!";
            } else if (query.includes('admin') || query.includes('support') || query.includes('help')) {
                botResponse = "If you have an issue, you can create a Support Ticket from your Dashboard. Admins actively monitor the battlefield and will assist you.";
            } else if (query.includes('hello') || query.includes('hi ')) {
                botResponse = "Greetings, warrior! How can I assist you on the battlefield today?";
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y,
            moved: false
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragRef.current.moved = true;
        }

        setPosition({
            x: dragRef.current.initialX + dx,
            y: dragRef.current.initialY + dy
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const handleButtonClick = () => {
        if (!dragRef.current.moved) {
            setIsOpen(true);
        }
    };

    return (
        <div 
            className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end"
            style={{ transform: `translate(${position.x}px, ${position.y}px)`, touchAction: 'none' }}
        >
            {/* Chat Button */}
            {!isOpen && (
                <button 
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onClick={handleButtonClick}
                    className="w-14 h-14 bg-gradient-to-br from-[var(--color-metallic-gold)] to-[var(--color-rich-gold)] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-move"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
                    
                    {/* Header */}
                    <div 
                        className="bg-gradient-to-r from-[var(--color-brand-black)] to-gray-900 text-white p-4 flex justify-between items-center shrink-0 cursor-move"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <div className="flex items-center space-x-2">
                            <Bot className="text-[var(--color-metallic-gold)]" size={24} />
                            <div>
                                <h3 className="font-bold text-sm tracking-wide flex items-center">
                                    War Assistant <Sparkles size={12} className="ml-1 text-[var(--color-metallic-gold)]" />
                                </h3>
                                <p className="text-[10px] text-gray-400">Always online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end max-w-[85%] space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                    
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-[var(--color-brand-black)] text-white' : 'bg-[var(--color-metallic-gold)] text-white'}`}>
                                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    
                                    {/* Bubble */}
                                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                                        msg.sender === 'user' 
                                        ? 'bg-[var(--color-brand-black)] text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <div className="relative">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-[var(--color-metallic-gold)] transition"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--color-brand-black)] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-[var(--color-metallic-gold)]"
                            >
                                <Send size={14} className="ml-0.5" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[9px] text-gray-400 font-medium">Powered by Cast War AI</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
