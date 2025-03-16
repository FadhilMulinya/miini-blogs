
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Image, Loader2, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { pinFileToIPFS, pinJSONToIPFS } from "@/lib/pinata";
import { calculateQualityScore, submitArticleToBlockchain } from "@/lib/blockchain";
import { useWallet } from "@/context/WalletContext";
import CoverImageUpload from "./CoverImageUpload";
import InfoCards from "./InfoCards";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ArticleForm = () => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStage, setPublishStage] = useState<string>("");
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [isDeployingToBlockchain, setIsDeployingToBlockchain] = useState(false);
  const [blockchainTxHash, setBlockchainTxHash] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [tokensEarned, setTokensEarned] = useState<number | null>(null);
  const { address, isConnected } = useWallet();
  
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    coverImage: null as File | null,
    coverImagePreview: ""
  });

  const categories = [
    "Blockchain", "Tokenomics", "Technology", "Community", 
    "Smart Contracts", "Privacy", "IPFS", "Web3"
  ];

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Could not copy text");
        console.error("Could not copy text: ", err);
      }
    );
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
      // Step 1: Upload cover image to IPFS (if provided)
      let coverImageIpfsHash = null;
      
      if (form.coverImage) {
        setPublishStage("Uploading cover image to IPFS...");
        const coverImageResponse = await pinFileToIPFS(form.coverImage, {
          pinataMetadata: {
            name: `mini-blog-cover-${Date.now()}`
          }
        });
        coverImageIpfsHash = coverImageResponse.ipfsHash;
        toast.success("Cover image uploaded to IPFS");
      }
      
      // Step 2: Upload article content to IPFS
      setPublishStage("Uploading article content to IPFS...");
      const articleData = {
        title: form.title,
        excerpt: form.excerpt || form.content.substring(0, 150) + "...",
        content: form.content,
        category: form.category,
        coverImage: coverImageIpfsHash,
        timestamp: new Date().toISOString(),
        author: address // Use the connected wallet address
      };
      
      const ipfsResponse = await pinJSONToIPFS(articleData, {
        pinataMetadata: {
          name: `mini-blog-article-${Date.now()}`
        }
      });
      
      // Store IPFS hash and URL
      setIpfsHash(ipfsResponse.ipfsHash);
      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${ipfsResponse.ipfsHash}`);
      
      toast.success("Article content uploaded to IPFS");
      
      // Step 3: Calculate quality score
      setPublishStage("Calculating quality score...");
      const score = calculateQualityScore({
        title: form.title,
        content: form.content,
        category: form.category
      });
      
      setQualityScore(score);
      setIsPublishing(false);
      setPublishStage("");
      
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("Failed to publish article. Please try again.");
      setIsPublishing(false);
      setPublishStage("");
    }
  };

  const handleDeployToBlockchain = async () => {
    if (!ipfsHash || !qualityScore) return;
    
    setIsDeployingToBlockchain(true);
    
    try {
      const articleData = {
        title: form.title,
        excerpt: form.excerpt || form.content.substring(0, 150) + "...",
        content: form.content,
        category: form.category,
        ipfsHash: ipfsHash,
        author: address
      };
      
      // Submit to blockchain
      const blockchainResponse = await submitArticleToBlockchain({
        ipfsHash,
        qualityScore,
        ...articleData
      });
      
      setBlockchainTxHash(blockchainResponse.transactionHash);
      setTokensEarned(blockchainResponse.tokensEarned);
      
      toast.success(`Article published to blockchain! You earned ${blockchainResponse.tokensEarned} MINI tokens`);
      
    } catch (error) {
      console.error("Error deploying to blockchain:", error);
      toast.error("Failed to deploy to blockchain. Please try again.");
    } finally {
      setIsDeployingToBlockchain(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      coverImage: null,
      coverImagePreview: ""
    });
    setIpfsHash(null);
    setIpfsUrl(null);
    setBlockchainTxHash(null);
    setQualityScore(null);
    setTokensEarned(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      {/* IPFS Success Card */}
      {ipfsHash && (
        <Card className="border-primary/20 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Content Successfully Uploaded to IPFS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">IPFS Hash (CID)</Label>
              <div className="flex items-center mt-1">
                <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                  {ipfsHash}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(ipfsHash)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Gateway URL (for verification)</Label>
              <div className="flex items-center mt-1">
                <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                  {ipfsUrl}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(ipfsUrl || "")}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(ipfsUrl || "", "_blank")}
                  className="ml-1"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Content Quality Score</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="text-2xl font-bold">{qualityScore}/100</div>
                <div className="text-sm text-muted-foreground">
                  (Estimated MINI tokens: {Math.floor((qualityScore || 0) / 10)})
                </div>
              </div>
            </div>
            
            {blockchainTxHash ? (
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Successfully deployed to blockchain</AlertTitle>
                <AlertDescription>
                  Transaction Hash: <code className="text-xs">{blockchainTxHash}</code>
                  <br />
                  You earned {tokensEarned} MINI tokens for this content!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="pt-4">
                <Button 
                  type="button" 
                  onClick={handleDeployToBlockchain}
                  disabled={isDeployingToBlockchain || !isConnected}
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                >
                  {isDeployingToBlockchain ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying to Blockchain...
                    </>
                  ) : "Deploy to Blockchain & Earn MINI Tokens"}
                </Button>
                {!isConnected && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Please connect your wallet to deploy to the blockchain
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="w-full"
            >
              Create New Article
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Form fields (only show if not yet published to IPFS) */}
      {!ipfsHash && (
        <>
          {/* Cover Image */}
          <CoverImageUpload 
            coverImagePreview={form.coverImagePreview}
            onImageChange={handleImageChange}
          />
          
          {/* Title */}
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
          
          {/* Excerpt */}
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
                maxLength={200}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {form.excerpt.length}/200
              </div>
            </div>
          </div>
          
          {/* Category */}
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
          
          {/* Content */}
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
          
          {/* Info Cards */}
          <InfoCards />
          
          {/* Wallet Connection Check */}
          {!isConnected && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet before publishing to associate your content with your address.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Submit Button */}
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
      )}
    </form>
  );
};

export default ArticleForm;
