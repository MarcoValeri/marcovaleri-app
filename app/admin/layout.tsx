'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* 1. The Admin Sidebar (Visible only when logged in) */}
          <aside style={{ width: '250px', backgroundColor: '#f4f4f5', padding: '20px', borderRight: '1px solid #ddd' }}>
            <h3>Admin Panel</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{user?.signInDetails?.loginId}</p>
            
            <nav style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="/admin">Dashboard</a>
              <a href="/admin/create-post">Create Article</a>
              <a href="/admin/media">Media</a>
              <a href="/" target="_blank">View Live Site ↗</a>
            </nav>

            <button 
              onClick={signOut} 
              style={{ marginTop: 'auto', width: '100%', padding: '10px', backgroundColor: '#333', color: 'white' }}
            >
              Sign Out
            </button>
          </aside>

          {/* 2. The Content Area (Where your page.tsx goes) */}
          <main style={{ flex: 1, padding: '40px' }}>
            {children}
          </main>
        </div>
      )}
    </Authenticator>
  );
}