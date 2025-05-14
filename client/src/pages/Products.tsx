import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductCard from '@/components/products/ProductCard';
import ProductForm from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });
  
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductFormOpen(true);
  };
  
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setProductFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setProductFormOpen(false);
    setSelectedProduct(null);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 font-poppins">Products</h1>
            <p className="text-neutral-600">Manage your product inventory</p>
          </div>
          <Button 
            className="flex items-center"
            onClick={handleAddProduct}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={handleEditProduct} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-800 mb-2">No Products Found</h3>
              <p className="text-neutral-600 mb-6">You haven't added any products yet.</p>
              <Button onClick={handleAddProduct}>Add Your First Product</Button>
            </div>
          )}
        </div>
        
        {/* Pagination would go here */}
        
        {/* Product Form Dialog */}
        <ProductForm 
          product={selectedProduct}
          isOpen={productFormOpen}
          onClose={handleCloseForm}
        />
      </div>
    </DashboardLayout>
  );
}
