import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Copy, ExternalLink, Loader2, AlertTriangle, AlertCircle } from "lucide-react";
import { copyToClipboard, deployToBlockchain } from "@/utils/articleUtils";
import { toast } from "sonner";
import { ensureEduChainConnection, EDU_CHAIN_CONFIG } from "@/lib/blockchain";
import { useWallet } from "@/context/WalletContext";

interface PublishedArticleViewProps {
  article: {
    ipfsHash: string;
    ipfsUrl: string;
    qualityScore: number;
    title: string;
    content: string;
    category: string;
    excerpt?: string;
    blockchainTxHash?: string;
    tokensEarned?: number;
  };
  address?: string;
  isConnected: boolean;
  onNewArticle: () => void;
}

export function NetworkSwitcher() {
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { isConnected } = useWallet();

  useEffect(() => {
    if (!isConnected) return;

    const checkNetwork = async () => {
      try {
        if (!window.ethereum) return;
        
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setIsWrongNetwork(chainId !== EDU_CHAIN_CONFIG.chainId);
        
        // Listen for chain changes
        const handleChainChanged = (newChainId: string) => {
          setIsWrongNetwork(newChainId !== EDU_CHAIN_CONFIG.chainId);
        };
        
        window.ethereum.on("chainChanged", handleChainChanged);
        
        return () => {
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
      } catch (error) {
        console.error("Error checking network:", error);
      }
    };
    
    checkNetwork();
  }, [isConnected]);

  const handleSwitchNetwork = async () => {
    await ensureEduChainConnection();
  };

  if (!isConnected || !isWrongNetwork) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wrong Network</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Please connect to the Open Campus Codex Sepolia network to continue.
        </p>
        <Button onClick={handleSwitchNetwork} variant="outline" size="sm">
          Switch Network
        </Button>
      </AlertDescription>
    </Alert>
  );
}

const PublishedArticleView = ({ 
  article, 
  address,
  isConnected,
  onNewArticle 
}: PublishedArticleViewProps) => {
  const [isDeployingToBlockchain, setIsDeployingToBlockchain] = useState(false);
  const [blockchainTxHash, setBlockchainTxHash] = useState<string | null>(article.blockchainTxHash || null);
  const [tokensEarned, setTokensEarned] = useState<number | null>(article.tokensEarned || null);

  const handleDeployToBlockchain = async () => {
    console.log("THe error is here");

    if (!article.ipfsHash || !article.qualityScore || !address) {
      console.log("THe error is here");
      toast.error("Missing required information for blockchain deployment");
      return;
    }
    
    setIsDeployingToBlockchain(true);
    
    try {
      toast.info("Preparing transaction...");
      
      const blockchainResponse = await deployToBlockchain(
        article.ipfsHash,
        article.qualityScore,
        {
          title: article.title,
          content: article.content,
          category: article.category,
          excerpt: article.excerpt || article.title.substring(0, 150),
          coverImage: null,
          coverImagePreview: ""
        },
        address
      );
      
      setBlockchainTxHash(blockchainResponse.transactionHash);
      setTokensEarned(blockchainResponse.tokensEarned);
      
      toast.success(`Article published to Open Campus Codex! You earned ${blockchainResponse.tokensEarned} MINI tokens`);
      
      // Save blockchain tx info to localStorage
      const savedArticle = JSON.parse(localStorage.getItem('publishedArticle') || '{}');
      savedArticle.blockchainTxHash = blockchainResponse.transactionHash;
      savedArticle.tokensEarned = blockchainResponse.tokensEarned;
      localStorage.setItem('publishedArticle', JSON.stringify(savedArticle));
      
    } catch (error: any) {
      console.error("Error deploying to blockchain:", error);
      
      const errorMessage = error.message || "Failed to deploy to blockchain. Please try again.";
      toast.error(errorMessage);
      
    } finally {
      setIsDeployingToBlockchain(false);
    }
  };
  
  return (
    <Card className="border-primary/20 glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Content Successfully Uploaded to IPFS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && <NetworkSwitcher />}
        
        <div>
          <Label className="text-sm text-muted-foreground">IPFS Hash (CID)</Label>
          <div className="flex items-center mt-1">
            <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
              {article.ipfsHash}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(article.ipfsHash)}
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
              {article.ipfsUrl}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(article.ipfsUrl)}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => window.open(article.ipfsUrl, "_blank")}
              className="ml-1"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Content Quality Score</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-2xl font-bold">{article.qualityScore}/100</div>
            <div className="text-sm text-muted-foreground">
              (Estimated MINI tokens: {Math.floor(article.qualityScore / 10)})
            </div>
          </div>
        </div>
        
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <AlertTriangle className="h-4 w-4 text-blue-500" />
          <AlertTitle>Open Campus Codex Network</AlertTitle>
          <AlertDescription>
            This app deploys to the Open Campus Codex Sepolia testnet.
            Make sure your wallet is connected to this network before proceeding.
          </AlertDescription>
        </Alert>
        
        {blockchainTxHash ? (
          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Successfully deployed to Open Campus Codex</AlertTitle>
            <AlertDescription>
              <div>Transaction Hash: <code className="text-xs">{blockchainTxHash}</code></div>
              <div className="mt-1">You earned {tokensEarned} MINI tokens for this content!</div>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs mt-1"
                onClick={() => window.open(`${EDU_CHAIN_CONFIG.blockExplorerUrls[0]}/tx/${blockchainTxHash}`, "_blank")}
              >
                View on Block Explorer <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
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
                  Deploying to Open Campus Codex...
                </>
              ) : "Deploy to Open Campus Codex & Earn MINI Tokens"}
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
          onClick={onNewArticle}
          className="w-full"
        >
          Create New Article
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PublishedArticleView;