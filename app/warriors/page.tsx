import WarriorsClient from './WarriorsClient';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/warriors');
}

export default function Warriors() {
    return <WarriorsClient />;
}
