import { getArticles } from "@/app/lib/articles";
import Nav from "../components/Nav/Nav";
import Header from "../components/Header/Header";
import MainLayout from "../components/MainLayout/MainLayout";
import ArticleList from "../components/ArticleList/ArticleList";
import Footer from "../components/Footer/Footer";

const ArticlesPage = async () => {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Header />
      
      <MainLayout>
        <div className="px-8 lg:px-10 py-12 lg:py-20">
            {/* Page Title */}
            <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-4">Articoli</h1>
            <p className="text-xl text-black opacity-70">Scopri le mie esperienze, i miei viaggi, le mie storie</p>
            </div>

            {/* Articles List with Pagination */}
            <ArticleList articles={articles} />
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
};

export default ArticlesPage;
