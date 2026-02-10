import { getArticles } from "@/app/lib/articles";
import Nav from "../components/Nav/Nav";
import Header from "../components/Header/Header";
import ArticleList from "../components/ArticleList/ArticleList";

const ArticlesPage = async () => {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Header />
      
      <main className="px-8 lg:px-20 py-12 lg:py-20">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-black mb-4">
            Articles
          </h1>
          <p className="text-xl text-black opacity-70">
            Explore our latest insights and stories
          </p>
        </div>

        {/* Articles List with Pagination */}
        <ArticleList articles={articles} />
      </main>
    </div>
  );
};

export default ArticlesPage;
