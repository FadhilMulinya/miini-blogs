import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArticleFormData } from "@/types/article";
import CoverImageUpload from "./CoverImageUpload";
import InfoCards from "./InfoCards";

interface ArticleFormFieldsProps {
  form: ArticleFormData;
  categories: string[];
  isPublishing: boolean;
  publishStage: string;
  isConnected: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleImageChange: (file: File | null, preview: string) => void;
}

const ArticleFormFields: FC<ArticleFormFieldsProps> = ({
  form,
  categories,
  isPublishing,
  publishStage,
  isConnected,
  handleInputChange,
  handleCategoryChange,
  handleImageChange,
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <CoverImageUpload 
        coverImagePreview={form.coverImagePreview}
        onImageChange={handleImageChange}
      />
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          className="text-xl font-medium glass-panel focus:border-primary/50"
          placeholder="Enter a compelling title..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <div className="relative">
          <Textarea
            id="excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={handleInputChange}
            placeholder="Write a brief summary of your article..."
            className="min-h-[100px] resize-none pr-10 glass-panel focus:border-primary/50"
            maxLength={300}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {form.excerpt.length}/300
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={form.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="glass-panel focus:border-primary/50">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleInputChange}
          placeholder="Write your article content here..."
          className="min-h-[400px] glass-panel focus:border-primary/50"
        />
      </div>
      
      <InfoCards />
      
      {!isConnected && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet before publishing to associate your content with your address.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="pt-4 flex items-center justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/articles")}
          disabled={isPublishing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isPublishing || !isConnected}
          className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {publishStage || "Publishing..."}
            </>
          ) : "Publish to IPFS"}
        </Button>
      </div>

      {isPublishing && (
        <div className="mt-8 text-center text-muted-foreground animate-pulse">
          Please wait while your content is being published to IPFS...
        </div>
      )}
    </>
  );
};

export default ArticleFormFields;