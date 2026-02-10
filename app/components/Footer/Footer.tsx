const Footer = () => {
    const getDate = new Date();
    const getCurrentYear = getDate.getFullYear();
    return (
        <footer className="bg-black p-10 text-center">
            <p className="text-base text-white">Made with <span className="text-xl text-red-500">&hearts;</span> in London by Marco Valeri - &copy; {getCurrentYear} - All rights reserved</p>
        </footer>
    )
}

export default Footer;