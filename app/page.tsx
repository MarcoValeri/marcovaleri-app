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
    description: "Scopri le mie esperienze, i miei viaggi e le mie storie. Articoli su tecnologia, viaggi e vita quotidiana.",
};

const Home = async () => {
    const latestArticles = await getArticles(10);

    return (
        <div>
            <Nav />
            <Header />
            <MainLayout>
                <div>
                    <h2 className="text-4xl font-bold text-black mb-8">Ultimi articoli</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {latestArticles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                title={article.title}
                                description={article.description || ''}
                                category={article.category?.category}
                                imageUrl={article.featuredImage?.url}
                                articleUrl={`/articles/${article.url}`}
                            />
                        ))}
                    </div>
                    {latestArticles.length > 0 && (
                        <div className="text-center">
                            <LinlButtonBlack
                                externalLink={false}
                                link="/articles"
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