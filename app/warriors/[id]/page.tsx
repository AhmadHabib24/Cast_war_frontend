import WarriorsDetailClient from './WarriorsDetailClient';
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

type Props = {
    params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const res = await fetch(`${API_URL}/warriors/${params.id}`, {
            next: { revalidate: 30 }
        });
        const data = await res.json();

        if (data.success && data.data) {
            const warrior = data.data;
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const title = `Check out ${warrior.name}'s Profile on Cast War!`;
            const description = `${warrior.name} has contributed a total of ${warrior.total_points ? warrior.total_points.toLocaleString() : 0} Power to the war. Join them on the battlefield!`;
            
            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    url: `${baseUrl}/warriors/${warrior.id}`,
                    siteName: 'Cast War',
                    images: [
                        {
                            url: warrior.profile?.avatar ? `${API_URL.replace('/api/v1', '')}/${warrior.profile.avatar}` : `${baseUrl}/cast-war-logo.png`,
                            width: 1200,
                            height: 630,
                            alt: warrior.name,
                        }
                    ],
                    type: 'profile',
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [warrior.profile?.avatar ? `${API_URL.replace('/api/v1', '')}/${warrior.profile.avatar}` : `${baseUrl}/cast-war-logo.png`],
                }
            };
        }
    } catch (e) {
        console.error("Failed to generate metadata for warrior", e);
    }
    
    return {
        title: "Warrior Profile | Cast War",
        description: "View warrior statistics and history."
    };
}

export default function WarriorDetailPage({ params }: Props) {
    return <WarriorsDetailClient />;
}
