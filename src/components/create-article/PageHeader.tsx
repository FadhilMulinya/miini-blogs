
import { FileText, Database } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Create New Article</h1>
      <p className="text-muted-foreground flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Publish your content to IPFS and earn MINI tokens by deploying to the blockchain
      </p>
      <div className="flex items-center gap-2 mt-2 text-sm">
        <Database className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Your content will be permanently stored on IPFS and optionally on the blockchain</span>
      </div>
    </div>
  );
};

export default PageHeader;
