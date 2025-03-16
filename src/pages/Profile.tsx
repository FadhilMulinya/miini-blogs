
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, ExternalLink, FileText, Award } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { CONTRACT_ADDRESS } from '@/lib/blockchain';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { address, balance, isConnected, connectWallet } = useWallet();

  useEffect(() => {
    // Redirect to home if not connected after a delay
    if (!isConnected && !address) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, navigate]);

  // Handling copy to clipboard
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  if (!isConnected || !address) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full max-w-md text-center bg-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl">Wallet Connection Required</CardTitle>
              <CardDescription>
                Please connect your wallet to view your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="mt-4">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              You will be redirected to the home page in a few seconds...
            </CardFooter>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Wallet Profile</h1>
            <p className="text-muted-foreground">View your wallet details and blog activities</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Wallet Info Card */}
            <Card className="md:col-span-1 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted p-2 rounded text-xs font-mono w-full overflow-x-auto">
                      {address}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="flex-shrink-0"
                      onClick={() => copyToClipboard(address, 'Address copied to clipboard')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Balance</div>
                  <div className="text-2xl font-bold">{balance} ETH</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">MINI Tokens</div>
                  <div className="text-2xl font-bold">
                    {Math.floor(Math.random() * 1000)} MINI
                  </div>
                </div>

                <Separator />

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Etherscan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="md:col-span-2 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Activity
                </CardTitle>
                <CardDescription>
                  Your published articles and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold">{Math.floor(Math.random() * 10)}</div>
                      <div className="text-sm text-muted-foreground">Articles Published</div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary">{Math.floor(Math.random() * 100)}</div>
                      <div className="text-sm text-muted-foreground">Tokens Earned</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Recent Articles</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Example Article Title #{item}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(Date.now() - item * 86400000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">+{10 * item} MINI</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/create-article')}
                >
                  Create New Article
                </Button>
              </CardFooter>
            </Card>

            {/* Contract Info Card */}
            <Card className="md:col-span-3 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Contract Address</div>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted p-2 rounded text-xs font-mono w-full overflow-x-auto">
                        {CONTRACT_ADDRESS}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="flex-shrink-0"
                        onClick={() => copyToClipboard(CONTRACT_ADDRESS, 'Contract address copied to clipboard')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => window.open(`https://etherscan.io/address/${CONTRACT_ADDRESS}`, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Contract on Etherscan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
