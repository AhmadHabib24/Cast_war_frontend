import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Flame, Crown, Swords } from 'lucide-react';

interface ShareCardModalProps {
  caste: any;
  rank: number;
  leaderCaste?: any;
  casteAhead?: any;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  caste,
  rank,
  leaderCaste,
  casteAhead,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute jazba narrative
  let gapText = '';
  if (rank === 1) {
    gapText = `${caste.name} is currently DEFENDING THE #1 THRONE OF PAKISTAN!`;
  } else if (casteAhead) {
    const gap = casteAhead.total_points - caste.total_points;
    gapText = `We are only ${gap.toLocaleString()} points away from overtaking ${casteAhead.name} for #${rank - 1}!`;
  }

  const shareText = `🔥 *${caste.name.toUpperCase()} ARMY CALL TO ARMS!* (${caste.urdu_name})\n\nWe are currently *Rank #${rank}* in Pakistan with *${(caste.total_points || 0).toLocaleString()} points* on Cast War!\n${gapText}\n\n⚔️ Contribute points to push ${caste.name} to #1 on the national leaderboard:\nhttps://castwar.pk/caste/${caste.slug || caste.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const crestColor = caste.crest_color || '#fbbf24';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-emerald-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              WhatsApp Status Card
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Visual Share Card Preview (Optimized for WhatsApp / Instagram Screenshot) */}
        <div className="p-5 space-y-4">
          <div
            className="relative overflow-hidden rounded-2xl p-5 border-2 shadow-2xl text-center space-y-3"
            style={{
              borderColor: crestColor,
              background: `radial-gradient(circle at 50% 20%, ${crestColor}25 0%, #090a0f 85%)`
            }}
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-amber-500/40 text-[11px] font-black uppercase text-amber-300">
              <Swords size={12} className="text-amber-400" />
              <span>CAST WAR • PAKISTAN</span>
            </div>

            {/* Huge Rank Callout */}
            <div>
              <div className="text-xs uppercase tracking-widest font-black text-zinc-400 mb-1">
                Current National Standing
              </div>
              <div className="font-mono-num text-5xl sm:text-6xl font-black text-white tracking-tighter">
                <span className="text-amber-400 font-extrabold">#</span>{rank}
              </div>
            </div>

            {/* Caste Title with Urdu */}
            <div className="py-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {caste.name} {caste.urdu_name && <span className="font-urdu text-amber-400">{caste.urdu_name}</span>}
              </h3>
              <div className="font-mono-num text-lg font-black text-zinc-300 mt-1">
                {(caste.total_points || 0).toLocaleString()} <span className="text-xs uppercase text-zinc-500">Battle Pts</span>
              </div>
            </div>

            {/* Jazba Call to Action */}
            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs font-semibold text-amber-300 leading-snug">
              {gapText || `Defend our biradari's honor — push ${caste.name} up the leaderboard today!`}
            </div>

            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest pt-1">
              castwar.pk • sovereign ranking
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <MessageCircle size={18} />
              <span>Share to WhatsApp Status & Groups</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Viral Invitation Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
