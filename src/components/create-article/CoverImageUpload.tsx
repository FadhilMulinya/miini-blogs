
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface CoverImageUploadProps {
  coverImagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

const CoverImageUpload = ({ coverImagePreview, onImageChange }: CoverImageUploadProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file, URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="coverImage">Cover Image</Label>
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center glass-panel hover:border-primary/50 transition-all duration-300">
        {coverImagePreview ? (
          <div className="relative">
            <img 
              src={coverImagePreview} 
              alt="Cover preview" 
              className="max-h-[300px] rounded-lg mx-auto object-cover shadow-lg"
            />
            <div className="absolute top-0 right-0 m-2">
              <Button 
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onImageChange(null, "")}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground mb-2">
              Drag & drop your cover image, or <span className="text-primary">browse</span>
            </div>
            <Input 
              id="coverImage"
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => document.getElementById("coverImage")?.click()}
              className="bg-primary/10 border-primary/30 hover:bg-primary/20"
            >
              Select Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImageUpload;
