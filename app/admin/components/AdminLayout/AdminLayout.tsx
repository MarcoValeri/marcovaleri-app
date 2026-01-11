'use client';

import { ReactNode, useState, useEffect } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import AdminSidebar from "../AdminSidebar/AdminSidebar.tsx";
import AdminHeaderLogin from "../AdminHeaderLogin/AdminHeaderLogin.tsx";
import '@aws-amplify/ui-react/styles.css';
import AdminFooter from "../AdminFooter/AdminFooter.tsx";

const client = generateClient<Schema>();

interface AdminLayoutProp {
    children: ReactNode
}

const authComponents = {
    Header: AdminHeaderLogin,
};

const AdminLayout = ({ children }: AdminLayoutProp) => {
    // const [userActive, setUserActive] = useState(true);

    // useEffect(() => {
    //     const checkUserStatus = async () => {
    //         try {
    //             const session = await fetchAuthSession();
    //             const email = session.tokens?.idToken?.payload?.email as string;
    //             if (email) {
    //                 const user = await client.models.User.list({
    //                     filter: { email: { eq: email } }
    //                 });
    //                 setUserActive(user.data[0]?.isActive ?? false);
    //             }
    //         } catch (error) {
    //             console.error('Error checking user status:', error);
    //             setUserActive(false);
    //         }
    //     };
    //     checkUserStatus();
    // }, []);

    // if (!userActive) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //             <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
    //                 <div className="mb-4">
    //                     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
    //                         <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    //                         </svg>
    //                     </div>
    //                 </div>
    //                 <h3 className="text-lg font-medium text-gray-900 mb-2">Account Deactivated</h3>
    //                 <p className="text-sm text-gray-500 mb-6">Your account has been deactivated. Please contact support for assistance.</p>
    //                 <a href="mailto:hello@seaportfunding.com" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
    //                     Contact Support
    //                 </a>
    //             </div>
    //         </div>
    //     );
    // }

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