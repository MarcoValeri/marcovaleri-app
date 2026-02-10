import Link from "next/link";

interface LinkButtonYellowProps {
    externalLink: boolean;
    link: string;
    content: string;
}

const LinkButtonYellow = ({ externalLink, link, content }: LinkButtonYellowProps) => {

    if (externalLink) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-accent text-white font-medium text-center rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
                {content}
            </a>
        )
    }

    return (
        <Link className="block w-full px-6 py-3 bg-accent text-white font-medium text-center rounded-lg hover:bg-white hover:text-black transition-all duration-300" href={link}>{content}</Link>
    )
}

export default LinkButtonYellow;