import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SalesCard from '@/components/dashboard/SalesCard';
import LowStockProducts from '@/components/dashboard/LowStockProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
  });

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 font-poppins">
            Hi, Merchant <span className="text-primary">{user?.name || ''}</span>
          </h1>
          <p className="text-neutral-600">Welcome back to your dashboard</p>
        </div>
        
        {/* Sales Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Card */}
          <SalesCard 
            title="Daily Sales"
            subtitle="Today"
            endpoint="/api/sales/daily"
            comparisonText="from yesterday"
            isPositive={true}
            changePercentage={12.5}
          />
          
          {/* Total Sales Card */}
          <SalesCard 
            title="Total Sales"
            subtitle="This Month"
            endpoint="/api/sales/total"
            comparisonText="from last month"
            isPositive={true}
            changePercentage={8.2}
          />
        </div>
        
        {/* Low Stock Products */}
        <LowStockProducts />
      </div>
    </DashboardLayout>
  );
}
