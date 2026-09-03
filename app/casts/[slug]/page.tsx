import CastsDetailClient from './CastsDetailClient';
import { Metadata } from 'next';
import { API_URL } from '@/lib/api';

type Props = {
    params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const res = await fetch(`${API_URL}/casts/${params.slug}`, {
            next: { revalidate: 30 } // fetch cast data, revalidate 30s
        });
        const data = await res.json();

        if (data.success && data.data) {
            const cast = data.data;
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const title = `Vote for ${cast.name} in Cast War!`;
            const description = `${cast.name} is currently ranked #${cast.current_rank || 'Unranked'} with ${cast.total_points.toLocaleString()} Power. Join the war and boost your cast today!`;
            
            return {
                title,
                description,
                openGraph: {
                    title,
                    description,
                    url: `${baseUrl}/casts/${cast.slug}`,
                    siteName: 'Cast War',
                    images: [
                        {
                            url: `${baseUrl}/cast-war-logo.png`, // We don't have custom cast images yet, fallback to logo
                            width: 1200,
                            height: 630,
                            alt: cast.name,
                        }
                    ],
                    type: 'article',
                },
                twitter: {
                    card: 'summary_large_image',
                    title,
                    description,
                    images: [`${baseUrl}/cast-war-logo.png`],
                }
            };
        }
    } catch (e) {
        console.error("Failed to generate metadata for cast", e);
    }
    
    return {
        title: "Cast Details | Cast War",
        description: "View cast statistics and rank."
    };
}

export default function CastDetailPage({ params }: Props) {
    return <CastsDetailClient slug={params.slug} />;
}
