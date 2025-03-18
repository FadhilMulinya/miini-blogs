import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Copy, ExternalLink, Loader2 } from "lucide-react";
import { copyToClipboard } from "@/utils/articleUtils";

interface IPFSSuccessCardProps {
  ipfsHash: string;
  ipfsUrl: string;
  qualityScore: number;
  blockchainTxHash: string | null;
  tokensEarned: number | null;
  isDeployingToBlockchain: boolean;
  isConnected: boolean;
  onDeployToBlockchain: () => void;
  onCreateNew: () => void;
}

const IPFSSuccessCard: FC<IPFSSuccessCardProps> = ({
  ipfsHash,
  ipfsUrl,
  qualityScore,
  blockchainTxHash,
  tokensEarned,
  isDeployingToBlockchain,
  isConnected,
  onDeployToBlockchain,
  onCreateNew
}) => {
  console.log("Rendering IPFSSuccessCard with props:", {
    ipfsHash,
    ipfsUrl,
    qualityScore
  });
  
  return (
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
              onClick={() => copyToClipboard(ipfsUrl)}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => window.open(ipfsUrl, "_blank")}
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
              (Estimated MINI tokens: {Math.floor(qualityScore / 10)})
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
              onClick={onDeployToBlockchain}
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
          onClick={onCreateNew}
          className="w-full"
        >
          Create New Article
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IPFSSuccessCard;