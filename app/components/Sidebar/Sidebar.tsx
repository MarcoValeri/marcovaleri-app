import { FaInstagram, FaTiktok } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="p-8">
            {/* Follow Me Section */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-black border-opacity-10">
                <h3 className="font-['Silka'] text-2xl font-bold text-black mb-6">
                    Follow me on:
                </h3>
                
                <div className="flex gap-4">
                    {/* Instagram */}
                    <a
                        href="https://instagram.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white 
                                 hover:bg-accent transition-all duration-300 hover:scale-110"
                        aria-label="Follow on Instagram"
                    >
                        <FaInstagram size={24} />
                    </a>
                    
                    {/* TikTok */}
                    <a
                        href="https://tiktok.com/@yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white 
                                 hover:bg-accent transition-all duration-300 hover:scale-110"
                        aria-label="Follow on TikTok"
                    >
                        <FaTiktok size={24} />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
