import { ethers } from "ethers";
import { toast } from "sonner";
import MiniBlogABI from "../contracts/abi.json";

// Export the contract address so it can be imported elsewhere
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// EDU Chain Configuration
export const EDU_CHAIN_CONFIG = {
  chainId: "0xa045c", // 65676 in hex
  chainName: "Open Campus Codex Sepolia",
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18
  },
  rpcUrls: ["https://open-campus-codex-sepolia.drpc.org"],
  blockExplorerUrls: ["https://opencampus-codex.blockscout.com"]
};

// Function to add EDU Chain to MetaMask
export const addEduChainToMetaMask = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [EDU_CHAIN_CONFIG]
    });

    toast.success("Open Campus Codex Sepolia network added to MetaMask");
    return true;
  } catch (error: any) {
    console.error("Failed to add Open Campus Codex Sepolia network:", error);
    toast.error("Failed to add network. Please add it manually in MetaMask.");
    return false;
  }
};

// Basic network switching function
export const ensureEduChainConnection = async () => {
  if (!window.ethereum) {
    toast.error("MetaMask is not installed");
    return false;
  }

  try {
    // Get current chain ID
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    
    if (chainId !== EDU_CHAIN_CONFIG.chainId) {
      // Try to switch to EDU Chain
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: EDU_CHAIN_CONFIG.chainId }]
        });
      } catch (switchError: any) {
        // If chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [EDU_CHAIN_CONFIG]
          });
        } else {
          throw switchError;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring EDU chain connection:", error);
    toast.error("Failed to switch networks. Please switch manually in MetaMask.");
    return false;
  }
};

// A utility function to calculate a quality score - only used for UI, not blockchain
export const calculateQualityScore = (articleData: { title: string, content: string, category: string }) => {
  // Simple quality score calculation
  const titleLength = articleData.title.length;
  const contentLength = articleData.content.length;
  
  // Basic formula - can be enhanced
  let score = Math.min(100, Math.floor(contentLength / 50));
  
  // Adjust for title quality
  if (titleLength > 30) score += 5;
  if (titleLength > 50) score += 10;
  
  // Make sure it doesn't exceed 100
  return Math.min(100, score);
};

// Get provider and signer
export const getProviderAndSigner = async () => {
  // Check if window.ethereum is available (MetaMask or other wallet)
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet detected. Please install MetaMask or another wallet provider.");
  }
  
  try {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create a provider from Ethereum
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get the signer (account)
    const signer = await provider.getSigner();
    
    return { provider, signer };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw error;
  }
};

// Deploy the contract
export async function deployContract() {
  try {
    toast.info("Initializing contract deployment...");
    
    const { signer } = await getProviderAndSigner();
    
    // Create contract factory from ABI and bytecode
    // You need to add the bytecode to this file
    const contractBytecode = "0x..."; // Replace with your contract bytecode
    const contractFactory = new ethers.ContractFactory(
      MiniBlogABI,
      contractBytecode,
      signer
    );
    
    toast.info("Deploying contract, please confirm the transaction in your wallet...");
    
    // Deploy the contract
    const contract = await contractFactory.deploy();
    
    toast.info("Contract deployment submitted, waiting for confirmation...");
    
    // Wait for deployment to be mined
    await contract.deploymentTransaction().wait();
    
    toast.success(`Contract deployed successfully at ${contract.target}`);
    
    return {
      success: true,
      contractAddress: contract.target
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
    toast.error("Failed to deploy contract: " + (error.message || "Unknown error"));
    throw error;
  }
}

// Debug function to log the ABI
const debugABI = () => {
  console.log("ABI Structure:", MiniBlogABI);
  
  // Since MiniBlogABI is directly the array, we just need to check the array
  const safeMintFunc = MiniBlogABI.find(entry => 
    entry.type === 'function' && entry.name === 'safeMint'
  );
  
  if (safeMintFunc) {
    console.log("safeMint function found:", safeMintFunc);
  } else {
    console.log("No safeMint function found! Available functions:", 
      MiniBlogABI
        .filter(entry => entry.type === 'function')
        .map(f => `${f.name}(${f.inputs.map(i => i.type).join(',')})`)
    );
  }
};

// Correctly implemented mintArticleNFT function with updated ABI
export const mintArticleNFT = async (ipfsHash: string) => {
  try {
    // Basic checks
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found. Please install MetaMask.");
    }
    
    await ensureEduChainConnection();
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create a provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    
    console.log("Connected to contract:", CONTRACT_ADDRESS);
    console.log("Using account:", userAddress);
    console.log("Calling safeMint with URI:", ipfsHash);
    
    // Connect to the contract
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MiniBlogABI,
      signer
    );
    
    // Call safeMint with just the IPFS hash as parameter
    const tx = await contract.safeMint(ipfsHash);
    
    console.log("Transaction submitted:", tx.hash);
    toast.info("Transaction submitted");
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    // Try to extract the token ID from events
    let tokenId = null;
    try {
      const transferEvent = receipt.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean)
        .find((event: any) => 
          event?.name === 'Transfer' && 
          event?.args[0] === ethers.ZeroAddress
        );
        
      if (transferEvent) {
        tokenId = transferEvent.args[2].toString();
        console.log("Minted token ID:", tokenId);
      }
    } catch (error) {
      console.log("Could not extract token ID:", error);
    }
    
    return {
      success: true,
      transactionHash: tx.hash,
      tokenId: tokenId
    };
    
  } catch (error: any) {
    console.error("Error minting NFT:", error);
    
    let errorMessage = "Failed to mint NFT";
    if (error.message) {
      errorMessage += `. Error: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
};

// Get article details from blockchain
export async function getArticleFromBlockchain(ipfsHash: string) {
  try {
    toast.info("Fetching article from blockchain...");
    
    const { provider } = await getProviderAndSigner();
    
    // Connect to existing contract (read-only is fine here)
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MiniBlogABI,
      provider
    );
    
    // Call the contract method to get article details
    // Make sure this method name matches your contract's function name
    const articleData = await contract.getArticle(ipfsHash);
    
    return {
      author: articleData.author,
      timestamp: parseInt(articleData.timestamp.toString()) * 1000, // Convert to JS timestamp
      tokensEarned: parseInt(articleData.tokensEarned.toString()),
      qualityScore: parseInt(articleData.qualityScore.toString()),
    };
  } catch (error) {
    console.error("Error fetching article from blockchain:", error);
    toast.error("Failed to fetch article: " + (error.message || "Unknown error"));
    throw error;
  }
}

// Function to get user's token balance
export async function getTokenBalance() {
  try {
    const { signer } = await getProviderAndSigner();
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MiniBlogABI,
      signer
    );
    
    const address = await signer.getAddress();
    const balance = await contract.balanceOf(address);
    
    return ethers.formatUnits(balance, 18); // Assuming 18 decimals, adjust if different
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
}

// Get all articles for a user
export async function getUserArticles() {
  try {
    const { signer } = await getProviderAndSigner();
    const address = await signer.getAddress();
    
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MiniBlogABI,
      signer
    );
    
    // Call the contract method to get user's articles
    // This depends on your contract implementation
    const articleHashes = await contract.getUserArticles(address);
    
    // Fetch details for each article
    const articles = await Promise.all(
      articleHashes.map(async (hash: string) => {
        const details = await getArticleFromBlockchain(hash);
        return {
          ipfsHash: hash,
          ...details
        };
      })
    );
    
    return articles;
  } catch (error) {
    console.error("Error fetching user articles:", error);
    throw error;
  }
}