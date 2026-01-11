"use client";

import { ComponentType } from 'react';
import Link from "next/link"

interface AdminLinkProps {
    pathName: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
}

const AdminLink = ({ pathName, label, icon: Icon }: AdminLinkProps) => {
    return (
        <Link
            href={pathName}
            className="
                group flex items-center gap-2 
                py-3
                text-lg text-white 
                transition-colors duration-300
            "
        >
            <span>{label}</span>
            <Icon className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
        </Link>
    )
}

export default AdminLink;