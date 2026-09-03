'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {  fetchApi , API_URL, BASE_URL } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Pie } from 'react-chartjs-2';
import { TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Trophy, Wallet, Swords, TicketCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const res = await fetch(`${API_URL}/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const responseData = await res.json();
                
                if (responseData.success) {
                    setData(responseData.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 pb-12 animate-pulse">
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
                
                <div className="h-72 bg-gray-200 rounded-xl mt-6"></div>
            </div>
        );
    }

    if (!data) return <div className="text-center p-12 text-gray-500">Failed to load dashboard data.</div>;

    const { user, wallet, analytics } = data;

    // Chart Data Configs
    const lineChartData = {
        labels: analytics.activity_timeline.labels,
        datasets: [
            {
                label: 'Deposits (PKR)',
                data: analytics.activity_timeline.deposits,
                borderColor: '#10b981', // green
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Contributions (Power)',
                data: analytics.activity_timeline.contributions,
                borderColor: '#D4AF37', // gold
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            }
        ],
    };

    const pieChartData = {
        labels: analytics.top_casts.labels,
        datasets: [{
            data: analytics.top_casts.data,
            backgroundColor: ['#D4AF37', '#9CA3AF', '#CD7F32', '#374151', '#111827'],
            borderWidth: 0
        }]
    };

    const doughnutChartData = {
        labels: analytics.ticket_distribution.labels,
        datasets: [{
            data: analytics.ticket_distribution.data,
            backgroundColor: ['#ef4444', '#3b82f6', '#10b981'],
            borderWidth: 0
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' as const, labels: { font: { size: 10 } } }
        }
    };

    const lineOptions = {
        ...commonOptions,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">My Headquarters</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">Welcome back, {user.name}!</p>
                </div>
                <div className="text-right">
                    <Link href="/casts" className="hidden sm:inline-flex bg-[var(--color-brand-black)] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors items-center shadow-md">
                        Find a Cast <ArrowUpRight size={14} className="ml-1" />
                    </Link>
                </div>
            </div>

            {/* Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Rank Card */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#111111] rounded-2xl p-6 shadow-xl relative overflow-hidden group border border-[#333]">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-[var(--color-metallic-gold)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center">
                                <Trophy size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> Global Rank
                            </p>
                            <h2 className="text-5xl font-black text-white drop-shadow-md">
                                {typeof user.rank === 'number' ? `#${user.rank}` : user.rank}
                            </h2>
                            <p className="text-[10px] text-[var(--color-metallic-gold)] mt-2 font-semibold">
                                {analytics.total_points_contributed.toLocaleString()} Total Power Contributed
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <Link href="/warriors" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-metallic-gold)] hover:text-[var(--color-brand-black)] text-white transition-all backdrop-blur-sm">
                                <ArrowUpRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* War Chest Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-off-white)_0%,_transparent_50%)] opacity-50 pointer-events-none"></div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center">
                                <Wallet size={14} className="mr-1.5 text-gray-500" /> War Chest Balance
                            </p>
                            <h2 className="text-4xl font-black text-[var(--color-metallic-gold)]">
                                PKR {parseFloat(wallet.balance).toLocaleString()}
                            </h2>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                Lifetime Deposits: PKR {parseFloat(wallet.total_deposited).toLocaleString()}
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <Link href="/dashboard/deposit" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[var(--color-brand-black)] hover:text-white text-gray-600 transition-all shadow-sm">
                                <TrendingUp size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Casts Pie Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                        <Swords size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> Contribution Portfolio
                    </h3>
                    {analytics.top_casts.labels.length > 0 ? (
                        <div className="flex-1 min-h-[200px] relative">
                            <Pie data={pieChartData} options={commonOptions} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-400">No battle data yet.</p>
                            <Link href="/casts" className="text-[10px] text-[var(--color-metallic-gold)] mt-1 font-bold hover:underline">Find a cast to support</Link>
                        </div>
                    )}
                </div>

                {/* Activity Timeline Line Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                        <span className="flex items-center"><Activity size={14} className="mr-1.5 text-[var(--color-metallic-gold)]" /> 7-Day Activity Timeline</span>
                    </h3>
                    <div className="flex-1 min-h-[200px] relative">
                        <Line data={lineChartData} options={lineOptions} />
                    </div>
                    <div className="flex justify-center space-x-6 mt-4 border-t border-gray-50 pt-4">
                        <div className="flex items-center text-[10px] font-bold text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Deposits
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-metallic-gold)] mr-2"></div> Contributions
                        </div>
                    </div>
                </div>

            </div>

            {/* Support Health & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Tickets Doughnut Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                        <TicketCheck size={14} className="mr-1.5 text-blue-500" /> Support Health
                    </h3>
                    {analytics.ticket_distribution.data.reduce((a:number, b:number) => a + b, 0) > 0 ? (
                        <div className="flex-1 min-h-[200px] relative">
                            <Doughnut data={doughnutChartData} options={commonOptions} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-400">No support tickets found.</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Command Center</h3>
                        <p className="text-sm text-gray-500 mb-6">Manage your wallet, discover new casts, and monitor your leaderboard standings from one central hub.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/deposit" className="bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 font-bold rounded-xl p-4 transition-colors text-center shadow-sm flex flex-col items-center justify-center h-24">
                            <Wallet size={20} className="mb-2 text-gray-500" />
                            <span className="text-xs">Add Funds</span>
                        </Link>
                        <Link href="/leaderboard" className="bg-[var(--color-brand-black)] hover:bg-gray-900 text-white font-bold rounded-xl p-4 transition-colors text-center shadow-sm flex flex-col items-center justify-center h-24 group">
                            <Trophy size={20} className="mb-2 text-[var(--color-metallic-gold)] group-hover:scale-110 transition-transform" />
                            <span className="text-xs">Leaderboard</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
