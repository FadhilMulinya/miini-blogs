
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Info, HelpCircle } from "lucide-react";

const InfoCards = () => {
  return (
    <>
      {/* IPFS Storage Information */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Decentralized Storage with IPFS</p>
            <p className="text-muted-foreground">
              Your content will be stored on IPFS through Pinata, ensuring it remains accessible and censorship-resistant. You retain full ownership of your content.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Token Rewards Information */}
      <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Earn MINI Tokens</p>
          <p className="text-muted-foreground">
            You'll receive MINI tokens based on your content's quality score. Higher quality articles earn more tokens!
          </p>
        </div>
      </div>
      
      {/* Quality Score Explanation */}
      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Quality Score Factors</p>
          <p className="text-muted-foreground">
            Our algorithm calculates a quality score based on content length, title effectiveness, and category relevance. This score determines your token rewards.
          </p>
        </div>
      </div>
    </>
  );
};

export default InfoCards;
