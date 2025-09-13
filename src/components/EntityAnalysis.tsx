'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, User, Mail, Wallet, Link, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Entity {
  id: string
  alias: string
  username?: string
  email?: string
  riskLevel: number
  isMalicious: boolean
  posts: Post[]
  wallets: Wallet[]
  links: EntityLink[]
}

interface Post {
  id: string
  title: string
  content: string
  forumName?: string
  onionUrl?: string
  timestamp: string
}

interface Wallet {
  id: string
  address: string
  type: string
  balance: number
}

interface EntityLink {
  id: string
  linkType: string
  confidence: number
  toEntity: Entity
}

interface EntityAnalysisProps {
  searchQuery: string
}

export default function EntityAnalysis({ searchQuery }: EntityAnalysisProps) {
  const [entities, setEntities] = useState<Entity[]>([])
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo
    const mockEntities: Entity[] = [
      {
        id: '1',
        alias: 'ShadowHunter',
        username: 'shadow_hunter',
        email: 'shadow@onionmail.com',
        riskLevel: 4,
        isMalicious: true,
        posts: [
          {
            id: '1',
            title: 'Marketplace Discussion',
            content: 'Looking for reliable vendors in the marketplace...',
            forumName: 'DarkNet Forum',
            onionUrl: 'http://forum3ion5k7y.onion',
            timestamp: '2024-01-15T10:30:00Z'
          }
        ],
        wallets: [
          {
            id: '1',
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            type: 'BTC',
            balance: 2.5
          }
        ],
        links: []
      },
      {
        id: '2',
        alias: 'CryptoKing',
        username: 'crypto_king2024',
        email: 'king@crypto.onion',
        riskLevel: 5,
        isMalicious: true,
        posts: [
          {
            id: '2',
            title: 'Investment Opportunities',
            content: 'High ROI investment opportunities available...',
            forumName: 'Crypto Forum',
            onionUrl: 'http://crypto4forum2x7.onion',
            timestamp: '2024-01-14T15:45:00Z'
          }
        ],
        wallets: [
          {
            id: '2',
            address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            type: 'ETH',
            balance: 15.7
          }
        ],
        links: []
      },
      {
        id: '3',
        alias: 'AnonymousUser',
        username: 'anon_user',
        riskLevel: 2,
        isMalicious: false,
        posts: [],
        wallets: [],
        links: []
      }
    ]
    setEntities(mockEntities)
    setLoading(false)
  }, [])

  const filteredEntities = entities.filter(entity =>
    entity.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRiskBadge = (riskLevel: number) => {
    const variants = {
      1: 'bg-green-500',
      2: 'bg-yellow-500',
      3: 'bg-orange-500',
      4: 'bg-red-500',
      5: 'bg-red-700'
    }
    return (
      <Badge className={variants[riskLevel as keyof typeof variants]}>
        Risk Level {riskLevel}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-cyan-400" />
            <span>Entity Analysis</span>
          </CardTitle>
          <CardDescription>
            Search and analyze malicious entities across TOR networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="space-y-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="search">Entity Search</TabsTrigger>
              <TabsTrigger value="linked">Linked Identities</TabsTrigger>
              <TabsTrigger value="stylometry">Stylometry Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by alias, username, or email..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Entity</TableHead>
                      <TableHead className="text-gray-400">Username</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Risk Level</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.map((entity) => (
                      <TableRow key={entity.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-cyan-600 text-white">
                                {entity.alias.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{entity.alias}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{entity.username}</TableCell>
                        <TableCell>{entity.email}</TableCell>
                        <TableCell>{getRiskBadge(entity.riskLevel)}</TableCell>
                        <TableCell>
                          {entity.isMalicious ? (
                            <Badge variant="destructive" className="bg-red-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Malicious
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Clean
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEntity(entity)}
                            className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="linked" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Linked Identities</CardTitle>
                  <CardDescription>
                    Entities connected through shared wallets, posting patterns, or other attributes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-600 text-white">SH</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">ShadowHunter</div>
                        <div className="text-sm text-gray-400">Connected to CryptoKing via shared wallet pattern</div>
                      </div>
                      <Badge className="bg-purple-600">87% Match</Badge>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-orange-600 text-white">CK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">CryptoKing</div>
                        <div className="text-sm text-gray-400">Connected to ShadowHunter via posting stylometry</div>
                      </div>
                      <Badge className="bg-orange-600">92% Match</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stylometry" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Stylometry Analysis</CardTitle>
                  <CardDescription>
                    Writing pattern analysis to identify potential authorship connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm">Writing Style Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Avg. Sentence Length</span>
                            <span className="text-sm">12.5 words</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Vocabulary Richness</span>
                            <span className="text-sm">0.78</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Punctuation Pattern</span>
                            <span className="text-sm">Moderate</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-sm">Similarity Scores</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">ShadowHunter vs CryptoKing</span>
                            <Badge className="bg-red-600">94%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">ShadowHunter vs AnonymousUser</span>
                            <Badge className="bg-yellow-600">23%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">CryptoKing vs AnonymousUser</span>
                            <Badge className="bg-green-600">12%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Entity Details Modal */}
      {selectedEntity && (
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-cyan-600 text-white text-lg">
                    {selectedEntity.alias.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedEntity.alias}</CardTitle>
                  <CardDescription>{selectedEntity.username}</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedEntity(null)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-cyan-400">Entity Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Email:</span>
                    <span className="text-sm">{selectedEntity.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Risk Level:</span>
                    {getRiskBadge(selectedEntity.riskLevel)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-purple-400">Associated Wallets</h3>
                <div className="space-y-2">
                  {selectedEntity.wallets.map((wallet) => (
                    <div key={wallet.id} className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{wallet.type}:</span>
                      <span className="text-sm font-mono">{wallet.address}</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        {wallet.balance} {wallet.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}