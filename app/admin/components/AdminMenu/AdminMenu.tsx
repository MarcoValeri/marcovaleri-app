'use client';

import { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminMenuProps {
    pathName: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
}

const AdminMenu = ({ pathName, label, icon: Icon }: AdminMenuProps) => {
    const pathname = usePathname();
    const isActive = pathname === pathName;

    return (
        <Link
            href={pathName}
            className={`
                group flex items-center gap-3
                px-4 py-2.5 rounded-full
                transition-all duration-300 ease-out
                border
                
                ${isActive
                    ? "bg-white border-white text-slate-900 shadow-lg shadow-white/5 font-semibold"
                    : "bg-transparent border-transparent text-white hover:text-white hover:bg-white/10"
                }
            `}
        >
            <Icon
                className={`
                    text-xl shrink-0 transition-transform duration-300 
                    ${isActive ? "" : "group-hover:-rotate-12"}
                `}
            />
            
            <span className="text-lg font-medium tracking-wide">
                {label}
            </span>
        </Link>
    );
}

export default AdminMenu;