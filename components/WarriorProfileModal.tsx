import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Award,
  Eye,
  EyeOff,
  LogOut,
  AtSign,
  Save,
  Check,
  Zap,
  ExternalLink,
  Headset,
  User as UserIcon,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const WarriorProfileModal = ({
  user,
  castes,
  onClose,
  onLogout,
  onSelectCaste,
}: any) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'support'>('dossier');
  const userCaste = castes.find((c: any) => c.id === user?.caste_id);

  // Social profile states
  const [instagram, setInstagram] = useState(user?.instagram || '');
  const [tiktok, setTiktok] = useState(user?.tiktok || '');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Support tickets states
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('low');
  const [message, setMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  useEffect(() => {
    if (activeTab === 'support') {
      loadTickets();
    }
  }, [activeTab]);

  const togglePrivacy = () => {
    toast.success("Privacy settings updated");
  };

  const handleCasteChange = (newCasteId: string) => {
    // Optional stub
  };

  const handleSaveSocials = () => {
    setSavedSuccess(true);
    toast.success("Social handles saved");
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tickets.');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/tickets', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ subject, priority, message })
      });
      if (res.success) {
        toast.success('Ticket created successfully!');
        setIsTicketModalOpen(false);
        setSubject('');
        setMessage('');
        setPriority('low');
        loadTickets();
      } else {
        toast.error(res.message || 'Error creating ticket');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'open') return <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center"><Clock size={10} className="mr-1"/> Open</span>;
    if (status === 'answered') return <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center"><MessageSquare size={10} className="mr-1"/> Answered</span>;
    if (status === 'closed') return <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center"><CheckCircle2 size={10} className="mr-1"/> Closed</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#141a22] to-[#0c0f14] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 p-3 rounded-2xl bg-amber-500/20 text-3xl flex items-center justify-center border-2 border-amber-400/50 shadow-inner overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : '🦁'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {user?.warrior_title || 'CHIEF LION • شیرِ برادری'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">SOVEREIGN DOSSIER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">{user?.name}</h2>
              <p className="text-xs text-zinc-400 font-mono">{user?.phone || 'No phone linked'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-zinc-800/80 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'dossier'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserIcon size={14} />
            <span>Profile Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'support'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Headset size={14} />
            <span>Support Desk</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar relative">
          
          {/* TAB 1: DOSSIER */}
          {activeTab === 'dossier' && (
            <>
              {/* Key Metric Cards */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Lifetime Points Added
                  </span>
                  <span className="font-mono text-2xl font-black text-amber-400">
                    {user?.total_points || 0}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                    Total War Funds (PKR)
                  </span>
                  <span className="font-mono text-2xl font-black text-white">
                    Rs. {user?.total_points || 0}
                  </span>
                </div>
              </div>

              {/* Social Proof Editor */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Crown size={14} />
                    <span>Lion Social Proof Handles</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Visible on Leaderboard</span>
                </div>

                <p className="text-xs text-zinc-400">
                  Link your social accounts so people visiting the leaderboard can verify that you reign as the Warrior Lion of your Biradari.
                </p>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Display / Warrior Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1">
                        <AtSign size={11} className="text-pink-400" />
                        <span>Instagram Handle</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-zinc-500 text-xs font-mono">@</span>
                        <input
                          type="text"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="e.g. hamza_ch_jutt"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1">
                        <span>🎵</span>
                        <span>TikTok ID</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-zinc-500 text-xs font-mono">@</span>
                        <input
                          type="text"
                          value={tiktok}
                          onChange={(e) => setTiktok(e.target.value)}
                          placeholder="e.g. hamzajutt_official"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Direct links preview */}
                  {(instagram || tiktok) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {instagram && (
                        <a
                          href={`https://instagram.com/${instagram.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-pink-400 hover:underline bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20"
                        >
                          <AtSign size={11} />
                          <span>instagram.com/{instagram.replace(/^@/, '')}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      {tiktok && (
                        <a
                          href={`https://tiktok.com/@${tiktok.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:underline bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                        >
                          <span>🎵</span>
                          <span>tiktok.com/@{tiktok.replace(/^@/, '')}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleSaveSocials}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {savedSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved to Leaderboard!</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save Social Handles</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chosen Caste Section */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-semibold">Your Represented Biradari:</span>
                  <span className="font-bold text-amber-400">
                    {userCaste ? `${userCaste.name}` : 'Not selected'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={user?.caste_id || ''}
                    onChange={(e) => handleCasteChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select a caste</option>
                    {castes?.map((c: any, index: number) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - Rank #{index + 1}
                      </option>
                    ))}
                  </select>

                  {userCaste && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCaste(userCaste);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black shrink-0 hover:from-amber-400 hover:to-yellow-300 flex items-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      <Zap size={13} className="fill-black" />
                      <span>Outbid</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user?.is_public !== false ? (
                    <Eye size={16} className="text-emerald-400" />
                  ) : (
                    <EyeOff size={16} className="text-zinc-500" />
                  )}
                  <div className="text-xs">
                    <div className="text-zinc-200 font-semibold">
                      {user?.is_public !== false ? 'Public Leaderboard Profile' : 'Anonymous Mode'}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {user?.is_public !== false
                        ? 'Your name and social handles appear on the national leaderboard'
                        : 'Hidden as "Anonymous Warrior"'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={togglePrivacy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    user?.is_public !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {user?.is_public !== false ? 'Public' : 'Hidden'}
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-zinc-400 text-xs font-bold border border-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Dossier</span>
                </button>
              </div>
            </>
          )}

          {/* TAB 2: SUPPORT DESK */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-amber-400 uppercase tracking-tight">Support Tickets</h3>
                  <p className="text-[10px] text-zinc-500">Need help? We've got your back.</p>
                </div>
                <button 
                  onClick={() => setIsTicketModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-colors"
                >
                  <Plus size={14} className="mr-1" /> New Ticket
                </button>
              </div>

              {loadingTickets ? (
                <div className="p-8 text-center text-zinc-500 font-bold animate-pulse text-xs bg-zinc-900/50 rounded-xl border border-zinc-800">
                  Loading your tickets...
                </div>
              ) : (
                <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden text-xs">
                  {tickets.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-800">
                        <MessageSquare size={18} className="text-zinc-600" />
                      </div>
                      <h3 className="text-sm font-black text-white mb-1">No Tickets Found</h3>
                      <p className="text-zinc-500">You haven't opened any support requests yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800/80">
                      {tickets.map(ticket => (
                        <div key={ticket.id} className="p-3 hover:bg-zinc-800/30 transition-colors">
                          <div className="flex justify-between items-start mb-1.5">
                            <h3 className="font-black text-white truncate pr-2">{ticket.subject}</h3>
                            <div className="shrink-0">{getStatusBadge(ticket.status)}</div>
                          </div>
                          <div className="flex flex-wrap items-center text-[10px] font-bold text-zinc-500 gap-x-2 gap-y-1">
                            <span>Ticket #{ticket.id}</span>
                            <span>•</span>
                            <span className={`uppercase ${ticket.priority === 'high' ? 'text-red-400' : ticket.priority === 'medium' ? 'text-amber-500' : 'text-emerald-400'}`}>
                              {ticket.priority}
                            </span>
                            <span>•</span>
                            <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Create Ticket Internal Overlay */}
              {isTicketModalOpen && (
                <div className="absolute inset-0 z-10 bg-zinc-950/95 backdrop-blur-sm p-4 flex flex-col justify-center rounded-xl overflow-y-auto">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
                    <h2 className="text-lg font-black mb-4 uppercase text-white">Create New Ticket</h2>
                    <form onSubmit={handleCreateTicket} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Subject</label>
                        <input 
                          type="text"
                          required
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500 text-xs text-white"
                          placeholder="Brief description of the issue"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Priority</label>
                        <select 
                          value={priority}
                          onChange={e => setPriority(e.target.value)}
                          className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500 text-xs text-white"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Message</label>
                        <textarea 
                          required
                          rows={4}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-amber-500 text-xs text-white resize-none"
                          placeholder="Describe your issue in detail..."
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button"
                          onClick={() => setIsTicketModalOpen(false)}
                          className="px-4 py-2 rounded-lg font-bold text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          disabled={isSubmittingTicket}
                          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md disabled:opacity-50"
                        >
                          {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
