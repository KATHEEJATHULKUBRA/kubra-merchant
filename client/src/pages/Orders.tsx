import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrderList from '@/components/orders/OrderList';

export default function Orders() {
  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 font-poppins">Orders</h1>
          <p className="text-neutral-600">Manage customer orders</p>
        </div>
        
        {/* Order List with Filters and Table */}
        <OrderList />
      </div>
    </DashboardLayout>
  );
}
