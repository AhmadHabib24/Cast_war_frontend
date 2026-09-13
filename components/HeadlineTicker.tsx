'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShieldAlert, Sparkles, TrendingUp, Users, Zap, X, Crown, AtSign } from 'lucide-react';

export interface OvertakeAlert {
  casteName: string;
  casteUrdu: string;
  overtakenName: string;
  warriorName?: string;
}

export interface PointEvent {
  user_name: string;
  user_social?: { instagram?: string; tiktok?: string };
  pkr_amount?: number;
  points_awarded: number;
  caste_name: string;
  payment_method?: string;
}

interface HeadlineTickerProps {
  todayStats: {
    totalPointsToday: number;
    activeWarriorsToday: number;
    bidsPlacedToday?: number;
  };
  overtakeAlert: OvertakeAlert | null;
  onDismissOvertake: () => void;
  recentEvents: PointEvent[];
}

const ROTATING_SUBLINES = [
  'The Sovereign Leaderboard of Pakistan • 1 PKR = 1 Point',
  'Hamza holds the #1 Crown • Ali is trailing by only 700 pts!',
  'Outbid in real-time via JazzCash, EasyPaisa, SadaPay & Raast',
  'Upload your payment snap — show Pakistan who is the real Lion',
  'Jutts, Rajputs, Gujjars, Awans & Arains competing for national supremacy',
  'One number decides the throne • Radical outbid simplicity'
];

export const HeadlineTicker: React.FC<HeadlineTickerProps> = ({
  todayStats,
  overtakeAlert,
  onDismissOvertake,
  recentEvents,
}) => {
  const [sublineIndex, setSublineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSublineIndex((prev) => (prev + 1) % ROTATING_SUBLINES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const latestEvent = recentEvents[0];

  return (
    <div className="w-full pt-5 pb-3">
      {/* Overtake Alert Banner */}
      <AnimatePresence>
        {overtakeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 max-w-4xl mx-auto px-2"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-0.5 shadow-2xl shadow-amber-500/20">
              <div className="bg-[#0e1318] px-4 py-3.5 rounded-[14px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-xl animate-pulse">
                    🦁
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                        BREAKING THRONE OVERTAKE
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                        Rank #1 Crown Shift
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                      <span className="text-amber-400 font-black">{overtakeAlert.casteName} ({overtakeAlert.casteUrdu})</span>{' '}
                      just dethroned{' '}
                      <span className="text-zinc-300 font-semibold">{overtakeAlert.overtakenName}</span>{' '}
                      for the #1 throne of Pakistan!
                      {overtakeAlert.warriorName && (
                        <span className="text-xs text-amber-200/90 ml-1.5">
                          (Chief Lion: <strong>{overtakeAlert.warriorName}</strong>)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onDismissOvertake}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Title & Elite Subtitle */}
      <div className="text-center px-4">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-3">
          <Crown size={13} className="text-amber-400" />
          <span>Pakistan Biradari Sovereign Outbid Arena</span>
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
            CAST
          </span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 underline decoration-amber-500/40 underline-offset-8">
            WAR
          </span>
        </h1>

        {/* Rotating Elite Subline */}
        <div className="h-8 mt-2.5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={sublineIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm md:text-base font-semibold text-amber-300/90 tracking-wide"
            >
              {ROTATING_SUBLINES[sublineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Live Counters */}
        <div className="mt-5 max-w-2xl mx-auto bg-gradient-to-b from-zinc-900/90 to-[#0e1318] border border-amber-500/20 rounded-2xl p-3 sm:p-3.5 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-3 divide-x divide-zinc-800 text-center">
            
            {/* Total War Funds / Points */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                <Zap size={13} className="text-amber-400" />
                <span>Points Funded</span>
              </div>
              <div className="font-mono text-base sm:text-2xl font-black text-amber-400 tracking-tight">
                {todayStats.totalPointsToday.toLocaleString()}
              </div>
            </div>

            {/* Active Warriors */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                <Users size={13} className="text-emerald-400" />
                <span>Active Warriors</span>
              </div>
              <div className="font-mono text-base sm:text-2xl font-black text-white tracking-tight">
                {todayStats.activeWarriorsToday.toLocaleString()}
              </div>
            </div>

            {/* Total Outbids Placed */}
            <div className="px-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                <Flame size={13} className="text-orange-400" />
                <span>Bids Placed</span>
              </div>
              <div className="font-mono text-base sm:text-2xl font-black text-zinc-200 tracking-tight">
                {(todayStats.bidsPlacedToday || 1845).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Ticker with Outbid details & Social proof */}
        {latestEvent && (
          <div className="mt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 max-w-xl truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-zinc-500 shrink-0">Live:</span>
              <span className="font-bold text-white shrink-0">{latestEvent.user_name}</span>
              {latestEvent.user_social?.instagram && (
                <span className="text-[10px] text-pink-400 font-mono hidden sm:inline">
                  (@{latestEvent.user_social.instagram})
                </span>
              )}
              <span className="text-zinc-400 shrink-0">added</span>
              <span className="font-mono font-bold text-amber-400 shrink-0">
                +Rs. {(latestEvent.pkr_amount || latestEvent.points_awarded).toLocaleString()}
              </span>
              <span className="text-zinc-400 shrink-0">to</span>
              <span className="font-bold text-white shrink-0">{latestEvent.caste_name}</span>
              <span className="text-[10px] font-mono text-zinc-500 hidden md:inline shrink-0">
                via {latestEvent.payment_method || 'Instant Pay'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
