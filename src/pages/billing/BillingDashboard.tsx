import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CreditCard, AlertCircle, DollarSign, Clock, Download, Plus, Trash2 } from 'lucide-react';
import { BillingApi } from '@/generated-api/src/apis/BillingApi';
import { Configuration } from '@/generated-api/src/runtime';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodModal } from './components/PaymentMethodModal';
import { RechargeModal } from './components/RechargeModal';
import { TransactionHistory } from './components/TransactionHistory';
import { formatCurrency } from './utils/formatCurrency';
import { DomainBillingMode, DomainTransactionType, DomainInvoiceStatus } from '@/generated-api/src/models';
import { useDebugMode } from '@/hooks/useDebugMode';

const BillingDashboard: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const { backendUrl } = useDebugMode();

  // Initialize API client
  const getBillingApi = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('No authentication token');
    
    const config = new Configuration({
      basePath: backendUrl || (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.example.com'),
      accessToken: session.access_token,
    });
    return new BillingApi(config);
  };

  // Fetch billing dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['billing-dashboard'],
    queryFn: async () => {
      const api = await getBillingApi();
      return api.billingDashboardGet();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Delete payment method mutation
  const deletePymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      const api = await getBillingApi();
      return api.billingPaymentMethodsIdDelete({ id: paymentMethodId });
    },
    onSuccess: () => {
      toast({
        title: "Payment method removed",
        description: "The payment method has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove payment method",
        variant: "destructive",
      });
    },
  });

  const billingAccount = dashboardData?.billingAccount;
  const isPostpaid = billingAccount?.billingMode === DomainBillingMode.BillingModePostpaid;
  const currentBalance = dashboardData?.currentBalance || 0;
  const monthlySpend = dashboardData?.monthlySpend || 0;
  const paymentMethods = dashboardData?.paymentMethods || [];
  const pendingInvoices = dashboardData?.pendingInvoices || [];
  const recentTransactions = dashboardData?.recentTransactions || [];

  // Alerts for low balance or overdue invoices
  const showLowBalanceAlert = !isPostpaid && currentBalance < 100; // Less than $1
  const hasOverdueInvoices = pendingInvoices.some(invoice => {
    if (!invoice.dueDate) return false;
    return new Date(invoice.dueDate) < new Date();
  });

  if (dashboardLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load billing information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Billing & Payments</h1>
            <p className="text-muted-foreground">
              Manage your organization's billing and payment methods
            </p>
          </div>
          <Badge variant={isPostpaid ? "secondary" : "default"}>
            {isPostpaid ? "Postpaid" : "Prepaid"} Account
          </Badge>
        </div>

        {/* Alerts */}
        {showLowBalanceAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Balance</AlertTitle>
            <AlertDescription>
              Your account balance is low. Please recharge to continue using services.
            </AlertDescription>
          </Alert>
        )}

        {hasOverdueInvoices && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Overdue Invoices</AlertTitle>
            <AlertDescription>
              You have overdue invoices. Please pay them to avoid service interruption.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isPostpaid ? "Amount Due" : "Current Balance"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(currentBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {isPostpaid ? "Outstanding amount" : "Available balance"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlySpend)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month's usage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentMethods.length}</div>
              <p className="text-xs text-muted-foreground">
                Active payment methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            {!isPostpaid && <TabsTrigger value="recharge">Recharge</TabsTrigger>}
            {isPostpaid && <TabsTrigger value="invoices">Invoices</TabsTrigger>}
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest billing activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No recent transactions
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.slice(0, 5).map((transaction, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.createdAt && new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={transaction.type === DomainTransactionType.TransactionTypeCredit ? "default" : "secondary"}>
                            {transaction.type === DomainTransactionType.TransactionTypeCredit ? '+' : '-'}{formatCurrency(transaction.amount || 0)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Invoices (Postpaid) or Quick Recharge (Prepaid) */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isPostpaid ? "Pending Invoices" : "Quick Actions"}
                  </CardTitle>
                  <CardDescription>
                    {isPostpaid ? "Invoices requiring payment" : "Manage your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPostpaid ? (
                    pendingInvoices.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No pending invoices
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {pendingInvoices.map((invoice, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {invoice.dueDate && new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(invoice.totalAmount || 0)}</p>
                              <Badge variant={
                                invoice.dueDate && new Date(invoice.dueDate) < new Date() ? "destructive" : "secondary"
                              }>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowRechargeModal(true)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Recharge Balance
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <Button onClick={() => setShowPaymentModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            {paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment methods added</p>
                  <Button 
                    onClick={() => setShowPaymentModal(true)}
                    className="mt-4"
                  >
                    Add Your First Payment Method
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {method.brand?.toUpperCase()} •••• {method.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                            {method.nickname && (
                              <p className="text-sm text-muted-foreground">
                                {method.nickname}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {method.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => method.paymentMethodId && deletePymentMethodMutation.mutate(method.paymentMethodId)}
                            disabled={deletePymentMethodMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {!isPostpaid && (
            <TabsContent value="recharge" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recharge Balance</h3>
                <Button onClick={() => setShowRechargeModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Balance</CardTitle>
                  <CardDescription>Available funds in your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    {formatCurrency(currentBalance)}
                  </div>
                  <Button onClick={() => setShowRechargeModal(true)}>
                    Recharge Now
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isPostpaid && (
            <TabsContent value="invoices" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Invoices</h3>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {pendingInvoices.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No invoices found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingInvoices.map((invoice, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {invoice.dueDate && new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(invoice.totalAmount || 0)}</p>
                              <Badge variant={
                                invoice.dueDate && new Date(invoice.dueDate) < new Date() ? "destructive" : "secondary"
                              }>
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              {invoice.status === DomainInvoiceStatus.InvoiceStatusOpen && (
                                <Button size="sm">
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <PaymentMethodModal 
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
        />
        
        {!isPostpaid && (
          <RechargeModal 
            open={showRechargeModal}
            onOpenChange={setShowRechargeModal}
            currentBalance={currentBalance}
          />
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;