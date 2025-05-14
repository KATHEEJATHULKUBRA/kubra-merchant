import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    status: string;
  };
  onEdit: (product: any) => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const getStockStatus = (stock: number) => {
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  };
  
  const status = getStockStatus(product.stock);
  const { bg, text } = getStatusColor(status);

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/products/${product.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product deleted',
        description: `${product.name} has been deleted successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete product: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden slide-in">
      <div className="h-48 overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">{product.name}</h3>
            <p className="text-neutral-600 text-sm mb-2">{product.description}</p>
          </div>
          <div className="text-primary font-bold">{formatCurrency(product.price)}</div>
        </div>
        <div className="text-sm text-neutral-500 mb-4">
          Stock: {product.stock} {product.unit || 'units'}
        </div>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${bg} ${text}`}>
            {status}
          </span>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-full"
              onClick={() => onEdit(product)}
            >
              <Pencil size={16} />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-neutral-500 hover:text-red-500 hover:bg-neutral-100 rounded-full"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.name}"? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteProductMutation.mutate()}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
