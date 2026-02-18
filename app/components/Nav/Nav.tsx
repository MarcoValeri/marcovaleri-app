"use client";
import { useState } from "react";
import Link from "next/link"

const Nav = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleShowMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white border-b">
            <ul className="md:block hidden">
                <li><Link href="/"><span className="text-3xl">Marco Valeri</span></Link></li>
            </ul>
            <ul className="md:flex hidden gap-6">
                <li><Link href="/" className="nav-link">Home</Link></li>
                <li><Link href="/articoli" className="nav-link">Articoli</Link></li>
                <li><Link href="/chi-sono" className="nav-link">Chi Sono</Link></li>
                <li><Link href="/contatti" className="nav-link">Contatti</Link></li>
                <li><a href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter" target="_blank" className="nav-link">Newsletter</a></li>
            </ul>
            <div className="md:hidden block z-20">
                <button
                    className="md:hidden flex flex-col justify-around w-6 h-6 z-20 cursor-pointer"
                    onClick={handleShowMobileMenu}
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
            <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-black/90 backdrop-blur-sm p-8 transition-transform duration-300 ease-in-out z-10 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="flex flex-col items-center justify-center h-full gap-y-8">
                    <li><Link href="/" onClick={handleShowMobileMenu}><span className="text-3xl">Marco Valeri</span></Link></li>
                    <li><Link href="/" onClick={handleShowMobileMenu}><span className="text-2xl">Home</span></Link></li>
                    <li><Link href="/articoli" onClick={handleShowMobileMenu}><span className="text-2xl">Articoli</span></Link></li>
                    <li><Link href="/chi-sono" onClick={handleShowMobileMenu}><span className="text-2xl">Chi Sono</span></Link></li>
                    <li><Link href="/contatti" onClick={handleShowMobileMenu}><span className="text-2xl">Contatti</span></Link></li>
                    <li><a href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter" target="_blank" onClick={handleShowMobileMenu}><span className="text-2xl">Newsletter</span></a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav;