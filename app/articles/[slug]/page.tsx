import { notFound } from "next/navigation";
import { getArticleByUrl, getArticles } from "@/app/lib/articles";
import Nav from "@/app/components/Nav/Nav";
import Header from "@/app/components/Header/Header";
import ArticleTemplate from "@/app/components/ArticleTemplate/ArticleTemplate";
import Footer from "@/app/components/Footer/Footer";

interface SingleArticleProps {
  params: Promise<{
    slug: string;
  }>;
}

const SingleArticle = async ({ params }: SingleArticleProps) => {
  const { slug } = await params;
  const article = await getArticleByUrl(slug);

  if (!article) {
    notFound();
  }

  // Fetch all articles to get related ones
  const allArticles = await getArticles();

  // Get the last 3 articles excluding the current one, sorted by updated date
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id) // Exclude current article
    .sort((a, b) => {
      const dateA = new Date(a.updated || a.createdAt || 0).getTime();
      const dateB = new Date(b.updated || b.createdAt || 0).getTime();
      return dateB - dateA; // Newest first
    })
    .slice(0, 3); // Take only the first 3

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Header />
      <main>
        <ArticleTemplate article={article} relatedArticles={relatedArticles} />
      </main>
      <Footer />
    </div>
  );
};

export default SingleArticle;
