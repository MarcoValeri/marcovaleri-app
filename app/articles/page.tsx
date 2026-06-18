import { Metadata } from "next";
import { getArticles } from "@/app/lib/articles";
import Nav from "../components/Nav/Nav";
import Header from "../components/Header/Header";
import MainLayout from "../components/MainLayout/MainLayout";
import ArticleListWithFilter from "../components/ArticleListWithFilter/ArticleListWithFilter";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
    title: "Articles - Marco Valeri",
    description: "All articles by Marco Valeri. Discover my experiences, travels and stories.",
};

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
              <h1 className="text-5xl lg:text-6xl font-bold text-black mb-4">Articles</h1>
              <p className="text-xl text-black opacity-70">Discover my experiences, travels and stories</p>
            </div>

            {/* Articles List with Category Filter and Pagination */}
            <ArticleListWithFilter articles={articles} />
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
};

export default ArticlesPage;
