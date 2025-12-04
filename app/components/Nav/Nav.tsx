"use client";
import { useState } from "react";
import Link from "next/link"

const Nav = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white border-b">
            <ul className="md:block hidden">
                <li><Link href="/"><span className="text-3xl">Marco Valeri</span></Link></li>
            </ul>
            <ul className="md:block hidden">
                <li><Link href="/">Home</Link></li>
            </ul>
            <div className="md:hidden block">
                <button
                    className="md:hidden flex flex-col justify-around w-6 h-6 z-20 cursor-pointer"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                    aria-expanded={showMobileMenu}
                >
                    <span className={`block w-full h-0.5 bg-white transition-transform duration-300 ease-in-out ${showMobileMenu ? 'rotate-50 translate-y-[7px]' : ''
                        }`}></span>
                    <span className={`block w-full h-0.5 bg-white transition-opacity duration-300 ease-in-out ${showMobileMenu ? 'opacity-0' : 'opacity-100'
                        }`}></span>
                    <span className={`block w-full h-0.5 bg-white transition-transform duration-300 ease-in-out ${showMobileMenu ? '-rotate-50 -translate-y-[9px]' : ''
                        }`}></span>
                </button>
            </div>
        </nav>
    )
}

export default Nav;