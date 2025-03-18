import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, PieChart as PieChartIcon } from "lucide-react";
import { EDU_CHAIN_CONFIG } from "@/lib/blockchain";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Local mock data for tokenomics
const tokenomicsData = {
  tokenInfo: {
    name: "MINI Token",
    symbol: "MINI",
    totalSupply: "1,000,000,000",
    contractAddress: "0x025E2Ca25Cb9E12bd9A5c68c4eD501b10840922c", // Your contract address
    decimals: 18,
    network: "Open Campus Codex Sepolia"
  },
  distribution: [
    { category: "Content Rewards", percentage: 40, color: "#4c6ef5" },
    { category: "Community Building", percentage: 20, color: "#12b886" },
    { category: "Development", percentage: 15, color: "#e64980" },
    { category: "Marketing", percentage: 10, color: "#fab005" },
    { category: "Team", percentage: 10, color: "#15aabf" },
    { category: "Reserve", percentage: 5, color: "#9775fa" }
  ],
  rewardsSystem: {
    contentQualityScoring: "Users earn MINI tokens based on the quality score of their published content. Each post can earn up to 10 MINI tokens.",
    engagementRewards: "Engagement with content through comments and reactions earns additional MINI tokens.",
    stakingOptions: "Users can stake MINI tokens to earn platform benefits including premium features and governance rights."
  },
  utilityFeatures: [
    "Content publishing and access to premium features",
    "Governance voting on platform proposals",
    "Staking for platform benefits",
    "Payment for premium subscriptions and services",
    "Rewards for quality content and engagement"
  ]
};

export default function Tokenomics() {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      try {
        // Use the local data instead of fetching
        setTokenData(tokenomicsData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load tokenomics data");
        setIsLoading(false);
      }
    }, 500); // Add a small delay to show loading state

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Container className="py-12 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tokenomics data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Tokenomics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Function to open block explorer to view the contract
  const viewOnBlockExplorer = () => {
    window.open(
      `${EDU_CHAIN_CONFIG.blockExplorerUrls[0]}/address/${tokenData.tokenInfo.contractAddress}`,
      "_blank"
    );
  };

  return (
    <Container className="py-12">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">MINI Token Tokenomics</h1>
          <p className="text-xl text-muted-foreground">
            The economic framework powering our decentralized content platform
          </p>
        </div>

        {/* Token Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Token Information</CardTitle>
            <CardDescription>Key details about the MINI token</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>{tokenData.tokenInfo.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Symbol</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tokenData.tokenInfo.symbol}</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Network</TableCell>
                    <TableCell>{tokenData.tokenInfo.network}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Supply</TableCell>
                    <TableCell>{tokenData.tokenInfo.totalSupply}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Contract Address</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <code className="text-xs bg-muted p-1 rounded max-w-[200px] overflow-x-auto">
                        {tokenData.tokenInfo.contractAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={viewOnBlockExplorer}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Decimals</TableCell>
                    <TableCell>{tokenData.tokenInfo.decimals}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart Card */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
              <CardDescription>Allocation of MINI tokens</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenData.distribution}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {tokenData.distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rewards System Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Rewards System</CardTitle>
              <CardDescription>How users earn MINI tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Content Quality Scoring</h4>
                <p className="text-muted-foreground text-sm">
                  {tokenData.rewardsSystem.contentQualityScoring}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Engagement Rewards</h4>
                <p className="text-muted-foreground text-sm">
                  {tokenData.rewardsSystem.engagementRewards}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Staking Options</h4>
                <p className="text-muted-foreground text-sm">
                  {tokenData.rewardsSystem.stakingOptions}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Utility Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>Token Utility</CardTitle>
            <CardDescription>Ways to use MINI tokens on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {tokenData.utilityFeatures.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Token utility will expand as the platform grows and evolves on Open Campus Codex.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
