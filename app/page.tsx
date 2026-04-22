import { Metadata } from "next";
import { getArticles } from "./lib/articles";
import Nav from "./components/Nav/Nav";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MainLayout from "./components/MainLayout/MainLayout";
import ArticleCard from "./components/ArticleCard/ArticleCard";
import LinlButtonBlack from "./components/LinkButtonBlack/LinkButtonBlack";

export const metadata: Metadata = {
    title: "Marco Valeri - Home",
    description: "Scopri le mie esperienze, i miei viaggi e le mie storie. Articoli sui miei viaggi e la vita quotidiana.",
};

const Home = async () => {
    let latestArticles = await getArticles(10);

    // Filter out articles with missing required fields to prevent render crashes
    latestArticles = latestArticles.filter(
        (article) => article.id && article.title && article.url
    );

    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div>
                    <h2 className="text-4xl font-bold text-black mb-8">Ultimi articoli</h2>
                    <div className="flex flex-wrap gap-8 mb-12">
                        {latestArticles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                title={article.title}
                                description={article.description || ''}
                                category={article.category?.category}
                                imageUrl={article.featuredImage?.url}
                                articleUrl={`/articoli/${article.url}`}
                                className="w-full md:w-[calc(50%-1rem)]"
                            />
                        ))}
                    </div>
                    {latestArticles.length > 0 && (
                        <div className="text-center">
                            <LinlButtonBlack
                                externalLink={false}
                                link="/articoli"
                                content="View all articles"
                            />
                        </div>
                    )}
                    {latestArticles.length === 0 && (
                        <p className="text-center text-black opacity-60 py-12">
                            Nessun articolo disponibile al momento.
                        </p>
                    )}
                </div>
            </MainLayout>
            <Footer />
        </div>
    )
}

export default Home;