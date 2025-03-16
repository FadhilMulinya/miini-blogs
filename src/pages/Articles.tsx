
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArticleCard } from "@/components/ui/article-card";
import { HeroSection } from "@/components/ui/hero-section";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample articles data
const allArticles = [
  {
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
  },
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
  },
  {
    id: "5",
    title: "The Role of Smart Contracts in Content Monetization",
    excerpt: "Understand how smart contracts are facilitating new business models for content creators in the digital economy.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1024&auto=format&fit=crop",
    category: "Smart Contracts",
    createdAt: "2023-03-28T11:20:00Z",
    author: {
      name: "David Park",
      avatar: "https://randomuser.me/api/portraits/men/19.jpg",
      username: "davidp"
    },
    stats: {
      views: 5200,
      likes: 378,
      comments: 41
    }
  },
  {
    id: "6",
    title: "Privacy in the Age of Blockchain",
    excerpt: "An exploration of how privacy concerns are being addressed in decentralized content platforms and blockchain systems.",
    coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1024&auto=format&fit=crop",
    category: "Privacy",
    createdAt: "2023-03-22T08:45:00Z",
    author: {
      name: "Nadia Smith",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      username: "nadias"
    },
    stats: {
      views: 4800,
      likes: 352,
      comments: 27
    }
  }
];

const Articles = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSortOption, setSelectedSortOption] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);

  // Get topic from URL query parameters if it exists
  const queryParams = new URLSearchParams(location.search);
  const topicFromUrl = queryParams.get("topic");
  
  // Initialize selected categories with topic from URL if it exists
  useState(() => {
    if (topicFromUrl && !selectedCategories.includes(topicFromUrl)) {
      setSelectedCategories([topicFromUrl]);
    }
  });

  // Extract all unique categories from articles
  const allCategories = Array.from(new Set(allArticles.map(article => article.category)));

  // Filter articles based on search query and selected categories
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(article.category);
    
    return matchesSearch && matchesCategory;
  });

  // Sort articles based on selected option
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (selectedSortOption === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (selectedSortOption === "popular") {
      return b.stats.views - a.stats.views;
    } else if (selectedSortOption === "trending") {
      // For trending, we could combine views, likes, and comments with recency
      const scoreA = (b.stats.views * 0.5) + (b.stats.likes * 0.3) + (b.stats.comments * 0.2);
      const scoreB = (a.stats.views * 0.5) + (a.stats.likes * 0.3) + (a.stats.comments * 0.2);
      return scoreA - scoreB;
    }
    return 0;
  });

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedSortOption("recent");
  };

  return (
    <PageTransition>
      <Navbar />
      
      <HeroSection
        title="Explore Articles"
        subtitle="Discover the latest insights and knowledge from our community of creators"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filter Section */}
        <div className="mb-8 glass-card rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-lg"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              <div className="relative inline-block">
                <select
                  value={selectedSortOption}
                  onChange={(e) => setSelectedSortOption(e.target.value)}
                  className="appearance-none bg-muted text-foreground px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-full"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
                <SlidersHorizontal className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border animate-slide-down">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Categories</h3>
                {(selectedCategories.length > 0 || searchQuery || selectedSortOption !== "recent") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                    <X className="mr-1 h-3 w-3" />
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {sortedArticles.length} articles
          {selectedCategories.length > 0 && (
            <> in {selectedCategories.map((c, i) => (
              <span key={c}>
                {i > 0 && ", "}
                <span className="font-medium">{c}</span>
              </span>
            ))}</>
          )}
          {searchQuery && (
            <> matching "<span className="font-medium">{searchQuery}</span>"</>
          )}
        </div>
        
        {/* Articles Grid */}
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Articles;
