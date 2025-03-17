import { toast } from "sonner";
import { calculateQualityScore, submitArticleToBlockchain } from "@/lib/blockchain";
import { ArticleFormData, ArticleSubmissionData } from "@/types/article";
import { pinFileToIPFS, pinJSONToIPFS } from "@/services/ipfsService";

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
  let coverImageIpfsHash = null;
  
  if (form.coverImage) {
    const coverImageResponse = await pinFileToIPFS(form.coverImage, {
      pinataMetadata: {
        name: `mini-blog-cover-${Date.now()}`
      },
      pinataOptions: {
        cidVersion: 1
      }
    });
    coverImageIpfsHash = coverImageResponse.ipfsHash;
    toast.success("Cover image uploaded to IPFS");
  }
  
  // Step 2: Upload article content to IPFS
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
    },
    pinataOptions: {
      cidVersion: 1
    }
  });
  
  toast.success("Article content uploaded to IPFS");
  
  // Step 3: Calculate quality score
  const score = calculateQualityScore({
    title: form.title,
    content: form.content,
    category: form.category
  });
  
  return {
    ipfsHash: ipfsResponse.ipfsHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsResponse.ipfsHash}`,
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