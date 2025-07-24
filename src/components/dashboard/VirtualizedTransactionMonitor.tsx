import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Clock, DollarSign, AlertTriangle, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import AISummary from './AISummary';

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
  const amounts = [150, 2500, 75, 1200, 45, 890, 3500, 125, 67, 1800, 25000, 450, 12500, 330, 1950];
  const locations = ['Riyadh', 'Jeddah', 'Dammam', 'Dubai', 'Kuwait', 'Doha', 'Manama', 'Abu Dhabi', 'Muscat'];
  const merchants = ['Al-Rashid Store', 'Saudi Market', 'Gulf Electronics', 'Royal Plaza', 'City Mall', 'Desert Tech', 'Pearl Shopping', 'Grand Bazaar'];
  const types = ['Card Payment', 'Online Transfer', 'ATM Withdrawal', 'Mobile Payment', 'Wire Transfer'];
  
  const riskScore = Math.floor(Math.random() * 100);
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 70) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';

  return {
    id: `TXN${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    currency: 'SAR',
    timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time within last day
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

// Memoized transaction row component for optimal performance
const TransactionRow = React.memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number; 
  style: React.CSSProperties; 
  data: { 
    transactions: Transaction[]; 
    onGenerateAISummary: (transaction: Transaction) => void;
    t: (key: string) => string;
  }
}) => {
  const { transactions, onGenerateAISummary, t } = data;
  const transaction = transactions[index];

  if (!transaction) return null;

  return (
    <div style={style} className="px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "p-4 rounded-lg border transition-all duration-200 hover:shadow-md mb-2",
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
          <div className="flex items-center gap-2">
            <Badge className={getRiskColor(transaction.riskLevel)}>
              {transaction.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {transaction.riskScore}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateAISummary(transaction)}
              className="gap-1 h-6 px-2 text-xs"
            >
              <Brain className="h-3 w-3" />
              {t('ai.generateSummary')}
            </Button>
          </div>
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
    </div>
  );
});

TransactionRow.displayName = 'TransactionRow';

export const VirtualizedTransactionMonitor: React.FC = () => {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAISummary, setShowAISummary] = useState(false);

  useEffect(() => {
    // Initialize with 1000+ transactions for performance testing
    const initialTransactions = Array.from({ length: 1200 }, generateMockTransaction);
    setTransactions(initialTransactions);

    // Simulate real-time transactions
    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 1999)]); // Keep latest 2000
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Debounced search with useMemo for performance
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.id.toLowerCase().includes(lowercaseSearch) ||
      transaction.merchant.toLowerCase().includes(lowercaseSearch) ||
      transaction.location.toLowerCase().includes(lowercaseSearch)
    );
  }, [transactions, searchTerm]);

  const handleGenerateAISummary = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowAISummary(true);
  }, []);

  const handleCloseSummary = useCallback(() => {
    setShowAISummary(false);
    setSelectedTransaction(null);
  }, []);

  // Memoized data for the virtual list
  const listData = useMemo(() => ({
    transactions: filteredTransactions,
    onGenerateAISummary: handleGenerateAISummary,
    t
  }), [filteredTransactions, handleGenerateAISummary, t]);

  return (
    <>
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              {t('transactions.realTimeMonitor') || 'Real-time Transaction Monitor'}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length.toLocaleString()} transactions
            </div>
          </div>
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
        <CardContent className="p-0 flex-1 min-h-0">
          {filteredTransactions.length > 0 ? (
            <List
              height={480}
              width="100%"
              itemCount={filteredTransactions.length}
              itemSize={140}
              itemData={listData}
              overscanCount={5}
              className="scrollbar-thin"
            >
              {TransactionRow}
            </List>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No transactions found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <AISummary
          transaction={selectedTransaction}
          isOpen={showAISummary}
          onClose={handleCloseSummary}
        />
      )}
    </>
  );
};