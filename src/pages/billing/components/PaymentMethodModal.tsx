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
import { Checkbox } from '@/components/ui/checkbox';
import { BillingApi } from '@/generated-api/src/apis/BillingApi';
import { createApiClient } from '@/services/backendApi';
import { useToast } from '@/hooks/use-toast';
import { useDebugMode } from '@/hooks/useDebugMode';

interface PaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { backendUrl } = useDebugMode();
  const [formData, setFormData] = useState({
    paymentMethodId: '',
    nickname: '',
    setAsDefault: false,
  });

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = await createApiClient(BillingApi);
      
      return api.billingPaymentMethodsPost({
        request: {
          paymentMethodId: data.paymentMethodId,
          nickname: data.nickname || undefined,
          setAsDefault: data.setAsDefault,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment method added",
        description: "Your payment method has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['billing-dashboard'] });
      onOpenChange(false);
      setFormData({ paymentMethodId: '', nickname: '', setAsDefault: false });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethodId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid payment method ID",
        variant: "destructive",
      });
      return;
    }
    addPaymentMethodMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account. You'll need to provide a Stripe Payment Method ID.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethodId">Payment Method ID *</Label>
            <Input
              id="paymentMethodId"
              placeholder="pm_1234567890abcdef"
              value={formData.paymentMethodId}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethodId: e.target.value }))}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter the Stripe Payment Method ID (starts with "pm_")
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (Optional)</Label>
            <Input
              id="nickname"
              placeholder="Primary Card"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Give this payment method a friendly name
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="setAsDefault"
              checked={formData.setAsDefault}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, setAsDefault: checked as boolean }))
              }
            />
            <Label htmlFor="setAsDefault">Set as default payment method</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addPaymentMethodMutation.isPending}>
              {addPaymentMethodMutation.isPending ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};