
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { ArticleCard } from "@/components/ui/article-card";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { ArrowRight, Pen, Bookmark, TrendingUp } from "lucide-react";

// Sample data for testing
const featuredArticle = {
  id: "1",
  title: "The Future of Decentralized Content Creation",
  excerpt: "Explore how blockchain technology is revolutionizing content creation and distribution, empowering creators with new monetization models and greater control.",
  coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1024&auto=format&fit=crop",
  category: "Blockchain",
  createdAt: "2023-04-15T10:30:00Z",
  author: {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    username: "alexj"
  },
  stats: {
    views: 12500,
    likes: 843,
    comments: 56
  }
};

const recentArticles = [
  {
    id: "2",
    title: "Understanding Tokenomics: A Comprehensive Guide",
    excerpt: "Learn the fundamentals of token economics and how it shapes the incentives within decentralized ecosystems.",
    coverImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1024&auto=format&fit=crop",
    category: "Tokenomics",
    createdAt: "2023-04-10T14:20:00Z",
    author: {
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      username: "sarahc"
    },
    stats: {
      views: 8300,
      likes: 621,
      comments: 42
    }
  },
  {
    id: "3",
    title: "IPFS and Content Distribution: The New Paradigm",
    excerpt: "Discover how IPFS is changing the way we store and share content on the internet, offering resilience and censorship resistance.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1024&auto=format&fit=crop",
    category: "Technology",
    createdAt: "2023-04-05T09:15:00Z",
    author: {
      name: "Michael Rivera",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      username: "michaelr"
    },
    stats: {
      views: 7200,
      likes: 534,
      comments: 38
    }
  },
  {
    id: "4",
    title: "Community Engagement in Web3 Projects",
    excerpt: "Explore strategies for building and nurturing engaged communities around decentralized applications.",
    coverImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1024&auto=format&fit=crop",
    category: "Community",
    createdAt: "2023-04-01T16:45:00Z",
    author: {
      name: "Emily Wong",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      username: "emilyw"
    },
    stats: {
      views: 6100,
      likes: 412,
      comments: 29
    }
  }
];

const Index = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <HeroSection
        title="Decentralized Content For The Modern Age"
        subtitle="Create, share, and earn from your content in a truly decentralized ecosystem powered by blockchain technology."
        overlap={true}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create">
            <Button size="lg" className="rounded-full px-8">
              <Pen className="mr-2 h-4 w-4" />
              Start Writing
            </Button>
          </Link>
          <Link to="/articles">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              <Bookmark className="mr-2 h-4 w-4" />
              Explore Articles
            </Button>
          </Link>
        </div>
      </HeroSection>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Featured Article Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Article</h2>
          </div>
          <ArticleCard article={featuredArticle} featured={true} />
        </div>
        
        {/* Recent Articles Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Articles</h2>
            <Link to="/articles">
              <Button variant="ghost" className="group">
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
        
        {/* Trending Topics */}
        <div className="mt-20 glass-panel rounded-xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Trending Topics</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                "Blockchain", "Web3", "Tokenomics", "IPFS", "Content Creation",
                "NFTs", "DAOs", "Decentralization", "Digital Identity", "Governance"
              ].map((topic) => (
                <Link key={topic} to={`/articles?topic=${encodeURIComponent(topic)}`}>
                  <div className="bg-secondary/50 hover:bg-secondary/80 transition-colors rounded-lg px-4 py-3 text-center">
                    <span className="text-sm font-medium">{topic}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
