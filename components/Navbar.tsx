'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Volume2, VolumeX, User, Settings } from 'lucide-react';
import { RulesModal } from './RulesModal';
import { AdminModal } from './AdminModal';
import { WarriorProfileModal } from './WarriorProfileModal';
import { API_URL } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [simulationEnabled, setSimulationEnabled] = useState(true);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showWarriorModal, setShowWarriorModal] = useState(false);
  const [castes, setCastes] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowWarriorModal(false);
    router.push('/');
  };

  const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch (e) {}
      }
    }

    const fetchCastes = async () => {
        try {
            const res = await fetch(`${API_URL}/leaderboard`);
            const data = await res.json();
            if (data.success) {
                setCastes(data.data);
            }
        } catch (err) {}
    };
    fetchCastes();
  }, [pathname]);

  if (isHidden) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#08090d]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <img 
              src="/cast-war-logo.png" 
              alt="Cast War" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Simulator Toggle */}
            <button
              onClick={() => setSimulationEnabled(!simulationEnabled)}
              title={simulationEnabled ? "Live activity simulation running" : "Live simulation paused"}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                simulationEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${simulationEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span>{simulationEnabled ? 'LIVE FEED' : 'FEED PAUSED'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors"
              title={soundEnabled ? "Mute audio" : "Unmute audio"}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 size={16} className="text-amber-400" /> : <VolumeX size={16} className="text-zinc-500" />}
            </button>

            {/* Rules / FAQ */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="hidden md:inline-flex px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Rules & Proof
            </button>

            {/* User Warrior or Auth */}
            {isAuthenticated && currentUser ? (
              <button
                onClick={() => setShowWarriorModal(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-800 border border-amber-500/30 text-xs font-semibold text-zinc-200 hover:border-amber-500/60 transition-all shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-400/40 overflow-hidden">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : '🦁'}
                </span>
                <span className="max-w-[100px] truncate text-amber-300">{currentUser.name || 'Warrior'}</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all"
              >
                <User size={14} />
                <span>Join As Warrior</span>
              </Link>
            )}

            {/* Admin link */}
            {isAuthenticated && currentUser?.role === 'admin' && (
              <button
                onClick={() => setShowAdminModal(true)}
                title="Admin & Webhook Postback Engine"
                className="p-2 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-amber-300 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </div>
      </header>
      {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}
      {showWarriorModal && (
        <WarriorProfileModal
          user={currentUser}
          castes={castes}
          onClose={() => setShowWarriorModal(false)}
          onLogout={handleLogout}
          onSelectCaste={() => {}}
        />
      )}
    </>
  );
}
