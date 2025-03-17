import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CoverImageUploadProps {
  coverImagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
  coverImagePreview,
  onImageChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a preview URL for immediate visual feedback
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      onImageChange(file, preview);
      setIsUploading(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onImageChange(null, "");
  };

  return (
    <div className="relative w-full rounded-lg border border-dashed border-border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Image className="h-5 w-5 text-muted-foreground" />
        <Label className="font-medium">Cover Image</Label>
      </div>
      
      {coverImagePreview ? (
        <div className="relative">
          <img
            src={coverImagePreview}
            alt="Cover"
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-7 w-7 rounded-full shadow"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-center h-48 bg-muted/40 rounded-md cursor-pointer overflow-hidden">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground mt-2">Preparing image...</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a cover image
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Recommended: 1200×630 pixels
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
