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
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center">
                        <Search className="mr-2 text-[var(--color-metallic-gold)]" size={24} />
                        SEO Panel
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage search engine optimization for all static pages.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-black">Page Name</th>
                                <th className="px-6 py-4 font-black">Route</th>
                                <th className="px-6 py-4 font-black">Title</th>
                                <th className="px-6 py-4 font-black">Status</th>
                                <th className="px-6 py-4 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {settings.map((setting) => (
                                <tr key={setting.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">{setting.page_name}</td>
                                    <td className="px-6 py-4 text-xs font-mono bg-gray-100 rounded px-2">{setting.route}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{setting.title || 'Not set'}</td>
                                    <td className="px-6 py-4">
                                        {setting.title && setting.description ? (
                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">Optimized</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">Needs Review</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/seo/${setting.id}`}>
                                            <button className="text-[var(--color-metallic-gold)] hover:text-yellow-600 p-2 hover:bg-yellow-50 rounded-lg transition inline-flex">
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
