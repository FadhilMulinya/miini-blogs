
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
  centered?: boolean;
  overlap?: boolean;
  className?: string;
  glowing?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  children,
  backgroundImage,
  centered = true,
  overlap = false,
  className,
  glowing = false
}: HeroSectionProps) {
  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      overlap ? "-mb-24" : "mb-12",
      className
    )}>
      {/* Background decoration elements */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "radial-gradient(circle at 25% 25%, rgba(74, 144, 226, 0.3) 0%, rgba(74, 144, 226, 0) 50%), radial-gradient(circle at 75% 75%, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0) 50%)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {glowing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-5 animate-pulse"></div>
      )}

      <div className="blur-backdrop" />

      <div className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24",
        centered && "text-center flex flex-col items-center"
      )}>
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-4 tracking-tight font-bold text-balance animate-slide-down bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">{title}</h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance animate-slide-down" style={{ animationDelay: "0.1s" }}>
              {subtitle}
            </p>
          )}
          
          {children && (
            <div className="animate-slide-down" style={{ animationDelay: "0.2s" }}>
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Gradient overlay at bottom for overlap effect */}
      {overlap && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  );
}
