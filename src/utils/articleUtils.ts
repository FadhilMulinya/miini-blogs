import { toast } from "sonner";
import { calculateQualityScore, submitArticleToBlockchain } from "@/lib/blockchain";
import { ArticleFormData, ArticleSubmissionData } from "@/types/article";
import { uploadFileDirectlyToIPFS, uploadJSONDirectlyToIPFS } from "@/utils/directPinataUpload";
import { pinata } from "@/utils/config";

export const copyToClipboard = (text: string) => {
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

export const publishArticleToIPFS = async (
  form: ArticleFormData, 
  address?: string
) => {
  // Step 1: Upload cover image to IPFS (if provided)
  let coverImageUrl = null;
  
  if (form.coverImage) {
    try {
      // Use the direct upload method
      coverImageUrl = await uploadFileDirectlyToIPFS(form.coverImage);
      toast.success("Cover image uploaded to IPFS");
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error("Failed to upload cover image");
      // Continue without cover image if it fails
    }
  }
  
  // Step 2: Prepare article content
  const articleData = {
    title: form.title,
    excerpt: form.excerpt || form.content.substring(0, 150) + "...",
    content: form.content,
    category: form.category,
    coverImage: coverImageUrl,
    timestamp: new Date().toISOString(),
    author: address
  };
  
  // Step 3: Upload JSON data to IPFS
  const ipfsGatewayUrl = await uploadJSONDirectlyToIPFS(articleData);
  toast.success("Article content uploaded to IPFS");
  
  // Extract IPFS hash (CID) from the gateway URL
  let ipfsHash = '';
  if (ipfsGatewayUrl.includes('/ipfs/')) {
    ipfsHash = ipfsGatewayUrl.split('/ipfs/').pop() || '';
  } else {
    // If the URL doesn't contain /ipfs/, try to extract the last path segment
    const urlParts = ipfsGatewayUrl.split('/');
    ipfsHash = urlParts[urlParts.length - 1];
  }
  
  // Step 4: Calculate quality score
  const score = calculateQualityScore({
    title: form.title,
    content: form.content,
    category: form.category
  });
  
  return {
    ipfsHash: ipfsHash,
    ipfsUrl: ipfsGatewayUrl,
    qualityScore: score
  };
};

export const deployToBlockchain = async (
  ipfsHash: string,
  qualityScore: number, 
  formData: ArticleFormData,
  address?: string
) => {
  if (!address) throw new Error("No wallet address provided");
  
  const articleData: ArticleSubmissionData = {
    title: formData.title,
    excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
    content: formData.content,
    category: formData.category,
    ipfsHash: ipfsHash,
    author: address
  };
  
  // Submit to blockchain
  return await submitArticleToBlockchain({
    ipfsHash,
    qualityScore,
    ...articleData
  });
};