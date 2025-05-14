import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RentalSummary from '@/components/rental/RentalSummary';
import PaymentHistory from '@/components/rental/PaymentHistory';
import PaymentForm from '@/components/rental/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Rental() {
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  
  const { data: rental, isLoading } = useQuery({
    queryKey: ['/api/rental'],
  });
  
  const handleMakePayment = () => {
    setPaymentFormOpen(true);
  };
  
  const handleClosePaymentForm = () => {
    setPaymentFormOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 font-poppins">Shop Rental</h1>
          <p className="text-neutral-600">Manage your shop rental payments</p>
        </div>
        
        {/* Rental Overview Cards */}
        <RentalSummary onMakePayment={handleMakePayment} />
        
        {/* Payment History */}
        <PaymentHistory />
        
        {/* Lease Details */}
        {!isLoading && rental && (
          <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mt-6 slide-in">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold text-neutral-800">Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Lease Start Date</p>
                  <p className="font-medium">{formatDate(rental.leaseStartDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Lease End Date</p>
                  <p className="font-medium">{formatDate(rental.leaseEndDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Rental Amount</p>
                  <p className="font-medium">${rental.amount} monthly</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Security Deposit</p>
                  <p className="font-medium">${rental.securityDeposit}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-2">Lease Documents</p>
                <div className="flex items-center space-x-2">
                  <FileText className="text-neutral-500" size={16} />
                  <span className="text-sm font-medium">Lease Agreement.pdf</span>
                  <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0 h-auto">View</Button>
                  <Button variant="link" className="text-primary hover:text-primary-dark text-sm p-0 h-auto">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Payment Form Dialog */}
        {rental && (
          <PaymentForm
            isOpen={paymentFormOpen}
            onClose={handleClosePaymentForm}
            rentalAmount={rental.amount}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
