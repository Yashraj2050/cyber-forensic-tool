'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Download, Plus, Eye, Calendar, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Report {
  id: string
  title: string
  description: string
  content: string
  format: 'json' | 'pdf'
  createdAt: string
  status: 'draft' | 'generated' | 'archived'
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    format: 'json' as 'json' | 'pdf'
  })

  useEffect(() => {
    // Mock data for demo
    const mockReports: Report[] = [
      {
        id: '1',
        title: 'ShadowHunter Entity Analysis',
        description: 'Comprehensive analysis of ShadowHunter entity and linked wallets',
        content: '{"entity": "ShadowHunter", "riskLevel": 4, "wallets": ["1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"], "findings": "High-risk entity with multiple wallet connections"}',
        format: 'json',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'generated'
      },
      {
        id: '2',
        title: 'CryptoKing Network Investigation',
        description: 'Investigation of CryptoKing and associated blockchain transactions',
        content: '{"entity": "CryptoKing", "riskLevel": 5, "wallets": ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"], "findings": "Critical threat with suspicious transaction patterns"}',
        format: 'pdf',
        createdAt: '2024-01-14T15:45:00Z',
        status: 'generated'
      },
      {
        id: '3',
        title: 'DarkNet Forum Activity Summary',
        description: 'Weekly summary of malicious activities across monitored forums',
        content: '{"period": "2024-01-08 to 2024-01-15", "totalPosts": 342, "maliciousEntities": 23, "suspiciousTransactions": 67}',
        format: 'json',
        createdAt: '2024-01-13T09:20:00Z',
        status: 'draft'
      }
    ]
    setReports(mockReports)
  }, [])

  const handleGenerateReport = async () => {
    if (!newReport.title || !newReport.description) return

    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const report: Report = {
        id: Date.now().toString(),
        title: newReport.title,
        description: newReport.description,
        content: JSON.stringify({
          generatedAt: new Date().toISOString(),
          title: newReport.title,
          description: newReport.description,
          entities: [],
          transactions: [],
          summary: "Auto-generated forensic report"
        }),
        format: newReport.format,
        createdAt: new Date().toISOString(),
        status: 'generated'
      }
      
      setReports([report, ...reports])
      setNewReport({ title: '', description: '', format: 'json' })
      setIsGenerating(false)
    }, 2000)
  }

  const downloadReport = (report: Report) => {
    if (report.format === 'json') {
      const blob = new Blob([report.content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.title.replace(/\s+/g, '_')}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // For PDF, we'll simulate download
      alert('PDF download would be implemented here')
    }
  }

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      draft: 'bg-yellow-600',
      generated: 'bg-green-600',
      archived: 'bg-gray-600'
    }
    const icons = {
      draft: <Clock className="w-3 h-3 mr-1" />,
      generated: <CheckCircle className="w-3 h-3 mr-1" />,
      archived: <FileText className="w-3 h-3 mr-1" />
    }
    return (
      <Badge className={variants[status]}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-400" />
                <span>Forensic Reports</span>
              </CardTitle>
              <CardDescription>
                Generate and download comprehensive forensic investigation reports
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Generate New Report</DialogTitle>
                  <DialogDescription>
                    Create a comprehensive forensic report with current data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Title</label>
                    <Input
                      placeholder="Enter report title..."
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Enter report description..."
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Format</label>
                    <div className="flex space-x-4">
                      <Button
                        variant={newReport.format === 'json' ? 'default' : 'outline'}
                        onClick={() => setNewReport({ ...newReport, format: 'json' })}
                        className={newReport.format === 'json' ? 'bg-green-600' : 'border-gray-600'}
                      >
                        JSON
                      </Button>
                      <Button
                        variant={newReport.format === 'pdf' ? 'default' : 'outline'}
                        onClick={() => setNewReport({ ...newReport, format: 'pdf' })}
                        className={newReport.format === 'pdf' ? 'bg-green-600' : 'border-gray-600'}
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !newReport.title || !newReport.description}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="list">Report Library</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Report Title</TableHead>
                      <TableHead className="text-gray-400">Description</TableHead>
                      <TableHead className="text-gray-400">Format</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-green-400" />
                            <div className="font-medium">{report.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-gray-400 truncate">{report.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                            {report.format.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReport(report)}
                              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Entity Analysis Report</CardTitle>
                    <CardDescription>
                      Comprehensive entity analysis with risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        • Entity profile and aliases<br/>
                        • Risk level assessment<br/>
                        • Associated wallets<br/>
                        • Network connections
                      </div>
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Analysis</CardTitle>
                    <CardDescription>
                      Detailed blockchain transaction analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        • Transaction history<br/>
                        • Pattern analysis<br/>
                        • Suspicious activities<br/>
                        • Network visualization
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Summary</CardTitle>
                    <CardDescription>
                      Weekly activity summary and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        • Activity overview<br/>
                        • Key metrics<br/>
                        • Trend analysis<br/>
                        • Recommendations
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                  <CardDescription>
                    Configure automated report generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium">Daily Activity Summary</div>
                        <div className="text-sm text-gray-400">Generated every day at 6:00 AM</div>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium">Weekly Threat Assessment</div>
                        <div className="text-sm text-gray-400">Generated every Monday at 9:00 AM</div>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <div className="font-medium">Monthly Network Analysis</div>
                        <div className="text-sm text-gray-400">Generated first day of each month</div>
                      </div>
                      <Badge className="bg-yellow-600">Paused</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Preview Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
              <DialogDescription>{selectedReport.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                    {selectedReport.format.toUpperCase()}
                  </Badge>
                  {getStatusBadge(selectedReport.status)}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => downloadReport(selectedReport)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Report Content</h3>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {selectedReport.format === 'json' 
                    ? JSON.stringify(JSON.parse(selectedReport.content), null, 2)
                    : selectedReport.content
                  }
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}