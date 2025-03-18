import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWallet } from "@/context/WalletContext";
import { ArticleFormData } from "@/types/article";
import { publishArticleToIPFS } from "@/utils/articleUtils";
import ArticleFormFields from "./ArticleFormFields";
import PublishedArticleView from "./PublishedArticleView";

const ArticleForm = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStage, setPublishStage] = useState<string>("");
  const [publishedArticle, setPublishedArticle] = useState<any>(null);
  const { address, isConnected } = useWallet();
  
  const [form, setForm] = useState<ArticleFormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    coverImage: null,
    coverImagePreview: ""
  });

  const categories = [
    "Blockchain", "Tokenomics", "Technology", "Community", 
    "Smart Contracts", "Privacy", "IPFS", "Web3"
  ];

  // Check if we have a published article in localStorage on mount
  useEffect(() => {
    const savedArticle = localStorage.getItem('publishedArticle');
    if (savedArticle) {
      try {
        setPublishedArticle(JSON.parse(savedArticle));
      } catch (e) {
        console.error("Error parsing saved article", e);
        localStorage.removeItem('publishedArticle');
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const handleImageChange = (file: File | null, preview: string) => {
    setForm({
      ...form,
      coverImage: file,
      coverImagePreview: preview
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!form.title || !form.content || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsPublishing(true);
    
    try {
      setPublishStage("Uploading to IPFS...");
      console.log("Starting IPFS upload process...");
      
      const result = await publishArticleToIPFS(form, address);
      console.log("IPFS upload complete, result:", result);
      
      // Save the entire published article info
      const publishedData = {
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        qualityScore: result.qualityScore,
        title: form.title,
        excerpt: form.excerpt || form.content.substring(0, 150) + "...",
        content: form.content,
        category: form.category,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('publishedArticle', JSON.stringify(publishedData));
      
      // Update state to show success view
      setPublishedArticle(publishedData);
      
      toast.success("Article successfully published to IPFS!");
      
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
      setPublishStage("");
    }
  };

  const handleReset = () => {
    setPublishedArticle(null);
    localStorage.removeItem('publishedArticle');
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      coverImage: null,
      coverImagePreview: ""
    });
  };

  // Render either the success view or the form
  if (publishedArticle) {
    return <PublishedArticleView 
      article={publishedArticle} 
      address={address}
      isConnected={isConnected}
      onNewArticle={handleReset}
    />;
  }

  // Otherwise, render the form
  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <ArticleFormFields
        form={form}
        categories={categories}
        isPublishing={isPublishing}
        publishStage={publishStage}
        isConnected={isConnected}
        handleInputChange={handleInputChange}
        handleCategoryChange={handleCategoryChange}
        handleImageChange={handleImageChange}
      />
    </form>
  );
};

export default ArticleForm;
