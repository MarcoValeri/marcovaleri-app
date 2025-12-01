import Link from "next/link"

const Nav = () => {
    return (
        <nav className="border">
            <li><Link href="/">Home</Link></li>
        </nav>
    )
}

export default Nav;