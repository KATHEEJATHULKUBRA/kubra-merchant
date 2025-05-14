import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, generateRandomPaymentId } from '@/lib/utils';
import { CreditCard, Building, Check } from 'lucide-react';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  rentalAmount: number;
}

const paymentSchema = z.object({
  paymentId: z.string(),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  method: z.string().min(1, "Payment method is required"),
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

export default function PaymentForm({ isOpen, onClose, rentalAmount }: PaymentFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentId: generateRandomPaymentId(),
      amount: rentalAmount,
      method: 'Credit Card',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  });
  
  const paymentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof paymentSchema>) => {
      const paymentData = {
        paymentId: values.paymentId,
        amount: values.amount,
        method: values.method,
        status: 'paid'
      };
      
      const res = await apiRequest('POST', '/api/rental/payment', paymentData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rental'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rental/payments'] });
      toast({
        title: 'Payment successful',
        description: 'Your rental payment has been processed successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Payment failed',
        description: `Failed to process payment: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    paymentMutation.mutate(values);
  };

  const paymentMethod = form.watch('method');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make Rental Payment</DialogTitle>
          <DialogDescription>
            Process your rental payment of {formatCurrency(rentalAmount)}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.01" 
                      min="0"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Credit Card">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="Bank Transfer">
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {paymentMethod === 'Credit Card' && (
              <>
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="**** **** **** ****" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Holder Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter card holder name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="MM/YY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="***" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            
            {paymentMethod === 'Bank Transfer' && (
              <div className="rounded-lg border border-neutral-200 p-4 bg-blue-50 text-blue-800">
                <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                <p className="text-sm mb-1">Account Name: Kubra Market Ltd</p>
                <p className="text-sm mb-1">Account Number: 12345678</p>
                <p className="text-sm mb-1">Sort Code: 12-34-56</p>
                <p className="text-sm mb-1">Reference: {form.getValues().paymentId}</p>
                <p className="text-sm mt-3">
                  Please use the reference above when making your bank transfer.
                </p>
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={paymentMutation.isPending}
                className="gap-2"
              >
                {paymentMutation.isPending ? (
                  'Processing...'
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Make Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
