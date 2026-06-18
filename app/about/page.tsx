import { Metadata } from "next";
import Header from "../components/Header/Header"
import MainLayout from "../components/MainLayout/MainLayout"
import Nav from "../components/Nav/Nav"
import Footer from "../components/Footer/Footer"

export const metadata: Metadata = {
    title: "About - Marco Valeri",
    description: "Software engineer by day, writer in my spare time. My story from Rome to London, between code and writing.",
};

const AboutPage = () => {
    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div className="px-8 lg:px-10 py-12 lg:py-20">
                    <h1 className="text-5xl lg:text-6xl font-bold text-black mb-12">About</h1>
                    
                    <div className="max-w-3xl">
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Hi, welcome.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            My name is Marco Valeri. I&apos;m a software engineer by day and a writer 
                            in the time I carve out of the world.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            I created this space several years ago, when, tired of my routine in Rome, 
                            I packed my bags for London. It was a choice that changed my life—not because 
                            it was easy, but because it forced me to start from scratch.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            I arrived here with the illusion that everything worked better abroad. I quickly 
                            discovered that things are neither better nor worse: they are simply, incredibly 
                            different. The first few years were a school of humility. To make a living, I worked 
                            as a dishwasher in kitchens where chaos reigned, but where I learned the most 
                            important lesson: it&apos;s never too late to become who you want to be.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            At 33, while working full-time, I decided to pick up the books again. I enrolled 
                            at Birkbeck, University of London, chasing two seemingly opposite passions: 
                            the logic of computer science and the freedom of writing. At 37, I graduated in 
                            Computer Science, and today I work as a Software Engineer in this city that never 
                            stops running.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            But if code pays the bills, it&apos;s the stories that nourish everything else.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Today, I use this blog and my newsletter to write about life in London, the challenges 
                            of changing career paths as an adult, and my journey towards publishing my first 
                            novel. I firmly believe there is a &quot;third way&quot; between duty and dreams, and 
                            that&apos;s what I try to explore every day.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            If you see yourself in these words, you&apos;re in the right place. I invite you to{' '}
                            <a 
                                href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black underline hover:opacity-70 transition-opacity font-semibold"
                            >
                                subscribe to my newsletter
                            </a>
                            {' '}to receive my thoughts directly in your inbox, or to follow me 
                            on{' '}
                            <a 
                                href="https://www.instagram.com/marcovalerinet/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black underline hover:opacity-70 transition-opacity font-semibold"
                            >
                                Instagram
                            </a>
                            {' '}for a more informal hello.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            I look forward to getting to know you better.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed">
                            See you soon,<br />
                            Marco
                        </p>
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </div>
    )
}

export default AboutPage;
