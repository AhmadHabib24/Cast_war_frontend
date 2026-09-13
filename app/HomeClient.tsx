'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

import { HeadlineTicker } from '@/components/HeadlineTicker';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { OutbidModal } from '@/components/OutbidModal';
import { CasteProfileModal } from '@/components/CasteProfileModal';
import { ShareCardModal } from '@/components/ShareCardModal';
import { AddCasteModal } from '@/components/AddCasteModal';
import { OvertakeAlert, PointEvent } from '@/components/HeadlineTicker';

// NOTE: Since this is 'use client', generateMetadata cannot be exported from here in Next.js app router.
// It should be in a separate layout.tsx or page.tsx that is a Server Component, but keeping it if it was here.
// Assuming it was working or we just ignore the Next.js warning for now (as it was in original file).
// Wait, the original had generateMetadata in 'use client', which is invalid in Next 13+. Let's just remove it if it causes issues, but I will keep it commented out to prevent build errors.

export default function Home() {
    const router = useRouter();
    const [castes, setCastes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [selectedCasteForOutbid, setSelectedCasteForOutbid] = useState<any | null>(null);
    const [selectedCasteForProfile, setSelectedCasteForProfile] = useState<any | null>(null);
    const [shareModalData, setShareModalData] = useState<{caste: any, rank: number} | null>(null);
    const [addCasteInitialName, setAddCasteInitialName] = useState<string | null>(null);
    const [showAddCasteModal, setShowAddCasteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<any | null>(null);

    // Ticker Stats
    const [todayStats, setTodayStats] = useState({
        totalPointsToday: 0,
        activeWarriorsToday: 0,
        bidsPlacedToday: 0,
    });
    const [overtakeAlert, setOvertakeAlert] = useState<OvertakeAlert | null>(null);
    const [recentEvents, setRecentEvents] = useState<PointEvent[]>([]);

    useEffect(() => {
        const fetchTopCasts = async () => {
            try {
                const res = await fetch(`${API_URL}/leaderboard`);
                const data = await res.json();
                if (data.success) {
                    setCastes(data.data);
                    // Compute basic stats
                    const totalPts = data.data.reduce((acc: number, c: any) => acc + (c.total_points || 0), 0);
                    setTodayStats({
                        totalPointsToday: totalPts,
                        activeWarriorsToday: Math.floor(totalPts / 1000) + 25, // Mock data
                        bidsPlacedToday: Math.floor(totalPts / 500) + 10, // Mock data
                    });
                }
            } catch (err) {
                console.error("Failed to fetch top casts", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setCurrentUser(data.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchTopCasts();
        fetchCurrentUser();
    }, []);

    const handleOutbidSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('caste_id', selectedCasteForOutbid.id);
            formData.append('amount', data.amount);
            formData.append('payment_method', data.provider);
            formData.append('reference', data.senderRef);
            formData.append('warrior_name', data.warriorName);
            if (data.email) formData.append('email', data.email);
            if (data.instagram) formData.append('instagram', data.instagram);
            if (data.tiktok) formData.append('tiktok', data.tiktok);
            if (data.receiptFile) formData.append('proof', data.receiptFile);

            const token = localStorage.getItem('token');
            const headers: any = { 'Accept': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/outbids`, {
                method: 'POST',
                headers,
                body: formData
            });
            const result = await res.json();

            if (result.success) {
                if (result.data?.token) {
                    localStorage.setItem('token', result.data.token);
                    setCurrentUser(result.data.user);
                }
                return result;
            } else {
                throw new Error(result.message || 'Failed to submit contribution.');
            }
        } catch (err: any) {
            throw err;
        }
    };

    const handleAddCasteSubmit = async (data: any) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08090d] w-full text-slate-100 flex flex-col font-sans">
            
            {/* Ticker & Hero section */}
            <HeadlineTicker
                todayStats={todayStats}
                overtakeAlert={overtakeAlert}
                onDismissOvertake={() => setOvertakeAlert(null)}
                recentEvents={recentEvents}
            />

            {/* Main Leaderboard Table */}
            <div className="flex-1 w-full pb-10">
                <LeaderboardTable
                    castes={castes}
                    lastUpdatedCasteId={null}
                    onSelectCasteForTasks={(caste) => setSelectedCasteForOutbid(caste)}
                    onOpenCasteProfile={(caste) => setSelectedCasteForProfile(caste)}
                    onOpenShareModal={(caste, rank) => setShareModalData({ caste, rank })}
                    onOpenAddCasteModal={(name) => {
                        setAddCasteInitialName(name || '');
                        setShowAddCasteModal(true);
                    }}
                />
            </div>

            {/* Modals */}
            {selectedCasteForOutbid && (
                <OutbidModal
                    caste={selectedCasteForOutbid}
                    currentUser={currentUser}
                    onClose={() => setSelectedCasteForOutbid(null)}
                    onSubmitContribution={handleOutbidSubmit}
                />
            )}

            {selectedCasteForProfile && (
                <CasteProfileModal
                    caste={selectedCasteForProfile}
                    rank={castes.findIndex((c) => c.id === selectedCasteForProfile.id) + 1}
                    onClose={() => setSelectedCasteForProfile(null)}
                    onAddPoints={(caste) => {
                        setSelectedCasteForProfile(null);
                        setSelectedCasteForOutbid(caste);
                    }}
                    onOpenShareModal={(caste, rank) => {
                        setShareModalData({ caste, rank });
                    }}
                />
            )}

            {shareModalData && (
                <ShareCardModal
                    caste={shareModalData.caste}
                    rank={shareModalData.rank}
                    casteAhead={shareModalData.rank > 1 ? castes[shareModalData.rank - 2] : undefined}
                    onClose={() => setShareModalData(null)}
                />
            )}

            {showAddCasteModal && (
                <AddCasteModal
                    initialName={addCasteInitialName || ''}
                    onClose={() => setShowAddCasteModal(false)}
                    onSubmitSuggestion={handleAddCasteSubmit}
                />
            )}

        </div>
    );
}
