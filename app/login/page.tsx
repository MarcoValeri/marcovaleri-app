'use client';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';

export default function LoginPage() {
  // This hook will now successfully find the Provider in layout.tsx
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/admin');
    }
  }, [authStatus, router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <Authenticator />
    </div>
  );
}