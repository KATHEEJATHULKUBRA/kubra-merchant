import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, WalletCards } from 'lucide-react';

interface RentalSummaryProps {
  onMakePayment: () => void;
}

export default function RentalSummary({ onMakePayment }: RentalSummaryProps) {
  const { data: rental, isLoading } = useQuery({
    queryKey: ['/api/rental'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <Skeleton className="h-10 w-40 mb-1" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rental) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="mb-4">No Rental Information Found</CardTitle>
        <p className="text-neutral-600 mb-4">There are currently no rental details available for your shop.</p>
      </Card>
    );
  }

  const isPaid = rental.status === 'paid';
  const isPastDue = new Date(rental.dueDate) < new Date() && !isPaid;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Current Due Card */}
      <Card className="slide-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-neutral-800">Current Rental Due</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(rental.amount)}</p>
              <p className="text-sm text-neutral-600 mt-1 flex items-center">
                <Calendar size={14} className="mr-1" />
                Due on <span className="font-semibold ml-1">
                  {formatDate(rental.dueDate)}
                </span>
                {isPastDue && (
                  <span className="ml-2 text-red-500 font-medium">PAST DUE</span>
                )}
                {isPaid && (
                  <span className="ml-2 text-green-500 font-medium">PAID</span>
                )}
              </p>
            </div>
            {!isPaid && (
              <Button 
                className="mt-4 md:mt-0" 
                onClick={onMakePayment}
              >
                <WalletCards className="mr-2 h-4 w-4" /> Make Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Summary Card */}
      <Card className="slide-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-neutral-800">Rental Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-neutral-600">Base Rent</span>
              <span className="font-medium">{formatCurrency(Number(rental.amount) * 0.96)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-600">Service Charge</span>
              <span className="font-medium">{formatCurrency(Number(rental.amount) * 0.04)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-600">Tax</span>
              <span className="font-medium">{formatCurrency(0)}</span>
            </li>
            <li className="flex justify-between pt-2 border-t border-neutral-200">
              <span className="font-semibold">Total Due</span>
              <span className="font-bold">{formatCurrency(rental.amount)}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
