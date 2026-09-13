import React from 'react';
import { X, ShieldAlert, CheckCircle2, HeartHandshake, Scale, Lock, Crown, Zap, AtSign } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1318] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[90vh] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-amber-400" />
            <h2 className="text-lg font-black text-white">The Sovereign Outbid Arena • Rules & Proof</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed custom-scrollbar">
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200">
            <strong className="block text-sm font-black mb-1 flex items-center gap-1.5 text-amber-300">
              <Zap size={15} />
              <span>Outbid Model: 1 PKR = 1 Point</span>
            </strong>
            Cast War is Pakistan&apos;s elite public biradari leaderboard inspired by the radical simplicity of outbid mechanics. Every Pakistani rupee sent via JazzCash, EasyPaisa, SadaPay, or Raast adds points directly to your biradari in real-time.
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Crown size={15} className="text-amber-400" />
              <span>1. Chief Lion Status & Superiority</span>
            </h3>
            <p className="text-zinc-400">
              The highest contributor to a caste is crowned its <strong>&ldquo;Chief Lion&rdquo; (شیرِ برادری)</strong>. Their name and crest are pinned at the top of the national leaderboard.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AtSign size={15} className="text-pink-400" />
              <span>2. Verified Social Handles (Instagram & TikTok)</span>
            </h3>
            <p className="text-zinc-400">
              Warriors can link their Instagram (@username) or TikTok profile. When people click your profile on the leaderboard, they see your social handles, establishing undeniable public proof that you hold the throne.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={15} className="text-emerald-400" />
              <span>3. The Challenger Gap (Outbid Rivalry)</span>
            </h3>
            <p className="text-zinc-400">
              If Ali is 700 points behind Hamza, Ali can add exactly Rs. 700 to instantly dethrone Hamza and reclaim the Chief Lion crown. The UI calculates this gap dynamically.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert size={15} className="text-amber-400" />
              <span>4. Instant Banking & Raast Security</span>
            </h3>
            <p className="text-zinc-400">
              Contributions are verified instantly using transaction IDs (TID) from SBP Raast, JazzCash, EasyPaisa, SadaPay, NayaPay, and Pakistani commercial banks.
            </p>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs transition-all uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Enter The Arena
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
