import CastsClient from './CastsClient';
import { getSeoMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/casts');
}

export default function Casts() {
    return <CastsClient />;
}
