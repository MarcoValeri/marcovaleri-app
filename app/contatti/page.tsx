import { Metadata } from "next";
import Header from "../components/Header/Header"
import MainLayout from "../components/MainLayout/MainLayout"
import Nav from "../components/Nav/Nav"
import Footer from "../components/Footer/Footer"

export const metadata: Metadata = {
    title: "Contatti - Marco Valeri",
    description: "Contattami per collaborazioni, domande o semplicemente per dire ciao. Iscriviti alla mia newsletter per ricevere storie da Londra.",
};

const ContactPage = () => {
    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div className="px-8 lg:px-10 py-12 lg:py-20">
                    <h1 className="text-5xl lg:text-6xl font-bold text-black mb-8">Contatti</h1>
                    
                    <div className="max-w-3xl">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-black mb-4">Marco Valeri | Storie da Londra</h2>
                            <p className="text-lg text-black opacity-80 leading-relaxed mb-6">
                                Vivo a Londra e inseguo il sogno di scrivere il mio primo romanzo. 
                                Questa newsletter è il mio spazio tranquillo lontano dal rumore dei social. 
                                Condivido racconti di vita da expat, le mie letture preferite e riflessioni 
                                su come restare umani in un mondo sempre più digitale. Nessun algoritmo, 
                                solo pensieri scritti a mano (o quasi).
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-3">Newsletter</h3>
                                <p className="text-black opacity-80 mb-4">
                                    Iscriviti alla mia newsletter per ricevere storie, riflessioni e aggiornamenti direttamente nella tua casella di posta.
                                </p>
                                <a 
                                    href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
                                >
                                    Iscriviti alla Newsletter
                                </a>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-black mb-3">Email</h3>
                                <p className="text-black opacity-80 mb-2">
                                    Hai domande, proposte di collaborazione o vuoi semplicemente dire ciao?
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