import LeaderboardClient from './LeaderboardClient';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/leaderboard');
}

export default function Leaderboard() {
    return <LeaderboardClient />;
}
