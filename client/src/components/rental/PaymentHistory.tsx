import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentHistory() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/rental/payments'],
  });

  return (
    <Card className="shadow-sm border border-neutral-200 slide-in">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-800">Payment History</CardTitle>
        <CardDescription>Recent rental payments</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : payments && payments.length > 0 ? (
                payments.map((payment: any) => {
                  const { bg, text } = getStatusColor(payment.status);
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.paymentId}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-neutral-500">
                    No payment history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {(!isLoading && payments && payments.length > 0) && (
        <CardFooter className="px-6 py-4 border-t border-neutral-200">
          <Button variant="link" className="text-primary text-sm p-0">
            View all payment history
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
