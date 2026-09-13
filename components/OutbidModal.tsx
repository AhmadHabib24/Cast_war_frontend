'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Crown,
  Zap,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Share2,
  Flame,
  ArrowRight,
  AtSign,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { API_URL, BASE_URL } from '@/lib/api';

export interface OutbidModalProps {
  caste: any;
  currentUser: any;
  onClose: () => void;
  onOpenShareModal?: (caste: any, rank: number) => void;
  onSubmitContribution: (data: {
    amount: number;
    warriorName: string;
    email: string;
    instagram: string;
    tiktok: string;
    provider: string;
    senderRef: string;
    receiptFile: File | null;
  }) => Promise<any>;
}

export const OutbidModal: React.FC<OutbidModalProps> = ({
  caste,
  currentUser,
  onClose,
  onOpenShareModal,
  onSubmitContribution
}) => {
  const chiefLionName = caste.current_warrior_name || 'Chief Lion';
  const chiefLionPoints = caste.warrior_points || 1000;
  const runnerUpName = caste.runner_up_warrior_name || 'Challenger';
  const runnerUpPoints = caste.runner_up_warrior_points || Math.max(500, chiefLionPoints - 700);
  const gapToOvertake = Math.max(1, chiefLionPoints - runnerUpPoints);

  const [selectedAmount, setSelectedAmount] = useState<number>(gapToOvertake > 0 ? gapToOvertake : 1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  const [warriorName, setWarriorName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [instagram, setInstagram] = useState<string>('');
  const [tiktok, setTiktok] = useState<string>('');
  const [senderRef, setSenderRef] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const activeChannel = paymentMethods.find((c) => c.id === selectedProviderId);
  const effectiveAmount = customAmount ? Math.max(100, parseInt(customAmount, 10) || 0) : selectedAmount;

  React.useEffect(() => {
      const loadMethods = async () => {
          try {
              const res = await fetch(`${API_URL}/payment-methods`);
              const data = await res.json();
              if (data.success && data.data.length > 0) {
                  setPaymentMethods(data.data);
                  setSelectedProviderId(data.data[0].id);
              }
          } catch (err) {
              console.error('Failed to load payment methods', err);
          } finally {
              setLoadingMethods(false);
          }
      };
      loadMethods();
  }, []);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleConfirmOutbid = async () => {
    if (effectiveAmount < 100) {
      setError("Minimum contribution is Rs. 100");
      return;
    }
    if (!receiptFile) {
      setError("Please upload a payment screenshot (Snap) as proof.");
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      const outbidRes = await onSubmitContribution({
        amount: effectiveAmount,
        warriorName: warriorName.trim() || 'Pakistani Sher',
        email: email.trim(),
        instagram: instagram.trim().replace(/^@/, ''),
        tiktok: tiktok.trim().replace(/^@/, ''),
        provider: activeChannel ? activeChannel.name : '',
        senderRef: senderRef.trim(),
        receiptFile
      });

      setResult(outbidRes);
      setStatus('success');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF']
        });
      } catch {}
    } catch (err: any) {
      setStatus('idle');
      setError(err.message || 'Failed to submit contribution.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl my-auto bg-gradient-to-b from-[#141b22] via-[#0e1318] to-[#0a0d11] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-slate-100">
        
        {/* Subtle royal gold ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner bg-amber-500/20 text-amber-500 border-[1.5px] border-amber-500/60"
            >
              🦁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OUTBID • ADD WAR FUNDS
                </span>
                <span className="text-xs text-zinc-400 font-mono">1 PKR = 1 Point</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{caste.name}</span>
                <span className="font-urdu text-amber-400 font-bold text-base">{caste.urdu_name || ''}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">

          {status === 'success' && result && (
            <div className="space-y-6 py-4 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 border-2 border-yellow-200">
                ⚡
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SNAP UPLOADED • PENDING APPROVAL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  War Funds Successfully Submitted!
                </h3>
                <p className="text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                  Your contribution of <strong className="text-amber-400">Rs. {effectiveAmount.toLocaleString()}</strong> has been submitted. Points will be credited once an admin approves your payment snap.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm border border-zinc-800 transition-colors"
                >
                  Return to Leaderboard
                </button>
              </div>
            </div>
          )}

          {status !== 'success' && (
            <>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* 1. SELECT AMOUNT */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Select War Funds to Add</span>
                  <span className="text-[11px] font-normal text-amber-400 font-mono">1 PKR = 1 Point</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { amount: gapToOvertake, label: `Rs. ${gapToOvertake}`, badge: 'Overtake #1' },
                    { amount: 1000, label: 'Rs. 1,000', badge: '+1K Pts' },
                    { amount: 2500, label: 'Rs. 2,500', badge: '+2.5K Pts' },
                    { amount: 5000, label: 'Rs. 5,000', badge: 'Patron' },
                    { amount: 10000, label: 'Rs. 10,000', badge: 'Chieftain' },
                    { amount: 25000, label: 'Rs. 25,000', badge: 'Nawab' },
                  ].map((preset) => {
                    const isSelected = selectedAmount === preset.amount && !customAmount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => handlePresetSelect(preset.amount)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-black font-mono">{preset.label}</div>
                        <div className="text-[10px] font-semibold text-amber-400/90">{preset.badge}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative pt-1">
                  <input
                    type="number"
                    min="100"
                    placeholder="Or enter custom PKR amount (e.g. 750, 1500)..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {customAmount && (
                    <span className="absolute right-3 top-4 text-xs font-mono font-bold text-amber-400">
                      +{parseInt(customAmount || '0', 10).toLocaleString()} PTS
                    </span>
                  )}
                </div>
              </div>

              {/* 2. WARRIOR PROFILE */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Your Warrior Dossier</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Your Full / Warrior Name</label>
                    <input
                      type="text"
                      value={warriorName}
                      onChange={(e) => setWarriorName(e.target.value)}
                      placeholder="e.g. Ali (Hassan)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {!currentUser?.email && (
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Your Email Address</label>
                    <input
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="warrior@example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1">
                      <AtSign size={12} className="text-pink-400" />
                      <span>AtSign Handle</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-zinc-500 text-xs font-mono">@</span>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="ali_jutt_sher"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 flex items-center gap-1 mb-1">
                      <span>🎵</span>
                      <span>TikTok ID</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-zinc-500 text-xs font-mono">@</span>
                      <input
                        type="text"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="alijutt_official"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT METHOD & SNAP UPLOAD */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                  Select Payment Method & Upload Snap
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {loadingMethods ? (
                    <div className="col-span-full text-zinc-500 text-xs text-center py-2">Loading methods...</div>
                  ) : paymentMethods.length > 0 ? (
                    paymentMethods.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedProviderId(ch.id)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          selectedProviderId === ch.id
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                            : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-base">{ch.type === 'bank' ? '🏦' : '📱'}</div>
                        <div className="text-[11px] font-bold truncate">{ch.name}</div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full text-red-400 text-xs text-center py-2">No active payment methods.</div>
                  )}
                </div>

                {activeChannel && (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Account Title:</span>
                    <span className="font-bold text-white">{activeChannel.account_title}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{activeChannel.name} Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-400">{activeChannel.account_number}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeChannel.account_number)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Copy account number"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  {activeChannel.qr_code_path && (
                    <div className="text-center mt-2 border-t border-zinc-800/80 pt-2">
                      <span className="text-[11px] text-zinc-500 block mb-1">Scan QR</span>
                      <img src={`${BASE_URL}/storage/${activeChannel.qr_code_path}`} alt="QR Code" className="w-20 h-20 object-contain mx-auto rounded border border-zinc-700" />
                    </div>
                  )}

                  {copied && (
                    <div className="text-[10px] text-emerald-400 text-right font-semibold">
                      ✓ Copied to clipboard! Send Rs. {effectiveAmount.toLocaleString()} via {activeChannel.name}.
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-800/80">
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      Transaction ID (TID) / Sender Phone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TID-892187"
                      value={senderRef}
                      onChange={(e) => setSenderRef(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  {/* UPLOAD SNAP FIELD */}
                  <div className="pt-2">
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      Upload Payment Screenshot (Snap) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full flex items-center justify-center gap-2 px-3 py-4 rounded-lg border-2 border-dashed transition-all ${
                        receiptFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-900 group-hover:border-amber-500/50 group-hover:bg-amber-500/5'
                      }`}>
                        {receiptFile ? (
                          <>
                            <CheckCircle2 size={20} className="text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-300 truncate max-w-[200px]">{receiptFile.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload size={20} className="text-zinc-400 group-hover:text-amber-400 transition-colors" />
                            <span className="text-sm font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors">Tap to Upload Snap</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
                )}
              </div>

              {/* ACTION CONFIRM BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={status === 'processing'}
                  onClick={handleConfirmOutbid}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {status === 'processing' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Snap...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap size={18} className="fill-black" />
                      <span>Confirm & Upload Snap • Rs. {effectiveAmount.toLocaleString()}</span>
                      <ArrowRight size={16} />
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 mt-2">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Admin will verify snap before updating the leaderboard</span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
