import { toast } from "sonner";
import { calculateQualityScore, mintArticleNFT } from "@/lib/blockchain";
import { ArticleFormData } from "@/types/article";
import { uploadFileDirectlyToIPFS, uploadJSONDirectlyToIPFS } from "@/utils/directPinataUpload";
import { EDU_CHAIN_CONFIG } from "@/lib/blockchain";

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
  try {
    console.log("Starting IPFS upload in publishArticleToIPFS...");
    
    // Step 1: Upload cover image to IPFS (if provided)
    let coverImageUrl = null;
    
    if (form.coverImage) {
      console.log("Uploading cover image...");
      try {
        coverImageUrl = await uploadFileDirectlyToIPFS(form.coverImage);
        console.log("Cover image uploaded:", coverImageUrl);
        toast.success("Cover image uploaded to IPFS");
      } catch (error) {
        console.error("Error uploading cover image:", error);
        toast.error("Failed to upload cover image");
      }
    }
    
    // Step 2: Prepare article content
    console.log("Preparing article data...");
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
    console.log("Uploading article JSON data...");
    const ipfsGatewayUrl = await uploadJSONDirectlyToIPFS(articleData);
    console.log("Article JSON uploaded, gateway URL:", ipfsGatewayUrl);
    toast.success("Article content uploaded to IPFS");
    
    // Extract IPFS hash (CID) from the gateway URL
    console.log("Extracting IPFS hash from URL:", ipfsGatewayUrl);
    let ipfsHash = '';
    if (ipfsGatewayUrl.includes('/ipfs/')) {
      ipfsHash = ipfsGatewayUrl.split('/ipfs/').pop() || '';
    } else {
      // If the URL doesn't contain /ipfs/, try to extract the last path segment
      const urlParts = ipfsGatewayUrl.split('/');
      ipfsHash = urlParts[urlParts.length - 1];
    }
    
    console.log("Extracted IPFS hash:", ipfsHash);
    
    // Step 4: Calculate quality score
    const score = calculateQualityScore({
      title: form.title,
      content: form.content,
      category: form.category
    });
    
    // Make sure we're returning a clear, well-formed object
    return {
      ipfsHash,
      ipfsUrl: ipfsGatewayUrl,
      qualityScore: score
    };
  } catch (error) {
    console.error("Error in publishArticleToIPFS:", error);
    throw error; 
  }
};

// Simplified function that just deploys the IPFS hash to the blockchain
export const deployToBlockchain = async (
  ipfsHash: string,
  qualityScore: number  // We'll still use this for UI display purposes only
) => {
  if (!ipfsHash) throw new Error("IPFS hash is required");
  
  try {
    console.log("Deploying to blockchain with IPFS hash:", ipfsHash);
    
    // Call the mintArticleNFT function with just the IPFS hash
    const result = await mintArticleNFT(ipfsHash);
    
    console.log("Blockchain submission result:", result);
    
    // Calculate tokens earned based on quality score (for UI only)
    const tokensEarned = Math.floor(qualityScore / 10);
    
    return {
      transactionHash: result.transactionHash,
      tokenId: result.tokenId,
      tokensEarned: tokensEarned, // For display purposes
      blockExplorerLink: `${EDU_CHAIN_CONFIG.blockExplorerUrls[0]}/tx/${result.transactionHash}`
    };
  } catch (error: any) {
    console.error("Detailed blockchain error:", error);
    
    let errorMessage = "Failed to deploy to blockchain";
    
    if (error.reason) {
      errorMessage += `: ${error.reason}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};