'use client';
import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

interface AddCasteModalProps {
  initialName?: string;
  onClose: () => void;
  onSubmitSuggestion: (data: any) => Promise<any>;
}

const COLOR_PRESETS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export const AddCasteModal: React.FC<AddCasteModalProps> = ({
  initialName = '',
  onClose,
  onSubmitSuggestion,
}) => {
  const [name, setName] = useState(initialName);
  const [urduName, setUrduName] = useState('');
  const [region, setRegion] = useState('Punjab');
  const [crestColor, setCrestColor] = useState(COLOR_PRESETS[1]);
  const [tagline, setTagline] = useState('');
  const [history, setHistory] = useState('');

  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus('processing');
    try {
      await onSubmitSuggestion({
        name: name.trim(),
        urdu_name: urduName.trim() || name.trim(),
        region,
        crest_color: crestColor,
        tagline: tagline.trim() || 'Pride of Pakistan • برادری کی آن',
        historical_note: history.trim() || 'Community-submitted biradari.',
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Community Submission
            </span>
            <h2 className="text-xl font-black text-white">Add Your Caste / Biradari</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/30">
              ✓
            </div>
            <h3 className="text-xl font-black text-white">Submission Received!</h3>
            <p className="text-sm text-zinc-400">
              Our admins will verify your request and add it to the national leaderboard shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Caste Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gondal, Sial, Kharal, Memon..."
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Urdu / Shahmukhi Script (اردو نام)
              </label>
              <input
                type="text"
                value={urduName}
                onChange={(e) => setUrduName(e.target.value)}
                placeholder="مثال: گوندل، سیال، کھرل"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-urdu focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Region / Province</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Kashmir / Potohar">Kashmir / Potohar</option>
                  <option value="Overseas Pakistanis">Overseas Pakistanis</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Crest Banner Color</label>
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCrestColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        crestColor === color ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Biradari Motto or Slogan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Lions of Gujrat • غیرت اور وفاداری"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Historical Heritage Note
              </label>
              <textarea
                rows={2}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="Tell other warriors the history and honor of this caste..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'processing'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'processing' ? (
                  <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                ) : (
                  <>
                    <PlusCircle size={17} />
                    <span>Launch This Caste into Cast War</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
