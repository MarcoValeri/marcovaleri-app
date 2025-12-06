'use client';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const router = useRouter();

  // If the user is already logged in, send them to Admin immediately
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