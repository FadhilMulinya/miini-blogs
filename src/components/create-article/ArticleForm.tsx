import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { ArticleFormData } from "@/types/article";
import { publishArticleToIPFS, deployToBlockchain } from "@/utils/articleUtils";
import IPFSSuccessCard from "./IPFSSuccessCard";
import ArticleFormFields from "./ArticleFormFields";

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
      
      // Use the updated publishArticleToIPFS function that works with our JWT-authenticated Pinata SDK
      const result = await publishArticleToIPFS(form, address);
      
      setIpfsHash(result.ipfsHash);
      setIpfsUrl(result.ipfsUrl);
      setQualityScore(result.qualityScore);
      
      toast.success("Article successfully published to IPFS!");
      
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
      setPublishStage("");
    }
  };

  const handleDeployToBlockchain = async () => {
    if (!ipfsHash || !qualityScore || !address) return;
    
    setIsDeployingToBlockchain(true);
    
    try {
      const blockchainResponse = await deployToBlockchain(
        ipfsHash,
        qualityScore,
        form,
        address
      );
      
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
      {ipfsHash && ipfsUrl && qualityScore ? (
        <IPFSSuccessCard
          ipfsHash={ipfsHash}
          ipfsUrl={ipfsUrl}
          qualityScore={qualityScore}
          blockchainTxHash={blockchainTxHash}
          tokensEarned={tokensEarned}
          isDeployingToBlockchain={isDeployingToBlockchain}
          isConnected={isConnected}
          onDeployToBlockchain={handleDeployToBlockchain}
          onCreateNew={resetForm}
        />
      ) : (
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
      )}
    </form>
  );
};

export default ArticleForm;
