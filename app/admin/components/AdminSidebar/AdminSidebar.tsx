'use client';

import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { MdDashboard, MdMenu, MdClose, MdArrowOutward, MdArticle, MdCategory, MdTag, MdImage, MdMap } from "react-icons/md";
import AdminMenu from "../AdminMenu/AdminMenu.tsx";
import AdminLink from "../AdminLink/AdminLink.tsx";

const AdminSidebar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const session = await fetchAuthSession();
            const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];
            setIsAdmin(groups.includes('Admins'));
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    };

    return (
        <>
            {/* Mobile burger button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-black text-white p-2 rounded"
            >
                {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`bg-black text-white p-4 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
               <div className="lg:mt-0 mt-15 mb-8">
                    <h1 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Marco Valeri
                    </h1>
                    <h2 className="text-xl font-bold">CMS</h2>
                </div>
                <div className="space-y-2">
                    <div className="mb-5">
                        <AdminMenu
                            pathName="/admin"
                            label="Dashboard"
                            icon={MdDashboard}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminMenu
                            pathName="/admin/articles"
                            label="Articles"
                            icon={MdArticle}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminMenu
                            pathName="/admin/categories"
                            label="Categories"
                            icon={MdCategory}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminMenu
                            pathName="/admin/tags"
                            label="Tags"
                            icon={MdTag}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminMenu
                            pathName="/admin/images"
                            label="Images"
                            icon={MdImage}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminLink
                            pathName="/sitemap.xml"
                            label="Sitemap"
                            icon={MdMap}
                        />
                    </div>
                    <div className="mb-5">
                        <AdminLink
                            pathName="/"
                            label="View Site"
                            icon={MdArrowOutward}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar;