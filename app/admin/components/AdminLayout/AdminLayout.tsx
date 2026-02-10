'use client';

import { ReactNode } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import AdminSidebar from "../AdminSidebar/AdminSidebar.tsx";
import AdminHeaderLogin from "../AdminHeaderLogin/AdminHeaderLogin.tsx";
import '@aws-amplify/ui-react/styles.css';
import AdminFooter from "../AdminFooter/AdminFooter.tsx";

interface AdminLayoutProp {
    children: ReactNode
}

const authComponents = {
    Header: AdminHeaderLogin,
};

const AdminLayout = ({ children }: AdminLayoutProp) => {
    return (
        <Authenticator
            hideSignUp={true}
            components={authComponents}
        >
            {({ signOut, user }) => (
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 border flex flex-col lg:min-h-screen min-h-0 bg-black">
                        <AdminSidebar />
                        <AdminFooter
                            userEmail={user?.signInDetails?.loginId}
                            signOut={() => signOut?.()}
                        />
                    </div>
                    <div className="w-full lg:w-2/3 border">
                        {children}
                    </div>
                </div>
            )}
        </Authenticator>
    )
}

export default AdminLayout;