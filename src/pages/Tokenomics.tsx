
import { HeroSection } from "@/components/ui/hero-section";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Coins, TrendingUp, Users, Pen, Shield, Rocket, Book, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tokenomics = () => {
  // Token allocation data
  const tokenAllocation = [
    { name: "Community Rewards", value: 40, color: "#4A90E2" },
    { name: "Content Creators", value: 25, color: "#8A2BE2" },
    { name: "Development Fund", value: 15, color: "#16A34A" },
    { name: "Team & Advisors", value: 10, color: "#F59E0B" },
    { name: "Liquidity Pool", value: 5, color: "#EF4444" },
    { name: "Marketing", value: 5, color: "#64748B" }
  ];

  // Token utility data
  const tokenUtility = [
    { 
      title: "Content Creation",
      description: "Earn tokens by publishing high-quality articles and receiving engagement from readers.",
      icon: <Pen />,
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      title: "Community Participation",
      description: "Earn tokens by providing valuable feedback, comments, and interactions with published content.",
      icon: <Users />,
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      title: "Governance",
      description: "Use tokens to vote on platform features, improvements, and content curation decisions.",
      icon: <Shield />,
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      title: "Premium Access",
      description: "Unlock exclusive content and features by staking or spending tokens.",
      icon: <Rocket />,
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  // Rewards for different actions
  const rewardsData = [
    { name: "Publishing Article", rewards: 100 },
    { name: "Article View", rewards: 0.1 },
    { name: "Comment", rewards: 5 },
    { name: "Like", rewards: 2 },
    { name: "Share", rewards: 10 },
    { name: "Tip Received", rewards: 15 }
  ];

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-primary">{payload[0].value} MINI tokens</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <Navbar />
      
      <HeroSection
        title="MINI Token Ecosystem"
        subtitle="Our tokenomics model is designed to incentivize quality content creation and community engagement"
      >
        <div className="flex items-center justify-center gap-2 rounded-full bg-secondary/50 backdrop-blur-sm px-4 py-2 mb-4">
          <Coins className="text-primary h-5 w-5" />
          <span className="font-medium">Current Token Price: $0.25 USD</span>
        </div>
      </HeroSection>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Token Allocation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Token Allocation
              </CardTitle>
              <CardDescription>
                Total Supply: 1,000,000,000 MINI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {tokenAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {tokenAllocation.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm">
                      <span className="block">{item.name}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Reward Structure
              </CardTitle>
              <CardDescription>
                Earn tokens by participating in the ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={rewardsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="rewards" 
                      name="MINI Tokens" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4A90E2" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8A2BE2" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Token Utility Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Token Utility</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenUtility.map((item, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl overflow-hidden transition-transform hover:scale-[1.02] duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Staking and Vesting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Token Staking</CardTitle>
              <CardDescription>
                Stake your MINI tokens to earn additional rewards and unlock platform benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Basic Tier</span>
                  <span className="text-sm">100 MINI</span>
                </div>
                <Progress value={20} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground">
                  Benefits: Comment privileges, basic content access
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Creator Tier</span>
                  <span className="text-sm">500 MINI</span>
                </div>
                <Progress value={40} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground">
                  Benefits: Publishing access, premium content access
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Premium Tier</span>
                  <span className="text-sm">2,000 MINI</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground">
                  Benefits: Enhanced visibility, exclusive content, 2x rewards
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Governance Tier</span>
                  <span className="text-sm">10,000 MINI</span>
                </div>
                <Progress value={80} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground">
                  Benefits: Voting rights, proposal creation, 5x rewards
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Vesting Schedule</CardTitle>
              <CardDescription>
                Token release schedule for different allocation categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Community Rewards</span>
                    <span className="text-sm">40% - Linear release over 5 years</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Current release: 15% of total allocation
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Content Creators</span>
                    <span className="text-sm">25% - Linear release over 4 years</span>
                  </div>
                  <Progress value={22} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Current release: 22% of total allocation
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Development Fund</span>
                    <span className="text-sm">15% - Linear release over 3 years</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Current release: 30% of total allocation
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Team & Advisors</span>
                    <span className="text-sm">10% - 1 year cliff, then 3 year vesting</span>
                  </div>
                  <Progress value={10} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Current release: 10% of total allocation (cliff period)
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Liquidity & Marketing</span>
                    <span className="text-sm">10% - Initial release</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Current release: 100% of total allocation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Whitepaper Section */}
        <div className="glass-panel rounded-xl p-8 text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Detailed Tokenomics Whitepaper</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            For a comprehensive overview of our token economics model, governance structure, and long-term sustainability plans, download our detailed whitepaper.
          </p>
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
            Download Whitepaper
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Tokenomics;
