'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Network, Wallet, TrendingUp, AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import { ResponsiveContainer, Sankey, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

interface Transaction {
  id: string
  hash: string
  amount: number
  currency: string
  fromWallet: string
  toWallet: string
  timestamp: string
  isSuspicious: boolean
}

interface WalletNode {
  id: string
  address: string
  type: string
  balance: number
  isSuspicious: boolean
}

interface GraphData {
  nodes: WalletNode[]
  links: Transaction[]
}

export default function BlockchainGraph() {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [selectedNode, setSelectedNode] = useState<WalletNode | null>(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    // Mock data for demo
    const mockData: GraphData = {
      nodes: [
        { id: '1', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', type: 'BTC', balance: 2.5, isSuspicious: false },
        { id: '2', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', type: 'ETH', balance: 15.7, isSuspicious: true },
        { id: '3', address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5', type: 'BTC', balance: 8.3, isSuspicious: false },
        { id: '4', address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', type: 'ETH', balance: 32.1, isSuspicious: true },
        { id: '5', address: '1FeexV6bAHb8ybZiQLN2M7Y9b5zH8nN7X7', type: 'BTC', balance: 45.2, isSuspicious: false },
      ],
      links: [
        { id: '1', hash: 'tx1', amount: 1.2, currency: 'BTC', fromWallet: '1', toWallet: '3', timestamp: '2024-01-15T10:30:00Z', isSuspicious: false },
        { id: '2', hash: 'tx2', amount: 5.5, currency: 'ETH', fromWallet: '2', toWallet: '4', timestamp: '2024-01-14T15:45:00Z', isSuspicious: true },
        { id: '3', hash: 'tx3', amount: 3.1, currency: 'BTC', fromWallet: '3', toWallet: '5', timestamp: '2024-01-13T09:20:00Z', isSuspicious: false },
        { id: '4', hash: 'tx4', amount: 8.7, currency: 'ETH', fromWallet: '4', toWallet: '2', timestamp: '2024-01-12T14:10:00Z', isSuspicious: true },
      ]
    }
    setGraphData(mockData)
  }, [])

  const transactionHistory = [
    { date: '2024-01-10', transactions: 45, suspicious: 12 },
    { date: '2024-01-11', transactions: 52, suspicious: 15 },
    { date: '2024-01-12', transactions: 48, suspicious: 18 },
    { date: '2024-01-13', transactions: 61, suspicious: 22 },
    { date: '2024-01-14', transactions: 58, suspicious: 19 },
    { date: '2024-01-15', transactions: 67, suspicious: 25 },
    { date: '2024-01-16', transactions: 72, suspicious: 28 },
  ]

  const sankeyData = graphData?.links.map(link => [
    link.fromWallet,
    link.toWallet,
    link.amount
  ]) || []

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-400 text-sm">Amount: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-purple-400" />
            <span>Blockchain Transaction Graph</span>
          </CardTitle>
          <CardDescription>
            Visualize wallet connections and transaction patterns across the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="graph" className="space-y-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="graph">Transaction Graph</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Wallet Network</CardTitle>
                      <CardDescription>
                        Interactive visualization of wallet connections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <Sankey
                            data={sankeyData}
                            node={{ stroke: '#6366f1', strokeWidth: 2, fill: '#4f46e5' }}
                            link={{ stroke: '#8b5cf6', strokeWidth: 2, fillOpacity: 0.4 }}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          >
                            <Tooltip content={<CustomTooltip />} />
                          </Sankey>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-sm">Network Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Wallets</span>
                        <Badge className="bg-purple-600">{graphData?.nodes.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Transactions</span>
                        <Badge className="bg-cyan-600">{graphData?.links.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Suspicious Nodes</span>
                        <Badge className="bg-red-600">
                          {graphData?.nodes.filter(n => n.isSuspicious).length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Value</span>
                        <Badge className="bg-green-600">$124.5K</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {graphData?.links.slice(0, 5).map((link) => (
                        <div key={link.id} className="p-3 bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={link.isSuspicious ? "destructive" : "outline"} 
                                   className={link.isSuspicious ? "bg-red-600" : "border-green-500 text-green-400"}>
                              {link.currency}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {new Date(link.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <div className="text-gray-400">From: {link.fromWallet.slice(0, 8)}...</div>
                            <div className="text-gray-400">To: {link.toWallet.slice(0, 8)}...</div>
                            <div className="font-medium text-cyan-400">{link.amount} {link.currency}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Volume</CardTitle>
                    <CardDescription>
                      Daily transaction trends over the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={transactionHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="transactions"
                            stroke="#06B6D4"
                            strokeWidth={2}
                            name="Total Transactions"
                          />
                          <Line
                            type="monotone"
                            dataKey="suspicious"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Suspicious"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Wallet Analysis</CardTitle>
                    <CardDescription>
                      Top wallets by transaction volume and risk level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {graphData?.nodes.map((node) => (
                        <div key={node.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Wallet className="h-5 w-5 text-purple-400" />
                            <div>
                              <div className="font-medium text-sm">{node.address.slice(0, 10)}...</div>
                              <div className="text-xs text-gray-400">{node.type} • {node.balance} {node.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {node.isSuspicious && (
                              <Badge className="bg-red-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Suspicious
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                              High Volume
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suspicious" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span>Suspicious Activity Detection</span>
                  </CardTitle>
                  <CardDescription>
                    Automated detection of potentially malicious transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm">High Risk Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-400">12</div>
                          <p className="text-xs text-gray-400">Detected this week</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm">Mixing Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-400">7</div>
                          <p className="text-xs text-gray-400">Identified wallets</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm">Rapid Transfers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-400">23</div>
                          <p className="text-xs text-gray-400">Fast sequences</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-red-400">Recent Suspicious Transactions</h3>
                      {graphData?.links.filter(link => link.isSuspicious).map((link) => (
                        <div key={link.id} className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                              <span className="font-medium text-red-400">Suspicious Transaction</span>
                            </div>
                            <Badge className="bg-red-600">
                              {link.currency} {link.amount}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            <div>Hash: {link.hash}</div>
                            <div>From: {link.fromWallet.slice(0, 15)}...</div>
                            <div>To: {link.toWallet.slice(0, 15)}...</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">
                                {new Date(link.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}