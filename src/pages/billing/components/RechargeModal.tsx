import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BillingApi } from '@/generated-api/src/apis/BillingApi';
import { createApiClient } from '@/services/backendApi';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '../utils/formatCurrency';
import { useDebugMode } from '@/hooks/useDebugMode';

interface RechargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
}

const RECHARGE_AMOUNTS = [
  { label: '$10', value: 1000 },
  { label: '$25', value: 2500 },
  { label: '$50', value: 5000 },
  { label: '$100', value: 10000 },
  { label: '$250', value: 25000 },
  { label: '$500', value: 50000 },
];

export const RechargeModal: React.FC<RechargeModalProps> = ({
  open,
  onOpenChange,
  currentBalance,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { backendUrl } = useDebugMode();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    customAmount: '',
  });

  const rechargeMutation = useMutation({
    mutationFn: async (amount: number) => {
      const api = await createApiClient(BillingApi);
      
      return api.billingRechargePost({
        request: {
          amount,
          currency: formData.currency,
          description: `Account recharge - ${formatCurrency(amount)}`,
        },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Recharge initiated",
        description: `Your account recharge of ${formatCurrency(getRechargeAmount())} has been processed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      onOpenChange(false);
      setFormData({ amount: '', currency: 'USD', customAmount: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process recharge",
        variant: "destructive",
      });
    },
  });

  const getRechargeAmount = (): number => {
    if (formData.amount === 'custom') {
      return Math.round(parseFloat(formData.customAmount) * 100); // Convert to cents
    }
    return parseInt(formData.amount) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getRechargeAmount();
    
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount < 500) { // Minimum $5
      toast({
        title: "Error",
        description: "Minimum recharge amount is $5.00",
        variant: "destructive",
      });
      return;
    }

    rechargeMutation.mutate(amount);
  };

  const newBalance = currentBalance + getRechargeAmount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recharge Account</DialogTitle>
          <DialogDescription>
            Add funds to your account balance. Current balance: {formatCurrency(currentBalance)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {RECHARGE_AMOUNTS.map((amount) => (
                <Button
                  key={amount.value}
                  type="button"
                  variant={formData.amount === amount.value.toString() ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setFormData(prev => ({ ...prev, amount: amount.value.toString(), customAmount: '' }))}
                >
                  {amount.label}
                </Button>
              ))}
            </div>
            
            <Button
              type="button"
              variant={formData.amount === 'custom' ? "default" : "outline"}
              className="w-full"
              onClick={() => setFormData(prev => ({ ...prev, amount: 'custom' }))}
            >
              Custom Amount
            </Button>

            {formData.amount === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customAmount">Custom Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="customAmount"
                    type="number"
                    step="0.01"
                    min="5"
                    max="10000"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.customAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, customAmount: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {getRechargeAmount() > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Current Balance:</span>
                <span>{formatCurrency(currentBalance)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Recharge Amount:</span>
                <span>+{formatCurrency(getRechargeAmount())}</span>
              </div>
              <div className="flex justify-between font-medium border-t mt-2 pt-2">
                <span>New Balance:</span>
                <span>{formatCurrency(newBalance)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={rechargeMutation.isPending || getRechargeAmount() <= 0}
            >
              {rechargeMutation.isPending ? 'Processing...' : `Recharge ${formatCurrency(getRechargeAmount())}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};