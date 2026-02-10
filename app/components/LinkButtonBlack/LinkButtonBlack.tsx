import Link from "next/link";

interface LinkButtonBlackProps {
    externalLink: boolean;
    link: string;
    content: string;
}

const LinkButtonBlack = ({ externalLink, link, content }: LinkButtonBlackProps) => {
    if (externalLink) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg 
                        hover:bg-accent transition-all duration-300 hover:scale-105"
            >
                {content}
            </a>
        )
    }

    return (
        <Link
            href={link}
            className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg 
                        hover:bg-accent transition-all duration-300 hover:scale-105"
        >
            {content}
        </Link>
    )
}

export default LinkButtonBlack;