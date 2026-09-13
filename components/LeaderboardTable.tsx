'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Share2,
  Info,
  Crown,
  Zap,
  AtSign,
} from 'lucide-react';

interface LeaderboardTableProps {
  castes: any[];
  lastUpdatedCasteId?: string | null;
  onSelectCasteForTasks: (caste: any) => void;
  onOpenCasteProfile: (caste: any) => void;
  onOpenShareModal: (caste: any, rank: number) => void;
  onOpenAddCasteModal: (initialName?: string) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  castes,
  lastUpdatedCasteId,
  onSelectCasteForTasks,
  onOpenCasteProfile,
  onOpenShareModal,
  onOpenAddCasteModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Sorted castes
  const sortedCastes = useMemo(() => {
    return [...castes].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
  }, [castes]);

  const regions = ['All', 'Punjab', 'Sindh', 'KPK', 'Balochistan'];

  const filteredCastes = useMemo(() => {
    return sortedCastes.filter((caste) => {
      const matchesSearch =
        caste.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caste.urdu_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Fallback if backend doesn't have region yet, distribute deterministically
      const fallbackRegion = regions[1 + ((caste.name?.length || 0) % 4)]; 
      const casteRegion = caste.region || fallbackRegion;
      
      const matchesRegion =
        selectedRegion === 'All' || casteRegion.toLowerCase().includes(selectedRegion.toLowerCase());
        
      return matchesSearch && matchesRegion;
    });
  }, [sortedCastes, searchQuery, selectedRegion]);

  const maxPoints = sortedCastes[0]?.total_points || 1;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-20">
      
      {/* Featured Sovereign Rivalry Spotlight */}
      {sortedCastes.length > 0 && (
        <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#161c24] to-zinc-950 border border-amber-500/40 shadow-xl shadow-amber-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                🦁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500 text-black">
                    NATIONAL THRONE BATTLE
                  </span>
                  <span className="text-xs text-amber-300/80 font-mono">Rank #1 Sovereignty</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  {sortedCastes[0]?.current_warrior_name || 'Chief Lion'} vs {sortedCastes[0]?.runner_up_warrior_name || 'Challenger'}
                </h3>
                <p className="text-xs text-zinc-300">
                  Defending Biradari: <strong className="text-amber-400">{sortedCastes[0]?.name}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectCasteForTasks(sortedCastes[0])}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0 active:scale-95"
            >
              <Zap size={14} className="fill-black" />
              <span>Outbid & Snatch Crown</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Region Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your caste / اپنی برادری تلاش کریں"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800/90 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Zero results fallback */}
      {filteredCastes.length === 0 && (
        <div className="my-8 text-center p-8 rounded-2xl bg-zinc-900/50 border border-dashed border-zinc-800">
          <p className="text-zinc-300 font-semibold mb-2">
            No caste found matching &ldquo;<span className="text-amber-400 font-bold">{searchQuery}</span>&rdquo;
          </p>
          <p className="text-zinc-500 text-xs mb-4">
            Cast War is 100% community-driven. Register your caste right now and claim its throne!
          </p>
          <button
            onClick={() => onOpenAddCasteModal(searchQuery)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <PlusCircle size={18} />
            <span>Add &ldquo;{searchQuery}&rdquo; to Leaderboard</span>
          </button>
        </div>
      )}

      {/* Leaderboard Cards */}
      <div className="space-y-2.5">
        {filteredCastes.map((caste) => {
          const trueRank = sortedCastes.findIndex((c) => c.id === caste.id) + 1;
          const isRank1 = trueRank === 1;
          const isRank2 = trueRank === 2;
          const isRank3 = trueRank === 3;
          const isJustUpdated = lastUpdatedCasteId === caste.id;

          let gapAboveText = '';
          if (trueRank > 1) {
            const casteAbove = sortedCastes[trueRank - 2];
            const gap = (casteAbove.total_points || 0) - (caste.total_points || 0);
            gapAboveText = `${gap.toLocaleString()} pts to pass #${trueRank - 1} (${casteAbove.name})`;
          }

          const warriorName = caste.current_warrior_name || 'Chief Lion';
          const warriorSocial = caste.current_warrior_social;
          
          const percentOfLeader = Math.max(8, Math.min(100, Math.round(((caste.total_points || 0) / maxPoints) * 100)));
          const crestColor = caste.crest_color || '#fbbf24';

          return (
            <div
              key={caste.id}
              className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${
                isJustUpdated
                  ? 'animate-row-flash border-amber-400 bg-amber-500/10'
                  : isRank1
                  ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-[#131921] to-[#0c0f13] shadow-lg shadow-amber-500/10'
                  : isRank2
                  ? 'border-slate-400/40 bg-gradient-to-r from-slate-400/10 via-[#131921] to-[#0c0f13]'
                  : isRank3
                  ? 'border-amber-700/40 bg-gradient-to-r from-amber-700/10 via-[#131921] to-[#0c0f13]'
                  : 'border-zinc-800/80 bg-[#101419]/90 hover:border-zinc-700'
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: crestColor }}
              />

              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex flex-col items-center justify-center w-11 sm:w-13 shrink-0 pt-0.5 sm:pt-0">
                    {isRank1 && (
                      <Crown size={16} className="text-amber-400 fill-amber-400 mb-0.5 animate-pulse" />
                    )}
                    <span
                      className={`font-mono font-black leading-none tracking-tight ${
                        isRank1
                          ? 'text-2xl sm:text-3xl text-amber-400'
                          : isRank2
                          ? 'text-xl sm:text-2xl text-slate-300'
                          : isRank3
                          ? 'text-xl sm:text-2xl text-amber-600'
                          : 'text-lg sm:text-xl text-zinc-500'
                      }`}
                    >
                      #{trueRank}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onOpenCasteProfile(caste)}
                        className="text-base sm:text-lg font-black text-white hover:text-amber-400 flex items-center gap-1.5 transition-colors group-hover:underline underline-offset-4 decoration-amber-500/40"
                      >
                        <span>{caste.name}</span>
                        {caste.urdu_name && (
                          <span className="font-urdu text-sm sm:text-base font-bold text-amber-400/90">
                            {caste.urdu_name}
                          </span>
                        )}
                      </button>

                      {isRank1 && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500 text-black flex items-center gap-1 shadow-sm">
                          👑 DEFENDING THRONE
                        </span>
                      )}

                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: crestColor }}
                      />
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-300">
                      <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2 py-0.5 rounded-lg border border-zinc-800">
                        <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-0.5">
                          <span>🦁</span>
                          <span>Lion:</span>
                        </span>
                        <strong className="text-white font-bold">{warriorName}</strong>
                        
                        {warriorSocial?.instagram && (
                          <a
                            href={`https://instagram.com/${warriorSocial.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-pink-400 hover:text-pink-300 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20 transition-colors"
                          >
                            <AtSign size={10} />
                            <span>@{warriorSocial.instagram}</span>
                          </a>
                        )}
                      </div>

                      {gapAboveText && (
                        <span className="text-[11px] text-zinc-500 hidden md:inline">
                          • {gapAboveText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <div className="text-left sm:text-right">
                    <div
                      className={`font-mono text-lg sm:text-2xl font-black tracking-tight transition-colors ${
                        isJustUpdated
                          ? 'animate-point-pulse text-emerald-400'
                          : isRank1
                          ? 'text-amber-400'
                          : 'text-white'
                      }`}
                    >
                      {(caste.total_points || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Points / PKR
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectCasteForTasks(caste)}
                      className={`relative flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                        isRank1
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20'
                          : 'bg-zinc-100 hover:bg-white text-zinc-950 hover:shadow-zinc-200/10'
                      }`}
                    >
                      <Zap size={14} className={isRank1 ? 'fill-black' : 'fill-zinc-950'} />
                      <span>Add Funds</span>
                    </button>

                    <button
                      onClick={() => onOpenShareModal(caste, trueRank)}
                      title="Share caste rank"
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-600/20 text-zinc-400 hover:text-emerald-400 border border-zinc-800 transition-colors"
                    >
                      <Share2 size={16} />
                    </button>

                    <button
                      onClick={() => onOpenCasteProfile(caste)}
                      title="View Profile"
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full h-1 bg-zinc-900 overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${percentOfLeader}%`,
                    backgroundColor: crestColor
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => onOpenAddCasteModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-amber-300 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/40 transition-all"
        >
          <PlusCircle size={15} className="text-amber-400" />
          <span>Don&apos;t see your caste or biradari? Add it to the war now</span>
        </button>
      </div>
    </div>
  );
};
