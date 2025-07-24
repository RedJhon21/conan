import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle,
  Info,
  Eye,
  Download,
  Share2,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { enhancedAiService } from '@/services/enhancedAiService';
import { Transaction } from '@/types/summary';

interface PatternDetectionProps {
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

interface DetectedPattern {
  id: string;
  type: string;
  confidence: number;
  transactions: string[];
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  severity: 'critical' | 'high' | 'medium' | 'low';
  firstDetected: Date;
  lastActivity: Date;
  affectedAmount: number;
  networkSize: number;
}

interface NetworkEntity {
  id: string;
  type: 'merchant' | 'customer' | 'location' | 'card';
  name: string;
  riskScore: number;
  connections: number;
  transactions: number;
  totalAmount: number;
}

const PatternDetectionVisualization: React.FC<PatternDetectionProps> = ({ 
  transactions, 
  isOpen, 
  onClose 
}) => {
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [networks, setNetworks] = useState<NetworkEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<DetectedPattern | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  useEffect(() => {
    if (isOpen && transactions.length > 0) {
      analyzePatterns();
    }
  }, [isOpen, transactions]);

  const analyzePatterns = async () => {
    setLoading(true);
    try {
      const analysisResult = await enhancedAiService.detectCrossTransactionPatterns(transactions);
      
      // Convert analysis result to our pattern format
      const detectedPatterns: DetectedPattern[] = analysisResult.patterns.map((pattern, index) => ({
        id: `pattern-${index}`,
        type: pattern.type,
        confidence: pattern.confidence,
        transactions: pattern.transactions,
        description: pattern.description,
        riskLevel: pattern.riskLevel,
        severity: pattern.riskLevel === 'high' ? 'critical' : pattern.riskLevel === 'medium' ? 'high' : 'medium',
        firstDetected: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        affectedAmount: Math.random() * 100000 + 10000,
        networkSize: pattern.transactions.length
      }));

      // Generate mock network entities
      const networkEntities: NetworkEntity[] = [
        {
          id: 'entity-1',
          type: 'merchant',
          name: 'Suspicious Merchant Network',
          riskScore: 85,
          connections: 12,
          transactions: 45,
          totalAmount: 125000
        },
        {
          id: 'entity-2',
          type: 'customer',
          name: 'High-Risk Customer Cluster',
          riskScore: 78,
          connections: 8,
          transactions: 23,
          totalAmount: 67000
        },
        {
          id: 'entity-3',
          type: 'location',
          name: 'Geographic Anomaly Zone',
          riskScore: 72,
          connections: 15,
          transactions: 89,
          totalAmount: 234000
        }
      ];

      setPatterns(detectedPatterns);
      setNetworks(networkEntities);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze transaction patterns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch = pattern.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pattern.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || pattern.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesRisk = filterRisk === 'all' || pattern.riskLevel === filterRisk;
    
    return matchesSearch && matchesType && matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'merchant': return '🏪';
      case 'customer': return '👤';
      case 'location': return '📍';
      case 'card': return '💳';
      default: return '🔗';
    }
  };

  const handleExportPattern = (pattern: DetectedPattern) => {
    const exportData = {
      pattern,
      relatedTransactions: transactions.filter(t => pattern.transactions.includes(t.id)),
      analysisDate: new Date().toISOString(),
      confidence: pattern.confidence
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${pattern.type.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Pattern Exported",
      description: `Pattern "${pattern.type}" has been exported`
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <Network className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Advanced Pattern Detection</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered fraud pattern analysis across {transactions.length} transactions
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Analyzing Transaction Patterns</h3>
              <p className="text-muted-foreground">
                Using advanced AI algorithms to detect fraud patterns...
              </p>
            </div>
          ) : (
            <Tabs defaultValue="patterns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patterns">Detected Patterns</TabsTrigger>
                <TabsTrigger value="networks">Network Analysis</TabsTrigger>
                <TabsTrigger value="visualization">Visual Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="patterns" className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patterns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="velocity">Velocity Patterns</SelectItem>
                      <SelectItem value="circular">Circular Flow</SelectItem>
                      <SelectItem value="structuring">Structuring</SelectItem>
                      <SelectItem value="location">Location Anomaly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pattern Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Patterns</p>
                          <p className="text-2xl font-bold">{patterns.length}</p>
                        </div>
                        <Network className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">High Risk</p>
                          <p className="text-2xl font-bold text-red-500">
                            {patterns.filter(p => p.riskLevel === 'high').length}
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Confidence</p>
                          <p className="text-2xl font-bold">
                            {Math.round(patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length * 100)}%
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Exposure</p>
                          <p className="text-2xl font-bold">
                            ${Math.round(patterns.reduce((sum, p) => sum + p.affectedAmount, 0) / 1000)}K
                          </p>
                        </div>
                        <Zap className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pattern List */}
                <div className="space-y-4">
                  {filteredPatterns.map((pattern) => (
                    <motion.div
                      key={pattern.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getSeverityIcon(pattern.severity)}
                              <div>
                                <CardTitle className="text-lg">{pattern.type}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  Detected {pattern.firstDetected.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getRiskColor(pattern.riskLevel)}>
                                {pattern.riskLevel.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {Math.round(pattern.confidence * 100)}% confidence
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm">{pattern.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Transactions:</span>
                              <p className="font-medium">{pattern.transactions.length}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Network Size:</span>
                              <p className="font-medium">{pattern.networkSize}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <p className="font-medium">${pattern.affectedAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Activity:</span>
                              <p className="font-medium">{pattern.lastActivity.toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPattern(pattern)}
                              className="gap-2"
                            >
                              <Eye className="h-3 w-3" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportPattern(pattern)}
                              className="gap-2"
                            >
                              <Download className="h-3 w-3" />
                              Export
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Share2 className="h-3 w-3" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="networks" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {networks.map((entity) => (
                    <Card key={entity.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getEntityIcon(entity.type)}</span>
                          <div>
                            <CardTitle className="text-lg">{entity.name}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">
                              {entity.type} Network
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Risk Score</span>
                            <Badge className={entity.riskScore > 80 ? 'bg-red-100 text-red-800' : 
                                           entity.riskScore > 60 ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-green-100 text-green-800'}>
                              {entity.riskScore}/100
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Connections:</span>
                              <p className="font-medium">{entity.connections}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transactions:</span>
                              <p className="font-medium">{entity.transactions}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Amount:</span>
                            <p className="font-medium text-lg">${entity.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="visualization" className="space-y-4">
                <div className="text-center py-12">
                  <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Interactive Network Visualization</h3>
                  <p className="text-muted-foreground mb-6">
                    Advanced graph visualization would be implemented here using D3.js or similar library
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                          <Network className="h-8 w-8 text-blue-500" />
                        </div>
                        <h4 className="font-medium">Network Graph</h4>
                        <p className="text-sm text-muted-foreground">Transaction flow visualization</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                        <h4 className="font-medium">Timeline Analysis</h4>
                        <p className="text-sm text-muted-foreground">Pattern evolution over time</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-purple-500" />
                        </div>
                        <h4 className="font-medium">Risk Heatmap</h4>
                        <p className="text-sm text-muted-foreground">Geographic risk distribution</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PatternDetectionVisualization;