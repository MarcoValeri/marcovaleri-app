import { Metadata } from "next";
import Header from "../components/Header/Header"
import MainLayout from "../components/MainLayout/MainLayout"
import Nav from "../components/Nav/Nav"
import Footer from "../components/Footer/Footer"

export const metadata: Metadata = {
    title: "Chi Sono - Marco Valeri",
    description: "Ingegnere informatico di giorno e scrittore nel tempo libero. La mia storia da Roma a Londra, tra codice e scrittura.",
};

const ChiSonoPage = () => {
    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div className="px-8 lg:px-10 py-12 lg:py-20">
                    <h1 className="text-5xl lg:text-6xl font-bold text-black mb-12">Chi Sono</h1>
                    
                    <div className="max-w-3xl prose prose-lg">
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Ciao, benvenuto.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Mi chiamo Marco Valeri. Sono un ingegnere informatico di giorno e uno scrittore 
                            nel tempo che mi ritaglio dal mondo.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Ho creato questo spazio diversi anni fa, quando, stanco della mia routine a Roma, 
                            ho fatto le valigie per Londra. Una scelta che mi ha cambiato la vita, non perché 
                            sia stato facile, ma perché mi ha costretto a ripartire da zero.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Sono arrivato qui con l'illusione che all'estero tutto funzionasse meglio. Ho scoperto 
                            presto che le cose non sono né meglio né peggio: sono semplicemente, incredibilmente 
                            diverse. I primi anni sono stati una scuola di umiltà. Per pagarmi da vivere ho lavorato 
                            come lavapiatti in cucine dove il caos regnava sovrano, ma dove ho imparato la lezione 
                            più importante: non è mai troppo tardi per diventare chi vuoi essere.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            A 33 anni, mentre lavoravo full-time, ho deciso di riprendere in mano i libri. Mi sono 
                            iscritto alla Birkbeck University of London inseguendo due passioni apparentemente opposte: 
                            la logica dell'informatica e la libertà della scrittura. A 37 anni mi sono laureato in 
                            Computer Science e oggi lavoro come Software Engineer in questa città che non smette mai 
                            di correre.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Ma se il codice paga le bollette, sono le storie a nutrire tutto il resto.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Oggi uso questo blog e la mia newsletter per raccontare la vita a Londra, le sfide di 
                            cambiare percorso in età adulta e il mio viaggio verso la pubblicazione del mio primo 
                            romanzo. Credo fermamente che esista una "terza via" tra il dovere e i sogni, ed è 
                            quella che cerco di esplorare ogni giorno.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Se ti ritrovi in queste parole, sei nel posto giusto. Ti invito a{' '}
                            <a 
                                href="https://mailchi.mp/marcovaleri/marco-valeri-newsletter"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black underline hover:opacity-70 transition-opacity font-semibold"
                            >
                                iscriverti alla mia newsletter
                            </a>
                            {' '}per ricevere i miei pensieri direttamente nella tua casella di posta, o a seguirmi 
                            su{' '}
                            <a 
                                href="https://www.instagram.com/marcovalerinet/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black underline hover:opacity-70 transition-opacity font-semibold"
                            >
                                Instagram
                            </a>
                            {' '}per un saluto più informale.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed mb-6">
                            Non vedo l'ora di conoscerti meglio.
                        </p>
                        
                        <p className="text-lg text-black opacity-90 leading-relaxed">
                            A presto,<br />
                            Marco
                        </p>
                    </div>
                </div>
            </MainLayout>
            <Footer />
        </div>
    )
}

export default ChiSonoPage;
