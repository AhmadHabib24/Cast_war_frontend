import React, { useMemo } from 'react';
import {
  X,
  Crown,
  TrendingUp,
  Share2,
  Zap,
  AtSign,
  Flame,
} from 'lucide-react';

interface Contributor {
  user_id: string | number;
  display_name: string;
  points: number;
  rank: number;
  avatar?: string;
}

interface HistoryPoint {
  date: string;
  points: number;
}

interface CasteProfileModalProps {
  caste: any;
  rank: number;
  contributors?: Contributor[];
  history?: HistoryPoint[];
  onClose: () => void;
  onAddPoints: (caste: any) => void;
  onOpenShareModal?: (caste: any, rank: number) => void;
}

export const CasteProfileModal: React.FC<CasteProfileModalProps> = ({
  caste,
  rank,
  contributors = [],
  history = [],
  onClose,
  onAddPoints,
  onOpenShareModal,
}) => {
  // Compute SVG chart path
  const chartPoints = useMemo(() => {
    if (history.length === 0) return { line: '', area: '', coords: [] };
    const min = Math.min(...history.map((h) => h.points));
    const max = Math.max(...history.map((h) => h.points));
    const range = max - min || 1;

    const width = 500;
    const height = 140;
    const padding = 20;

    const coords = history.map((pt, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((pt.points - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    return {
      line: coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' '),
      area: `${coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')} L ${width - padding} ${height} L ${padding} ${height} Z`,
      coords,
    };
  }, [history]);

  const warriorPoints = caste.warrior_points || 1000;
  const runnerUpPoints = caste.runner_up_warrior_points || Math.max(500, warriorPoints - 700);
  const gap = Math.max(1, warriorPoints - runnerUpPoints);
  const crestColor = caste.crest_color || '#fbbf24';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1318] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Header with Crest Banner */}
        <div
          className="relative px-6 py-6 border-b border-zinc-800"
          style={{
            background: `linear-gradient(135deg, ${crestColor}25 0%, #090c10 85%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-sm">
                  Rank #{rank} in Pakistan
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Region: {caste.region || 'All'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {caste.name}
                </h1>
                {caste.urdu_name && (
                  <span className="font-urdu text-2xl sm:text-3xl font-bold text-amber-400">
                    {caste.urdu_name}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">{caste.tagline}</p>
            </div>

            {/* Total Points Display */}
            <div className="text-left sm:text-right">
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400">
                {(caste.total_points || 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Total War Points / PKR
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onAddPoints(caste)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Zap size={16} className="fill-black" />
              <span>Outbid & Add War Funds for {caste.name}</span>
            </button>

            {onOpenShareModal && (
              <button
                onClick={() => onOpenShareModal(caste, rank)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition-colors"
              >
                <Share2 size={16} />
                <span>Share Status</span>
              </button>
            )}
          </div>

          {/* Chief Lion & Challenger Spotlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame size={14} className="text-amber-500" />
                <span>Biradari Throne Sovereignty</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Gap: {gap.toLocaleString()} Pts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Defending Lion */}
              <div className="p-3 rounded-lg bg-zinc-950 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Crown size={12} />
                    <span>DEFENDING CHIEF LION</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{warriorPoints.toLocaleString()} pts</span>
                </div>
                <div className="text-sm font-black text-white mt-1">{caste.current_warrior_name || 'Chief Lion'}</div>
                {caste.current_warrior_social?.instagram && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-pink-400 font-mono">
                    <AtSign size={11} />
                    <span>@{caste.current_warrior_social.instagram}</span>
                  </div>
                )}
              </div>

              {/* Challenger */}
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                    <span>⚔️</span>
                    <span>RUNNER-UP CHALLENGER</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-300">{runnerUpPoints.toLocaleString()} pts</span>
                </div>
                <div className="text-sm font-black text-white mt-1">{caste.runner_up_warrior_name || 'Challenger'}</div>
                <div className="mt-1 text-[10px] text-amber-400/90 font-mono">
                  Needs only Rs. {gap.toLocaleString()} to claim #1
                </div>
              </div>
            </div>
          </div>

          {/* Heritage Note */}
          {caste.historical_note && (
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300">
              <span className="text-zinc-500 font-semibold uppercase text-[10px] block mb-1">
                Heritage & Legacy:
              </span>
              {caste.historical_note}
            </div>
          )}

          {/* Trend Chart */}
          {history.length > 0 && (
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    War Point Velocity
                  </h3>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Real-time Outbid Feed</span>
              </div>

              <div className="w-full overflow-hidden">
                <svg viewBox="0 0 500 140" className="w-full h-32">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={crestColor} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={crestColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={chartPoints.area} fill="url(#areaGradient)" />
                  <path
                    d={chartPoints.line}
                    fill="none"
                    stroke={crestColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {chartPoints.coords?.map((c, i) => (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r="4"
                      fill="#fff"
                      stroke={crestColor}
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 pt-2 font-mono">
                {history.map((h, i) => (
                  <span key={i}>{h.date}</span>
                ))}
              </div>
            </div>
          )}

          {/* Top Warriors Leaderboard */}
          {contributors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Top Lions & Patrons of {caste.name}
                  </h3>
                </div>
                <span className="text-xs text-zinc-500">Ranked by Outbid Points</span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800/80 overflow-hidden">
                {contributors.map((warrior) => (
                  <div
                    key={warrior.user_id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 font-mono font-bold text-sm">
                        {warrior.rank === 1 ? (
                          <Crown size={16} className="text-amber-400" />
                        ) : warrior.rank === 2 ? (
                          <span className="text-slate-300">#2</span>
                        ) : warrior.rank === 3 ? (
                          <span className="text-amber-700">#3</span>
                        ) : (
                          <span className="text-zinc-500">#{warrior.rank}</span>
                        )}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm border border-zinc-700">
                        {warrior.avatar || '🦁'}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                          <span>{warrior.display_name}</span>
                          {warrior.rank === 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500 text-black">
                              CHIEF LION
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {warrior.rank === 1 ? 'Defending Sovereignty' : 'Active Contributor'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-amber-400">
                        {warrior.points.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
