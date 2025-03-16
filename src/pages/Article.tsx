
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, Heart, MessageCircle, Share, Bookmark, Calendar, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch article data
    const fetchArticle = async () => {
      try {
        // In a real app, you'd fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        setArticle({
          id: id || "1",
          title: "The Future of Decentralized Content Creation",
          content: `
            <p>The landscape of content creation and distribution is undergoing a revolutionary transformation, driven by blockchain technology and decentralized systems. This shift promises to redefine the relationship between creators, audiences, and platforms.</p>
            
            <h2>The Problem with Centralized Platforms</h2>
            
            <p>For decades, content creators have relied on centralized platforms to reach their audiences. These platforms act as intermediaries, taking a significant portion of revenue and imposing their own rules and algorithms that determine content visibility. This centralized model has led to several issues:</p>
            
            <ul>
              <li>Creators have little control over how their content is monetized</li>
              <li>Platform policies can change without warning, affecting creator livelihoods</li>
              <li>Content can be removed or censored at the platform's discretion</li>
              <li>Algorithms prioritize engagement over quality, often leading to divisive content</li>
            </ul>
            
            <h2>Enter Blockchain and IPFS</h2>
            
            <p>Blockchain technology offers a compelling alternative to this model. By leveraging decentralized systems, creators can publish content that:</p>
            
            <ul>
              <li>Cannot be censored or removed by a central authority</li>
              <li>Is stored permanently and redundantly across a distributed network</li>
              <li>Can be directly monetized through various mechanisms like tokens, NFTs, or micropayments</li>
              <li>Gives ownership and control back to the creators</li>
            </ul>
            
            <p>The InterPlanetary File System (IPFS) plays a crucial role in this ecosystem. Unlike traditional web hosting where files are stored on centralized servers, IPFS distributes content across a peer-to-peer network. This approach offers several advantages:</p>
            
            <ul>
              <li>Content is addressed by what it is, not where it is</li>
              <li>Files cannot be altered without changing their address</li>
              <li>Content can still be accessible even if the original uploader goes offline</li>
              <li>Bandwidth costs are distributed across the network</li>
            </ul>
            
            <h2>Tokenomics: Aligning Incentives</h2>
            
            <p>One of the most exciting aspects of decentralized content platforms is the introduction of token economics, or "tokenomics." By creating a native token for the ecosystem, platforms can align incentives among all participants:</p>
            
            <ul>
              <li>Creators earn tokens based on the quality and popularity of their content</li>
              <li>Readers can support creators directly through tips and purchases</li>
              <li>Community members can earn by curating content and identifying quality</li>
              <li>Token holders can participate in governance, shaping the future of the platform</li>
            </ul>
            
            <p>This model creates a self-sustaining ecosystem where everyone's interests are aligned toward producing and promoting high-quality content.</p>
            
            <h2>The Road Ahead</h2>
            
            <p>While decentralized content platforms are still in their early stages, they show tremendous promise. As technology improves and adoption increases, we can expect to see:</p>
            
            <ul>
              <li>More sophisticated recommendation systems that don't rely on engagement metrics alone</li>
              <li>Improved user experiences that hide the complexity of blockchain interactions</li>
              <li>Integration with existing creative tools and workflows</li>
              <li>New monetization models that weren't possible in centralized systems</li>
            </ul>
            
            <p>The future of content creation is decentralized, putting power back in the hands of creators and their communities. While challenges remain in terms of scalability, user experience, and adoption, the potential benefits make this one of the most exciting applications of blockchain technology.</p>`,
          coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1920&auto=format&fit=crop",
          category: "Blockchain",
          createdAt: "2023-04-15T10:30:00Z",
          author: {
            name: "Alex Johnson",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            username: "alexj",
            bio: "Blockchain enthusiast and content creator. Writing about the intersection of technology and creativity."
          },
          stats: {
            views: 12500,
            likes: 843,
            comments: 56
          },
          comments: [
            {
              id: "c1",
              author: {
                name: "Sarah Chen",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                username: "sarahc"
              },
              content: "This is a really insightful article! I've been exploring IPFS lately and it's fascinating how it changes the paradigm of content storage.",
              createdAt: "2023-04-16T08:45:00Z",
              likes: 12
            },
            {
              id: "c2",
              author: {
                name: "Michael Rivera",
                avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                username: "michaelr"
              },
              content: "Great points about tokenomics. I think the alignment of incentives is what makes these platforms so promising compared to traditional models.",
              createdAt: "2023-04-16T14:20:00Z",
              likes: 8
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    if (!hasLiked) {
      setArticle(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          likes: prev.stats.likes + 1
        }
      }));
      toast.success("Article liked! You earned 2 MINI tokens");
    } else {
      setArticle(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          likes: prev.stats.likes - 1
        }
      }));
    }
  };

  const handleBookmark = () => {
    setHasBookmarked(!hasBookmarked);
    toast.success(hasBookmarked ? "Article removed from bookmarks" : "Article bookmarked for later reading");
  };

  const handleShare = () => {
    // In a real app, we'd use the Web Share API or a custom sharing solution
    toast.success("Article link copied to clipboard! You earned 10 MINI tokens");
  };

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-4xl">
            <div className="h-10 bg-secondary rounded w-3/4"></div>
            <div className="h-6 bg-secondary rounded w-1/2"></div>
            <div className="h-96 bg-secondary rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!article) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed</p>
          <Link to="/articles">
            <Button>Back to Articles</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  // Format the creation date
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PageTransition>
      <Navbar />
      
      {/* Hero section with cover image */}
      {article.coverImage && (
        <div 
          className="w-full h-[50vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${article.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Link to="/articles" className="inline-flex items-center text-white mb-4 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Articles
            </Link>
            
            <Badge className="mb-4" variant="secondary">
              {article.category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white text-balance mb-4">
              {article.title}
            </h1>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-4xl">
          {/* Article metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link to={`/profile/${article.author.username}`} className="font-medium hover:text-primary transition-colors">
                  {article.author.name}
                </Link>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{article.stats.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{article.stats.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{article.stats.comments}</span>
              </div>
            </div>
          </div>
          
          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* Action bar */}
          <div className="glass-card sticky bottom-4 md:bottom-8 z-30 p-3 rounded-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant={hasLiked ? "default" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-2 ${hasLiked ? "fill-primary-foreground" : ""}`} />
                {!isMobile && "Like"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {!isMobile && "Comment"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                {!isMobile && "Share"}
              </Button>
              
              <Button 
                variant={hasBookmarked ? "secondary" : "outline"} 
                size="sm" 
                className="rounded-full"
                onClick={handleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${!isMobile && "mr-2"} ${hasBookmarked ? "fill-secondary-foreground" : ""}`} />
                {!isMobile && "Bookmark"}
              </Button>
            </div>
          </div>
          
          {/* Author bio */}
          <div className="mt-12 mb-10 glass-panel rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-1">
                  <Link to={`/profile/${article.author.username}`} className="hover:text-primary transition-colors">
                    {article.author.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-3">{article.author.bio}</p>
                <Button variant="outline" size="sm" className="rounded-full">
                  Follow Author
                </Button>
              </div>
            </div>
          </div>
          
          {/* Comments section */}
          <div id="comments" className="pt-4">
            <h3 className="text-2xl font-bold mb-6">Comments ({article.comments.length})</h3>
            
            {/* Comment form */}
            <div className="mb-8">
              <textarea
                className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add your comment..."
              />
              <div className="flex justify-end mt-2">
                <Button size="sm">Post Comment</Button>
              </div>
            </div>
            
            {/* Comments list */}
            <div className="space-y-6">
              {article.comments.map((comment: any) => (
                <div key={comment.id} className="glass-panel rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <Link to={`/profile/${comment.author.username}`} className="font-medium hover:text-primary transition-colors">
                            {comment.author.name}
                          </Link>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="ml-1 text-xs">{comment.likes}</span>
                        </Button>
                      </div>
                      
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Article;
