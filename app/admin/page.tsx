'use client';

import { useEffect, useState } from 'react';
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
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Users, Swords, CreditCard, Wallet, Activity, ShieldAlert, CheckCircle2, Trophy } from 'lucide-react';
import { API_URL, BASE_URL } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/admin/dashboard`, {
                    headers: { 
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const responseData = await res.json();
                if (responseData.success) {
                    setData(responseData.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 bg-zinc-800 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-zinc-800 rounded w-96"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5 flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 shrink-0"></div>
                            <div className="w-full">
                                <div className="h-3 bg-zinc-800 rounded w-20 mb-2"></div>
                                <div className="h-6 bg-zinc-800 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                            <div className="h-4 bg-zinc-800 rounded w-48 mb-6"></div>
                            <div className="h-64 bg-zinc-800/50 rounded-lg w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-zinc-400">Failed to load analytics data.</div>;

    const { kpis, charts } = data;

    // Chart Options
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } }
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const, labels: { color: '#a1a1aa' } }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Platform Analytics</h1>
                    <p className="text-sm text-zinc-400 font-medium mt-1">Real-time overview of the Cast War battlefield.</p>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-5 flex items-center space-x-4 hover:border-zinc-700 transition">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Users className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-2xl font-black text-white leading-none">{kpis.total_users.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-5 flex items-center space-x-4 hover:border-zinc-700 transition">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Swords className="text-purple-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Active Casts</p>
                        <p className="text-2xl font-black text-white leading-none">{kpis.active_casts.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-5 flex items-center space-x-4 hover:border-zinc-700 transition">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Wallet className="text-emerald-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Economy</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">{formatMoney(kpis.total_economy)}</p>
                    </div>
                </div>
                
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-5 flex items-center space-x-4 hover:border-zinc-700 transition">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                        <CreditCard className="text-orange-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Pending Dep.</p>
                        <p className="text-2xl font-black text-white leading-none">{kpis.pending_deposits.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-5 flex items-center space-x-4 hover:border-zinc-700 transition">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                        <Activity className="text-rose-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Open Tickets</p>
                        <p className="text-2xl font-black text-white leading-none">{kpis.open_tickets.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Trend */}
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
                        <Activity size={16} className="mr-2 text-emerald-400" /> 7-Day Revenue Trend
                    </h3>
                    <div className="h-72">
                        <Line 
                            options={lineOptions} 
                            data={{
                                labels: charts.revenue_trend.labels,
                                datasets: [{
                                    label: 'Approved Deposits (PKR)',
                                    data: charts.revenue_trend.data,
                                    borderColor: '#10b981',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            }} 
                        />
                    </div>
                </div>

                {/* Platform Health */}
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
                        <ShieldAlert size={16} className="mr-2 text-orange-400" /> Pending Workload
                    </h3>
                    <div className="h-72">
                        <Bar 
                            options={barOptions} 
                            data={{
                                labels: charts.platform_health.labels,
                                datasets: [{
                                    label: 'Pending Items',
                                    data: charts.platform_health.data,
                                    backgroundColor: [
                                        'rgba(249, 115, 22, 0.7)',
                                        'rgba(59, 130, 246, 0.7)',
                                        'rgba(168, 85, 247, 0.7)',
                                        'rgba(225, 29, 72, 0.7)',
                                    ],
                                    borderRadius: 4
                                }]
                            }} 
                        />
                    </div>
                </div>

                {/* Ticket Distribution */}
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
                        <CheckCircle2 size={16} className="mr-2 text-blue-400" /> Ticket Status Distribution
                    </h3>
                    <div className="h-64">
                        <Doughnut 
                            options={pieOptions} 
                            data={{
                                labels: charts.ticket_distribution.labels,
                                datasets: [{
                                    data: charts.ticket_distribution.data,
                                    backgroundColor: [
                                        'rgba(239, 68, 68, 0.8)',   // Open (Red)
                                        'rgba(59, 130, 246, 0.8)',  // Answered (Blue)
                                        'rgba(16, 185, 129, 0.8)',  // Closed (Green)
                                    ],
                                    borderWidth: 0
                                }]
                            }} 
                        />
                    </div>
                </div>

                {/* Top Casts */}
                <div className="bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-800 p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
                        <Trophy size={16} className="mr-2 text-amber-500" /> Top 5 Casts (Power)
                    </h3>
                    <div className="h-64">
                        <Pie 
                            options={pieOptions} 
                            data={{
                                labels: charts.top_casts.labels,
                                datasets: [{
                                    data: charts.top_casts.data,
                                    backgroundColor: [
                                        'rgba(245, 158, 11, 0.8)',  // Amber (Gold)
                                        'rgba(161, 161, 170, 0.8)', // Zinc 400 (Silver)
                                        'rgba(180, 83, 9, 0.8)',    // Amber 700 (Bronze)
                                        'rgba(63, 63, 70, 0.8)',    // Zinc 700
                                        'rgba(82, 82, 91, 0.8)',    // Zinc 600
                                    ],
                                    borderWidth: 1,
                                    borderColor: '#18181b' // Zinc 900
                                }]
                            }} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
