import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  CreditCard,
  AlertTriangle,
  Brain,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedAISummary from '@/components/dashboard/EnhancedAISummary';

interface TransactionDetail {
  id: string;
  amount: number;
  currency: string;
  timestamp: Date;
  location: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  merchant: string;
  cardNumber: string;
  status: string;
  description: string;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'bg-destructive text-destructive-foreground';
    case 'medium': return 'bg-amber-500 text-amber-50';
    default: return 'bg-success text-success-foreground';
  }
};

const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching transaction details
    const fetchTransaction = async () => {
      setLoading(true);
      
      // Mock transaction data
      const mockTransaction: TransactionDetail = {
        id: id || 'TXN123456',
        amount: Math.floor(Math.random() * 10000) + 100,
        currency: 'SAR',
        timestamp: new Date(),
        location: 'Riyadh, Saudi Arabia',
        riskScore: Math.floor(Math.random() * 100),
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        type: 'Card Payment',
        merchant: 'Grand Bazaar',
        cardNumber: '**** **** **** 4532',
        status: 'Completed',
        description: 'Online purchase transaction with elevated risk indicators'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransaction(mockTransaction);
      setLoading(false);
    };

    fetchTransaction();
  }, [id]);

  const handleGenerateAISummary = () => {
    if (transaction) {
      setShowAISummary(true);
    }
  };

  const handleCloseSummary = () => {
    setShowAISummary(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center h-96 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Transaction Not Found</h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="hover-scale"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction Details</h1>
              <p className="text-muted-foreground">Transaction ID: {transaction.id}</p>
            </div>
          </div>
          
          <Button
            onClick={handleGenerateAISummary}
            className="gap-2 hover-scale"
          >
            <Brain className="w-4 h-4" />
            Generate AI Summary
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transaction Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Transaction Overview</span>
                    <Badge className={getRiskColor(transaction.riskLevel)}>
                      {transaction.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      Risk: {transaction.riskScore}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold text-lg">
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-semibold">{transaction.status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{transaction.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Merchant & Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.cardNumber}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Merchant</p>
                      <p className="font-medium">{transaction.merchant}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{transaction.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Risk Analysis Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                      transaction.riskLevel === 'high' ? 'bg-destructive/10' :
                      transaction.riskLevel === 'medium' ? 'bg-amber-500/10' :
                      'bg-success/10'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        transaction.riskLevel === 'high' ? 'text-destructive' :
                        transaction.riskLevel === 'medium' ? 'text-amber-500' :
                        'text-success'
                      }`}>
                        {transaction.riskScore}
                      </span>
                    </div>
                    <p className="font-medium">Risk Score</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.riskLevel.charAt(0).toUpperCase() + transaction.riskLevel.slice(1)} Risk Level
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Risk Factors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Location Risk</span>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Amount Anomaly</span>
                        <Badge variant="outline" className="text-xs">Low</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time Pattern</span>
                        <Badge variant="outline" className="text-xs">Normal</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Summary Modal */}
      {transaction && (
        <EnhancedAISummary
          transaction={transaction}
          isOpen={showAISummary}
          onClose={handleCloseSummary}
        />
      )}
    </div>
  );
};

export default TransactionDetails;