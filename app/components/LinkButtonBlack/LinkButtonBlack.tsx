import Link from "next/link";

interface LinlButtonBlackProps {
    externalLink: boolean;
    link: string;
    content: string;
}

const LinlButtonBlack = ({ externalLink, link, content }: LinlButtonBlackProps) => {
    if (externalLink) {
        <Link
            href={link}
            className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg 
                        hover:bg-accent transition-all duration-300 hover:scale-105"
        >
            {content}
        </Link>
    }

    return (
        <a
            href={link}
            className="inline-block px-8 py-4 bg-black text-white font-medium rounded-lg 
                        hover:bg-accent transition-all duration-300 hover:scale-105"
        >
            {content}
        </a>
    )
}

export default LinlButtonBlack;