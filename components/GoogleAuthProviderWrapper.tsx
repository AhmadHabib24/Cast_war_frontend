'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export function GoogleAuthProviderWrapper({ children }: { children: React.ReactNode }) {
  // TODO: Replace with your actual Google Client ID from Google Cloud Console
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
