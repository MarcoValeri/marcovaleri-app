import Link from "next/link"

const Nav = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-black text-white border-b">
            <ul>
                <li><Link href="/"><span className="text-3xl">Marco Valeri</span></Link></li>
            </ul>
            <ul>
                <li><Link href="/">Home</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;