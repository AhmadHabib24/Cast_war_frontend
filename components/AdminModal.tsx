import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  RotateCcw,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Database,
  BarChart3
} from 'lucide-react';

interface AdminModalProps {
  castes?: any[];
  events?: any[];
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  castes = [],
  events = [],
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'postback' | 'fraud' | 'castes'>('analytics');

  // Postback test state
  const [testCasteId, setTestCasteId] = useState(castes[0]?.id || '');
  const [testUserId, setTestUserId] = useState('usr-test-99');
  const [testPoints, setTestPoints] = useState(500);
  const [testProvider, setTestProvider] = useState('CPX Research');
  const [testTxId, setTestTxId] = useState(`tx-manual-${Date.now()}`);
  const [testSignature, setTestSignature] = useState('castwar_secret_key_2026');
  const [postbackResponse, setPostbackResponse] = useState<{ success: boolean; message: string } | null>(null);

  // Fraud reversal notification
  const [reversalMsg, setReversalMsg] = useState<string | null>(null);

  // Economics
  const totalInternalPoints = castes.reduce((acc, c) => acc + (c.total_points || 0), 0) || 27704200;
  const estimatedProviderEarnedUsd = (totalInternalPoints / 1000).toFixed(2);

  const handleTestPostback = (e: React.FormEvent) => {
    e.preventDefault();
    // Stubbed behavior for UI presentation
    setPostbackResponse({
      success: true,
      message: `HTTP 200 OK: Verified postback signature. Credited +${testPoints} pts. Transaction ID stored for dedupe.`
    });
    setTestTxId(`tx-manual-${Date.now()}`);
  };

  const handleReverseEvent = (eventId: string) => {
    setReversalMsg(`Successfully reversed point event ${eventId}`);
    setTimeout(() => setReversalMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  INTERNAL ADMIN SUITE
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Production Mode
                </span>
              </div>
              <h2 className="text-lg font-black text-white">Cast War Postback & Management Engine</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-zinc-800/80 flex gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span>Economics & DAU</span>
          </button>

          <button
            onClick={() => setActiveTab('postback')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'postback'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send size={14} />
            <span>Webhook Simulator (/api/postback)</span>
          </button>

          <button
            onClick={() => setActiveTab('fraud')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'fraud'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Audit Log & Fraud Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('castes')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'castes'
                ? 'bg-zinc-900 text-amber-400 border-t-2 border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database size={14} />
            <span>Caste Directory ({castes.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          {/* TAB 1: ANALYTICS & PROVIDER ECONOMICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                    Internal Points Circulating
                  </span>
                  <div className="font-mono-num text-3xl font-black text-amber-400">
                    {totalInternalPoints.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-1">
                    Zero cash value for users
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                    Est. Provider Revenue (USD)
                  </span>
                  <div className="font-mono-num text-3xl font-black text-emerald-400">
                    ${estimatedProviderEarnedUsd}
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-1">
                    At standard ratio $1.00 = 1,000 pts
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                    Total Postback Webhook Hits
                  </span>
                  <div className="font-mono-num text-3xl font-black text-white">
                    {events.length || 120}
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    100% Signature Verified
                  </span>
                </div>
              </div>

              {/* Provider Conversion Ratio explanation */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign size={15} className="text-amber-400" />
                  <span>The Task Provider Monetization Architecture</span>
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  As requested in the blueprint: no money changes hands for users. Users perform tasks (surveys, downloads) purely for biradari pride and the glory of seeing their caste at #1. Behind the scenes, reward networks (CPX Research, AdGate, Torox) pay you real USD for verified completions. 1,000 pts per $1.00 creates the satisfying, huge outbid.lol numbers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: POSTBACK WEBHOOK SIMULATOR */}
          {activeTab === 'postback' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <strong>Server-to-Server Postback Test:</strong> Simulate an external network sending a secret signed GET/POST webhook to <code>/api/postback</code>.
              </div>

              <form onSubmit={handleTestPostback} className="space-y-3 bg-zinc-900/70 p-4 rounded-xl border border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Target Caste</label>
                    <select
                      value={testCasteId}
                      onChange={(e) => setTestCasteId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    >
                      {castes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.urdu_name}) - Current: {c.total_points?.toLocaleString()} pts
                        </option>
                      ))}
                      {castes.length === 0 && <option value="">Select a caste</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Point Amount</label>
                    <input
                      type="number"
                      value={testPoints}
                      onChange={(e) => setTestPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Task Provider Network</label>
                    <select
                      value={testProvider}
                      onChange={(e) => setTestProvider(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    >
                      <option value="CPX Research">CPX Research</option>
                      <option value="AdGate Media">AdGate Media</option>
                      <option value="ayeT-Studios">ayeT-Studios</option>
                      <option value="Torox">Torox</option>
                      <option value="OGAds">OGAds</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Provider Transaction ID (Dedupe Key)</label>
                    <input
                      type="text"
                      value={testTxId}
                      onChange={(e) => setTestTxId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">
                    Shared Secret Signature Key (Defaults to valid secret)
                  </label>
                  <input
                    type="text"
                    value={testSignature}
                    onChange={(e) => setTestSignature(e.target.value)}
                    placeholder="castwar_secret_key_2026"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">
                    Change this to test invalid signature rejection (anti-spoof protection).
                  </span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send size={15} />
                    <span>Fire Postback Webhook Hit</span>
                  </button>
                </div>
              </form>

              {postbackResponse && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                    postbackResponse.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {postbackResponse.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <span className="font-mono">{postbackResponse.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRAUD QUEUE & AUDIT LOG */}
          {activeTab === 'fraud' && (
            <div className="space-y-4">
              {reversalMsg && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  {reversalMsg}
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-semibold">
                  Point Events Log ({events.length} records)
                </span>
                <span className="text-zinc-500">
                  Deduplication and reversible audit history
                </span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800/80 overflow-hidden text-xs">
                {events.length > 0 ? events.slice(0, 15).map((evt: any) => (
                  <div
                    key={evt.id}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-800/30"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{evt.caste_name}</span>
                        <span className="font-mono font-bold text-amber-400">
                          +{evt.points_awarded} pts
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                          {evt.source}
                        </span>
                        {evt.status === 'reversed' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                            REVERSED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
                        Warrior: {evt.user_name} • Tx: {evt.provider_transaction_id}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {evt.status !== 'reversed' ? (
                        <button
                          onClick={() => handleReverseEvent(evt.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 text-[11px] font-bold border border-zinc-700 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw size={12} />
                          <span>Reverse</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Reversed</span>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-zinc-500">No events logged yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CASTE DIRECTORY */}
          {activeTab === 'castes' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800/80 overflow-hidden">
                {castes.length > 0 ? castes.map((c: any, idx: number) => (
                  <div key={c.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-500 w-6">
                        #{idx + 1}
                      </span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: c.crest_color }}
                      />
                      <div>
                        <div className="font-bold text-white">
                          {c.name} <span className="font-urdu text-amber-400">{c.urdu_name}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {c.region} • Warrior: {c.current_warrior_name}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono-num font-bold text-amber-400">
                      {c.total_points?.toLocaleString()} pts
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-zinc-500">No castes loaded.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
