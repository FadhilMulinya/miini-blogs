"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Copy, CheckCircle2, Sparkles, Award, Zap, Wallet, Users, Code } from "lucide-react"
import { EDU_CHAIN_CONFIG } from "@/lib/blockchain"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Navbar from "@/components/layout/Navbar"
import { motion } from "framer-motion"

// Local mock data for tokenomics
const tokenomicsData = {
  tokenInfo: {
    name: "MINI Token",
    symbol: "MINI",
    totalSupply: "1,000,000,000",
    contractAddress: "0x025E2Ca25Cb9E12bd9A5c68c4eD501b10840922c", // Your contract address
    decimals: 18,
    network: "Open Campus Codex Sepolia",
  },
  distribution: [
    { category: "Content Rewards", percentage: 40, color: "#4c6ef5" },
    { category: "Community Building", percentage: 20, color: "#12b886" },
    { category: "Development", percentage: 15, color: "#e64980" },
    { category: "Marketing", percentage: 10, color: "#fab005" },
    { category: "Team", percentage: 10, color: "#15aabf" },
    { category: "Reserve", percentage: 5, color: "#9775fa" },
  ],
  rewardsSystem: {
    contentQualityScoring:
      "Users earn MINI tokens based on the quality score of their published content. Each post can earn up to 10 MINI tokens.",
    engagementRewards: "Engagement with content through comments and reactions earns additional MINI tokens.",
    stakingOptions:
      "Users can stake MINI tokens to earn platform benefits including premium features and governance rights.",
  },
  utilityFeatures: [
    { title: "Premium Content Access", description: "Unlock exclusive articles and features", icon: Sparkles },
    { title: "Governance Voting", description: "Participate in platform decision making", icon: Users },
    { title: "Staking Rewards", description: "Earn passive income through staking", icon: Award },
    { title: "Platform Payments", description: "Pay for premium subscriptions and services", icon: Wallet },
    { title: "Content Rewards", description: "Get rewarded for quality contributions", icon: Zap },
  ],
}

export default function Tokenomics() {
  const [isLoading, setIsLoading] = useState(true)
  const [tokenData, setTokenData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      try {
        // Use the local data instead of fetching
        setTokenData(tokenomicsData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load tokenomics data")
        setIsLoading(false)
      }
    }, 500) // Add a small delay to show loading state

    return () => clearTimeout(timer)
  }, [])

  // Function to open block explorer to view the contract
  const viewOnBlockExplorer = () => {
    window.open(`${EDU_CHAIN_CONFIG.blockExplorerUrls[0]}/address/${tokenData.tokenInfo.contractAddress}`, "_blank")
  }
  const viewToken = () => {
    window.open(`${EDU_CHAIN_CONFIG.blockExplorerUrls[0]}/address/0x4801472286915Af3A3212326D888601Cb45Da0BD`, "_blank")
  }

  //0x4801472286915Af3A3212326D888601Cb45Da0BD

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenData.tokenInfo.contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-blue-200/50"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          </div>
          <p className="text-blue-700 font-medium text-lg animate-pulse">Loading tokenomics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Container className="py-12">
        <Card className="border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Tokenomics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <Navbar />
      <Container className="py-16">
        <div className="space-y-12">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-blue-200/50"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-full shadow-lg">
                  <Code className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              MINI BLOG TOKEN Tokenomics
            </h1>
            <p className="text-xl text-blue-600/80 max-w-2xl mx-auto">
              The economic framework powering our decentralized content platform on Open Campus Codex
            </p>
          </motion.div>

          {/* Token Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  Token Information
                </CardTitle>
                <CardDescription>Key details about the MINI token</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-lg px-3 py-1 h-auto">
                          {tokenData.tokenInfo.symbol}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600/70">Token Name</p>
                        <p className="font-semibold text-lg">{tokenData.tokenInfo.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600/70">Total Supply</p>
                        <p className="font-semibold text-lg">{tokenData.tokenInfo.totalSupply}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600/70">Network</p>
                        <p className="font-semibold">{tokenData.tokenInfo.network}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-600/70 mb-2">Contract Address</p>
                      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                        <code className="text-xs font-mono text-blue-800 flex-1 overflow-hidden text-ellipsis">
                        0x4801472286915Af3A3212326D888601Cb45Da0BD
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={copyAddress}
                        >
                          {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={viewToken}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Code className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600/70">Decimals</p>
                        <p className="font-semibold">{tokenData.tokenInfo.decimals}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distribution Chart Card */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:col-span-1"
            >
              <Card className="border-0 shadow-xl h-full bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    Token Distribution
                  </CardTitle>
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
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {tokenData.distribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          border: "none",
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          paddingLeft: "20px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rewards System Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:col-span-1"
            >
              <Card className="border-0 shadow-xl h-full bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    Rewards System
                  </CardTitle>
                  <CardDescription>How users earn MINI tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="group p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-blue-800">Content Quality Scoring</h4>
                    </div>
                    <p className="text-blue-600/80 pl-11">{tokenData.rewardsSystem.contentQualityScoring}</p>
                  </div>

                  <div className="group p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-blue-800">Engagement Rewards</h4>
                    </div>
                    <p className="text-blue-600/80 pl-11">{tokenData.rewardsSystem.engagementRewards}</p>
                  </div>

                  <div className="group p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg text-blue-800">Staking Options</h4>
                    </div>
                    <p className="text-blue-600/80 pl-11">{tokenData.rewardsSystem.stakingOptions}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Utility Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  Token Utility
                </CardTitle>
                <CardDescription>Ways to use MINI tokens on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {tokenData.utilityFeatures.map((feature: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index + 0.7 }}
                      className="group p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 transition-all duration-300 hover:shadow-md hover:bg-blue-50"
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                          <feature.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-lg text-blue-800">{feature.title}</h4>
                        <p className="text-blue-600/80 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-blue-50 to-transparent border-t border-blue-100 py-4">
                <p className="text-sm text-blue-600/80 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Token utility will expand as the platform grows and evolves on Open Campus Codex.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}

