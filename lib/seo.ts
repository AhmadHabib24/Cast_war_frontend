import { Metadata } from 'next';
import { API_URL } from './api';

export async function getSeoMetadata(route: string): Promise<Metadata> {
    try {
        const res = await fetch(`${API_URL}/seo?route=${route}`, {
            // Next.js fetch options for caching
            next: { revalidate: 60 } // revalidate every 60 seconds
        });
        const data = await res.json();
        
        if (data.success && data.data) {
            const seo = data.data;
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const imageUrl = seo.og_image ? `${API_URL.replace('/api/v1', '')}/${seo.og_image}` : `${baseUrl}/cast-war-logo.png`;
            
            return {
                title: seo.title || `Cast War - ${seo.page_name}`,
                description: seo.description || "Join the war. Boost your cast to the top of the global leaderboard.",
                keywords: seo.target_keyword,
                alternates: {
                    canonical: seo.canonical_url || `${baseUrl}${route}`,
                },
                openGraph: {
                    title: seo.og_title || seo.title || `Cast War - ${seo.page_name}`,
                    description: seo.og_description || seo.description || "Join the war. Boost your cast to the top of the global leaderboard.",
                    url: seo.canonical_url || `${baseUrl}${route}`,
                    siteName: 'Cast War',
                    images: [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: seo.title || `Cast War - ${seo.page_name}`,
                        },
                    ],
                    locale: 'en_US',
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: seo.og_title || seo.title || `Cast War - ${seo.page_name}`,
                    description: seo.og_description || seo.description || "Join the war. Boost your cast to the top of the global leaderboard.",
                    images: [imageUrl],
                },
            };
        }
    } catch (e) {
        console.error("Failed to fetch SEO metadata for route:", route, e);
    }
    
    // Fallback if API fails or no record found
    return {
        title: "Cast War",
        description: "Join the war. Boost your cast to the top of the global leaderboard.",
    };
}
