import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: Date;
  location: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  merchant: string;
}

const generateMockTransaction = (): Transaction => {
  const amounts = [150, 2500, 75, 1200, 45, 890, 3500, 125, 67, 1800];
  const locations = ['Riyadh', 'Jeddah', 'Dammam', 'Dubai', 'Kuwait', 'Doha'];
  const merchants = ['Al-Rashid Store', 'Saudi Market', 'Gulf Electronics', 'Royal Plaza', 'City Mall'];
  const types = ['Card Payment', 'Online Transfer', 'ATM Withdrawal', 'Mobile Payment'];
  
  const riskScore = Math.floor(Math.random() * 100);
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 70) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';

  return {
    id: `TXN${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    currency: 'SAR',
    timestamp: new Date(),
    location: locations[Math.floor(Math.random() * locations.length)],
    riskScore,
    riskLevel,
    type: types[Math.floor(Math.random() * types.length)],
    merchant: merchants[Math.floor(Math.random() * merchants.length)]
  };
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'high': return 'bg-destructive text-destructive-foreground';
    case 'medium': return 'bg-amber-500 text-amber-50';
    default: return 'bg-success text-success-foreground';
  }
};

export const TransactionMonitor: React.FC = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize with some transactions
    const initialTransactions = Array.from({ length: 10 }, generateMockTransaction);
    setTransactions(initialTransactions);

    // Simulate real-time transactions
    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]); // Keep latest 50
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-[600px] bg-card border-border">
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          {t('transactions.realTimeMonitor') || 'Real-time Transaction Monitor'}
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('transactions.search') || 'Search transactions...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[480px]">
          <div className="space-y-2 p-6 pt-0">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                    "bg-card/50 border-border/50 hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        transaction.riskLevel === 'high' && "bg-destructive",
                        transaction.riskLevel === 'medium' && "bg-amber-500",
                        transaction.riskLevel === 'low' && "bg-success"
                      )} />
                      <span className="font-mono text-sm text-foreground">{transaction.id}</span>
                    </div>
                    <Badge className={getRiskColor(transaction.riskLevel)}>
                      {transaction.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {transaction.riskScore}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{transaction.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        {transaction.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="text-muted-foreground truncate">
                      {transaction.merchant}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    {transaction.type}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};