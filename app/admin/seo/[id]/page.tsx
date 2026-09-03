'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi, API_URL } from '@/lib/api';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Search, CheckCircle, AlertTriangle, XCircle, Globe, Smartphone, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminSeoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [setting, setSetting] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [ogTitle, setOgTitle] = useState('');
    const [ogDescription, setOgDescription] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [ogImageFile, setOgImageFile] = useState<File | null>(null);
    const [ogImagePreview, setOgImagePreview] = useState('');

    // Previews
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

    // Analyzer Scores
    const [seoScore, setSeoScore] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadSetting();
    }, [id]);

    const loadSetting = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi(`/admin/seo/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                const data = res.data;
                setSetting(data);
                setTitle(data.title || '');
                setDescription(data.description || '');
                setTargetKeyword(data.target_keyword || '');
                setOgTitle(data.og_title || '');
                setOgDescription(data.og_description || '');
                setCanonicalUrl(data.canonical_url || '');
                if (data.og_image) {
                    setOgImagePreview(`${API_URL.replace('/api/v1', '')}/${data.og_image}`);
                }
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to load SEO setting.');
            router.push('/admin/seo');
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic SEO Score
    useEffect(() => {
        let score = 0;
        
        // 1. Title checks (Max 25 pts)
        if (title.length > 0) score += 5;
        if (title.length >= 30 && title.length <= 60) score += 20;
        else if (title.length > 60) score += 10; // Truncated but exists
        
        // 2. Description checks (Max 25 pts)
        if (description.length > 0) score += 5;
        if (description.length >= 70 && description.length <= 160) score += 20;
        else if (description.length > 160) score += 10;
        
        // 3. Target Keyword checks (Max 30 pts)
        if (targetKeyword) {
            const keywordLower = targetKeyword.toLowerCase();
            if (title.toLowerCase().includes(keywordLower)) score += 15;
            if (description.toLowerCase().includes(keywordLower)) score += 15;
        } else {
            score += 10; // Default points if no keyword specified so it doesn't look totally broken
        }

        // 4. OG checks (Max 20 pts)
        if (ogImagePreview || ogImageFile) score += 10;
        if (ogTitle || title) score += 5;
        if (ogDescription || description) score += 5;

        setSeoScore(score);
    }, [title, description, targetKeyword, ogTitle, ogDescription, ogImagePreview, ogImageFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            setOgImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOgImagePreview(reader.result as string);
                
                // Aspect ratio check
                const img = new Image();
                img.onload = () => {
                    const ratio = img.width / img.height;
                    if (ratio < 1.8 || ratio > 2.0) { // Targeting 1.91:1
                        toast.error("Warning: For optimal social sharing, OG Image aspect ratio should be 1.91:1 (e.g., 1200x630px).", { duration: 5000 });
                    }
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('target_keyword', targetKeyword);
            formData.append('og_title', ogTitle);
            formData.append('og_description', ogDescription);
            formData.append('canonical_url', canonicalUrl);
            if (ogImageFile) {
                formData.append('og_image_file', ogImageFile);
            }

            const res = await fetch(`${API_URL}/admin/seo/${id}`, {
                method: 'POST', // using POST for FormData in Laravel
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('SEO Settings saved successfully!');
            } else {
                throw new Error(data.message || 'Error saving settings.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/seo" className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Edit SEO: {setting?.page_name}</h1>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{setting?.route}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Overall SEO Score</div>
                        <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${seoScore >= 80 ? 'bg-green-500' : seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${seoScore}%` }}
                                ></div>
                            </div>
                            <span className={`text-sm font-black ${seoScore >= 80 ? 'text-green-600' : seoScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {seoScore}/100
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[var(--color-brand-black)] hover:bg-gray-800 text-[var(--color-metallic-gold)] font-bold text-sm rounded-lg shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>Save</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Edit Form */}
                <div className="space-y-6">
                    
                    {/* Basic Meta Data */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center">
                            <Search size={16} className="mr-2 text-[var(--color-metallic-gold)]" /> Standard Meta Tags
                        </h3>
                        
                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Meta Title</label>
                                <span className={`text-[10px] font-bold ${title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {title.length} / 60
                                </span>
                            </div>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition ${title.length > 60 ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[var(--color-metallic-gold)]'}`}
                                placeholder="Enter page title"
                            />
                            {title.length > 60 && <p className="text-[10px] text-red-500 mt-1 font-bold">Title is too long. It will be truncated on Google Search.</p>}
                        </div>

                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Meta Description</label>
                                <span className={`text-[10px] font-bold ${description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {description.length} / 160
                                </span>
                            </div>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition ${description.length > 160 ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[var(--color-metallic-gold)]'}`}
                                placeholder="Enter page description"
                            />
                            {description.length > 160 && <p className="text-[10px] text-red-500 mt-1 font-bold">Description is too long. Keep it under 160 characters.</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Target Keyword (Internal Use)</label>
                            <input 
                                type="text" 
                                value={targetKeyword}
                                onChange={(e) => setTargetKeyword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)] transition"
                                placeholder="e.g. cast war leaderboard"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Canonical URL (Optional)</label>
                            <input 
                                type="url" 
                                value={canonicalUrl}
                                onChange={(e) => setCanonicalUrl(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)] transition"
                                placeholder="https://castwar.com/route"
                            />
                        </div>
                    </div>

                    {/* Open Graph Tags */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center">
                            <Globe size={16} className="mr-2 text-[var(--color-metallic-gold)]" /> Open Graph (Social Sharing)
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">If left blank, standard Meta Title and Description will be used.</p>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">OG Title</label>
                            <input 
                                type="text" 
                                value={ogTitle}
                                onChange={(e) => setOgTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)] transition"
                                placeholder={title || "Enter OG Title"}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wider">OG Description</label>
                            <textarea 
                                value={ogDescription}
                                onChange={(e) => setOgDescription(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--color-metallic-gold)] transition"
                                placeholder={description || "Enter OG Description"}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wider">OG Image</label>
                            
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-metallic-gold)] hover:bg-gray-50 transition min-h-[120px]"
                            >
                                {ogImagePreview ? (
                                    <div className="relative w-full">
                                        <img src={ogImagePreview} alt="OG Preview" className="w-full h-auto rounded-lg object-cover max-h-48" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center rounded-lg">
                                            <span className="text-white text-sm font-bold">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon size={32} className="text-gray-300 mb-2" />
                                        <span className="text-sm font-bold text-gray-500">Click to upload (1200x630px recommended)</span>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                </div>

                {/* Advanced SEO Analyzer Previews */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center">
                                <Search size={16} className="mr-2 text-[var(--color-metallic-gold)]" /> SERP Preview
                            </h3>
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setPreviewMode('mobile')}
                                    className={`p-1.5 rounded-md transition ${previewMode === 'mobile' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Smartphone size={16} />
                                </button>
                                <button 
                                    onClick={() => setPreviewMode('desktop')}
                                    className={`p-1.5 rounded-md transition ${previewMode === 'desktop' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Monitor size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Google Preview */}
                        <div className={`mx-auto ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}>
                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                        <img src="/cast-war-logo.png" alt="logo" className="w-4 h-4 object-contain" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#202124] font-sans">Cast War</div>
                                        <div className="text-[11px] text-[#4d5156] font-sans truncate">{canonicalUrl || `https://castwar.com${setting?.route}`}</div>
                                    </div>
                                </div>
                                <div className="text-[20px] text-[#1a0dab] font-sans mb-1 hover:underline cursor-pointer leading-snug">
                                    {title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'Page Title Here'}
                                </div>
                                <div className="text-[14px] text-[#4d5156] font-sans leading-snug break-words">
                                    {description ? (description.length > 160 ? description.substring(0, 160) + '...' : description) : 'This is where your meta description will appear on Google search results...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                         <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center">
                            <Globe size={16} className="mr-2 text-[var(--color-metallic-gold)]" /> Social Share Preview (Facebook / LinkedIn)
                        </h3>
                        
                        <div className="max-w-[500px] mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="w-full h-[261px] bg-gray-100 flex items-center justify-center relative border-b border-gray-200 overflow-hidden">
                                {ogImagePreview ? (
                                    <img src={ogImagePreview} alt="OG" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-300" />
                                )}
                            </div>
                            <div className="p-3 bg-gray-50/50">
                                <div className="text-[12px] text-gray-500 uppercase font-sans mb-1">castwar.com</div>
                                <div className="text-[16px] font-bold text-gray-900 font-sans leading-tight mb-1 truncate">
                                    {ogTitle || title || 'Open Graph Title'}
                                </div>
                                <div className="text-[14px] text-gray-600 font-sans truncate">
                                    {ogDescription || description || 'Open Graph description will appear here...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                            Analyzer Results
                        </h3>
                        
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                {title.length >= 30 && title.length <= 60 ? (
                                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <span className="text-xs font-bold text-gray-900 block">Title Length</span>
                                    <span className="text-[10px] text-gray-500">
                                        {title.length < 30 ? "Too short. Aim for at least 30 characters." : title.length > 60 ? "Too long. It will be truncated." : "Optimal length."}
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                {description.length >= 70 && description.length <= 160 ? (
                                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <span className="text-xs font-bold text-gray-900 block">Description Length</span>
                                    <span className="text-[10px] text-gray-500">
                                        {description.length < 70 ? "Too short. Aim for at least 70 characters." : description.length > 160 ? "Too long. It will be truncated." : "Optimal length."}
                                    </span>
                                </div>
                            </li>
                            {targetKeyword && (
                                <li className="flex items-start space-x-3">
                                    {title.toLowerCase().includes(targetKeyword.toLowerCase()) ? (
                                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <span className="text-xs font-bold text-gray-900 block">Keyword in Title</span>
                                        <span className="text-[10px] text-gray-500">Does your target keyword appear in the title?</span>
                                    </div>
                                </li>
                            )}
                            <li className="flex items-start space-x-3">
                                {ogImagePreview ? (
                                    <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <span className="text-xs font-bold text-gray-900 block">Open Graph Image</span>
                                    <span className="text-[10px] text-gray-500">Missing OG image will result in poor social sharing previews.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
