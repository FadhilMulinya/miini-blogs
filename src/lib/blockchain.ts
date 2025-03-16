
import contractABI from "../contracts/abi.json";
import { toast } from "sonner";

// Dummy contract address - replace with real one in production
export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

// Quality score calculation algorithm - this is a simplified version
// In a real application, this might involve more complex metrics and possibly AI
export function calculateQualityScore(article: {
  title: string;
  content: string;
  category: string;
}): number {
  // Basic algorithm factors:
  // 1. Length of content (longer content gets more points up to a reasonable limit)
  // 2. Title quality (not too short, not too long)
  // 3. Category relevance
  
  let score = 0;
  
  // Content length factor
  const contentLength = article.content.length;
  // Ideal content length: 2000-5000 characters
  if (contentLength > 0) {
    if (contentLength < 500) {
      score += contentLength / 500 * 20;
    } else if (contentLength < 2000) {
      score += 20 + (contentLength - 500) / 1500 * 20;
    } else if (contentLength < 5000) {
      score += 40 + (contentLength - 2000) / 3000 * 10;
    } else {
      score += 50;
    }
  }
  
  // Title quality
  const titleLength = article.title.length;
  // Ideal title length: 30-60 characters
  if (titleLength > 0) {
    if (titleLength < 20) {
      score += titleLength / 20 * 15;
    } else if (titleLength < 60) {
      score += 15 + (titleLength - 20) / 40 * 10;
    } else if (titleLength < 100) {
      score += 25 - (titleLength - 60) / 40 * 5;
    } else {
      score += 20;
    }
  }
  
  // Category bonus
  if (article.category) {
    score += 10;
  }
  
  // Normalize to 0-100 scale
  return Math.min(Math.round(score), 100);
}

// Dummy function to simulate submitting to blockchain
export async function submitArticleToBlockchain(articleData: any) {
  // In a real implementation, this would use ethers.js or web3.js
  // to interact with the smart contract
  
  try {
    // Simulate blockchain transaction time with progress notifications
    toast.info("Initializing blockchain transaction...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.info("Waiting for wallet confirmation...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.info("Transaction submitted, waiting for confirmation...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate tokens earned based on quality score
    const qualityScore = articleData.qualityScore || calculateQualityScore({
      title: articleData.title,
      content: articleData.content,
      category: articleData.category
    });
    
    const tokensEarned = Math.floor(qualityScore / 10);
    
    return {
      success: true,
      transactionHash: `0x${Array(64).fill(0).map(() => 
        "0123456789abcdef"[Math.floor(Math.random() * 16)]
      ).join('')}`,
      tokensEarned,
      qualityScore
    };
  } catch (error) {
    console.error("Error submitting to blockchain:", error);
    throw error;
  }
}

// Function to get article details from blockchain (mock)
export async function getArticleFromBlockchain(ipfsHash: string) {
  try {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      author: `0x${Array(40).fill(0).map(() => 
        "0123456789abcdef"[Math.floor(Math.random() * 16)]
      ).join('')}`,
      timestamp: new Date().getTime() - Math.floor(Math.random() * 10000000),
      tokensEarned: Math.floor(Math.random() * 20) + 5,
      qualityScore: Math.floor(Math.random() * 40) + 60,
    };
  } catch (error) {
    console.error("Error fetching article from blockchain:", error);
    throw error;
  }
}
