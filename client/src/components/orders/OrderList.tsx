import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import OrderSummary from './OrderSummary';

export default function OrderList() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
  });
  
  const filteredOrders = orders ? orders.filter((order: any) => {
    let passesStatusFilter = statusFilter === 'all' || order.status === statusFilter;
    
    let passesDateFilter = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (dateFilter === 'today') {
        passesDateFilter = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const oneWeekAgo = new Date(today.getTime() - 7 * oneDay);
        passesDateFilter = orderDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        passesDateFilter = orderDate >= oneMonthAgo;
      }
    }
    
    return passesStatusFilter && passesDateFilter;
  }) : [];
  
  const handleViewSummary = (order: any) => {
    setSelectedOrder(order);
    setSummaryOpen(true);
  };
  
  return (
    <>
      <Card className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-6">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow md:flex-grow-0">
              <label htmlFor="status-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                Filter by Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-grow md:flex-grow-0">
              <label htmlFor="date-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                Filter by Date
              </label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden slide-in">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold text-neutral-800">Orders</CardTitle>
          <CardDescription>Manage customer orders</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((order: any) => {
                    const { bg, text } = getStatusColor(order.status);
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-primary-dark p-0 h-auto"
                            onClick={() => handleViewSummary(order)}
                          >
                            View Summary
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-neutral-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {(!isLoading && filteredOrders && filteredOrders.length > 0) && (
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
                <span className="font-medium">{orders.length}</span> orders
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedOrder && (
        <OrderSummary 
          order={selectedOrder}
          isOpen={summaryOpen}
          onClose={() => setSummaryOpen(false)}
        />
      )}
    </>
  );
}
