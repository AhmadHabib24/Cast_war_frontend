'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Loader2, Search, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminSeoPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetchApi('/admin/seo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.success) {
                setSettings(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-xl shadow-sm border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center">
                        <Search className="mr-2 text-amber-500" size={24} />
                        SEO Panel
                    </h1>
                    <p className="text-sm text-zinc-400 font-medium mt-1">Manage search engine optimization for all static pages.</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="text-xs text-zinc-300 uppercase bg-zinc-950 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-black">Page Name</th>
                                <th className="px-6 py-4 font-black">Route</th>
                                <th className="px-6 py-4 font-black">Title</th>
                                <th className="px-6 py-4 font-black">Status</th>
                                <th className="px-6 py-4 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {settings.map((setting) => (
                                <tr key={setting.id} className="hover:bg-zinc-800/50 transition">
                                    <td className="px-6 py-4 font-bold text-white">{setting.page_name}</td>
                                    <td className="px-6 py-4 text-xs font-mono bg-zinc-950/50 rounded px-2">{setting.route}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{setting.title || 'Not set'}</td>
                                    <td className="px-6 py-4">
                                        {setting.title && setting.description ? (
                                            <span className="bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">Optimized</span>
                                        ) : (
                                            <span className="bg-yellow-950/50 border border-yellow-900/50 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded">Needs Review</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/seo/${setting.id}`}>
                                            <button className="text-amber-500 hover:text-amber-400 p-2 hover:bg-zinc-800 rounded-lg transition inline-flex">
                                                <Edit size={16} />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
