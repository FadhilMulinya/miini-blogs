
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import PageHeader from "@/components/create-article/PageHeader";
import ArticleForm from "@/components/create-article/ArticleForm";

const CreateArticle = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <PageHeader />
          <ArticleForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateArticle;
