import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Filter } from 'lucide-react';
import { BillingApi } from '@/generated-api/src/apis/BillingApi';
import { createApiClient } from '@/services/backendApi';
import { formatCurrency } from '../utils/formatCurrency';
import { DomainTransactionType } from '@/generated-api/src/models';
import { useDebugMode } from '@/hooks/useDebugMode';

export const TransactionHistory: React.FC = () => {
  const { backendUrl } = useDebugMode();
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    limit: 50,
    offset: 0,
  });

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['billing-transactions', filters],
    queryFn: async () => {
      const api = await createApiClient(BillingApi);
      
      return api.billingTransactionsGet({
        limit: filters.limit,
        offset: filters.offset,
      });
    },
  });

  const handleExport = () => {
    // Implementation for exporting transaction history
    console.log('Exporting transaction history...');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'recharge':
        return 'default';
      case 'debit':
      case 'charge':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filters.search && !transaction.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && transaction.type?.toLowerCase() !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && transaction.status?.toLowerCase() !== filters.status) {
      return false;
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load transaction history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and filter all your billing transactions</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="recharge">Recharge</SelectItem>
                <SelectItem value="charge">Charge</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={transaction.transactionId || index}>
                      <TableCell>
                        {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.description || 'Transaction'}</p>
                          {transaction.referenceId && (
                            <p className="text-sm text-muted-foreground">Ref: {transaction.referenceId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(transaction.type || '')}>
                          {transaction.type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          transaction.type === DomainTransactionType.TransactionTypeCredit ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === DomainTransactionType.TransactionTypeCredit ? '+' : '-'}{formatCurrency(transaction.amount || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(transaction.balanceAfter || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transaction.status || '')}>
                          {transaction.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredTransactions.length >= filters.limit && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
              >
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};