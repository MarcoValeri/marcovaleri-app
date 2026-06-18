import { Metadata } from "next";
import Header from "../components/Header/Header"
import MainLayout from "../components/MainLayout/MainLayout"
import Nav from "../components/Nav/Nav"
import Footer from "../components/Footer/Footer"

export const metadata: Metadata = {
    title: "Contact - Marco Valeri",
    description: "Get in touch for collaborations, questions, or just to say hello. Subscribe to my newsletter for stories from London.",
};

const ContactPage = () => {
    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div className="px-8 lg:px-10 py-12 lg:py-20">
                    <h1 className="text-5xl lg:text-6xl font-bold text-black mb-8">Contact</h1>
                    
                    <div className="max-w-3xl">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-black mb-4">Marco Valeri | Stories from London</h2>
                            <p className="text-lg text-black opacity-80 leading-relaxed mb-6">
                                I live in London and I&apos;m chasing the dream of writing my first novel. 
                                This newsletter is my quiet space away from the noise of social media. 
                                I share stories of expat life, my favourite reads, and reflections 
                                on how to stay human in an increasingly digital world. No algorithms, 
                                just handwritten thoughts (or almost).
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-3">Newsletter</h3>
                                <p className="text-black opacity-80 mb-4">
                                    Subscribe to my newsletter to receive stories, reflections and updates directly in your inbox.
                                </p>
                                <a 
                                    href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
                                >
                                    Subscribe to the Newsletter
                                </a>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-black mb-3">Email</h3>
                                <p className="text-black opacity-80 mb-2">
                                    Have questions, collaboration proposals, or just want to say hello?
                                </p>
                                <a 
                                    href="mailto:info@marcovaleri.net"
                                    className="text-black underline hover:opacity-70 transition-opacity"
                                >
                                    info@marcovaleri.net
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </div>
    )
}

export default ContactPage;
