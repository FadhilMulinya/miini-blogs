import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/lib/utils';
import { ensureEduChainConnection } from "@/lib/blockchain";
import { toast } from "sonner";

const WalletConnect: React.FC = () => {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  useEffect(() => {
    // When a user connects, check if they're on the right network
    if (isConnected) {
      ensureEduChainConnection().catch(error => {
        console.error("Network check error:", error);
      });
    }
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      await connectWallet();
      // After connecting, ensure they're on the right network
      await ensureEduChainConnection();
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div>
      {isConnected && address ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
              onClick={disconnectWallet}
            >
              <span className="font-mono">{shortenAddress(address)}</span>
              <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Disconnect Wallet</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
