'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Authenticator>
        {({ signOut, user }) => (
          <main style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Hello, Admin!</h1>
            <p>You are logged in as: <b>{user?.signInDetails?.loginId}</b></p>
            
            {/* We will add the "Create Post" form here later */}
            
            <button 
              onClick={signOut} 
              style={{ padding: '10px', marginTop: '20px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </main>
        )}
      </Authenticator>
    </div>
  );
}