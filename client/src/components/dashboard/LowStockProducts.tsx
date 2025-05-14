import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStatusColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function LowStockProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products/low-stock'],
  });

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return 'Critical';
    if (stock <= 10) return 'Low';
    return 'In Stock';
  };

  return (
    <Card className="shadow-sm border border-neutral-200 slide-in">
      <CardHeader className="border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-800">Low Stock Products</CardTitle>
        <CardDescription>Products that need restocking soon</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-md mr-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : products && products.length > 0 ? (
                products.map((product: any) => {
                  const status = getStockStatus(product.stock);
                  const { bg, text } = getStatusColor(status);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div 
                            className="h-10 w-10 bg-neutral-100 rounded-md mr-4 bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image})` }}
                          />
                          <div className="text-sm font-medium text-neutral-900">
                            {product.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {product.description}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {product.stock} {product.unit || 'units'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
                          {status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-neutral-500">
                    No low stock products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {(!isLoading && products && products.length > 0) && (
        <CardFooter className="px-6 py-4 border-t border-neutral-200">
          <Link href="/products">
            <Button variant="link" className="text-primary hover:text-primary-dark text-sm">
              View all products
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
