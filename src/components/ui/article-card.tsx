
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Heart } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    category: string;
    createdAt: string;
    author: {
      name: string;
      avatar?: string;
      username: string;
    };
    stats: {
      views: number;
      likes: number;
      comments: number;
    };
  };
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { id, title, excerpt, coverImage, category, createdAt, author, stats } = article;
  
  // Format the creation date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Format the stats numbers
  const formatStat = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <article className={`group glass-card rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
      featured ? 'md:flex-row' : ''
    }`}>
      {coverImage && (
        <Link 
          to={`/articles/${id}`} 
          className={`block overflow-hidden ${featured ? 'md:w-1/2' : ''}`}
        >
          <div 
            className="aspect-video bg-cover bg-center transform transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        </Link>
      )}
      
      <div className={`flex flex-col p-5 space-y-4 ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="rounded-full px-3 text-xs font-normal">
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <Link to={`/articles/${id}`}>
            <h3 className={`font-semibold transition-colors hover:text-primary ${
              featured ? 'text-2xl mb-3' : 'text-xl mb-2'
            }`}>
              {title}
            </h3>
          </Link>

          <p className="text-muted-foreground line-clamp-2 mb-4">{excerpt}</p>
        </div>

        <div className="flex items-center justify-between">
          <Link to={`/profile/${author.username}`} className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author.name}</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span className="text-xs">{formatStat(stats.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{formatStat(stats.likes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{formatStat(stats.comments)}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
