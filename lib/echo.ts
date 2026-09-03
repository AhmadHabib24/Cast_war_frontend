import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Bind Pusher to window so Laravel Echo can find it
if (typeof window !== 'undefined') {
    (window as any).Pusher = Pusher;
}

const echo = typeof window !== 'undefined' ? new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'pee1vln3zkcgepmbnp9o',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
}) : null;

export default echo;
