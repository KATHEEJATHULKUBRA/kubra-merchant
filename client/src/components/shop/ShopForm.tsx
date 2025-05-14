import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Textarea } from '@/components/ui/textarea';

interface ShopFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const businessHoursSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

const shopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  address: z.string().optional(),
  description: z.string().optional(),
  banner: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  businessHours: businessHoursSchema.optional(),
});

type ShopFormValues = z.infer<typeof shopSchema>;

export default function ShopForm({ isOpen, onClose }: ShopFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: shop } = useQuery({
    queryKey: ['/api/shop'],
  });
  
  const isEditing = !!shop;
  
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      description: '',
      banner: '',
      businessHours: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
      },
    },
  });
  
  useEffect(() => {
    if (shop) {
      form.reset({
        name: shop.name,
        phone: shop.phone || '',
        email: shop.email || '',
        address: shop.address || '',
        description: shop.description || '',
        banner: shop.banner || '',
        businessHours: shop.businessHours || {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: '',
        },
      });
    }
  }, [shop, form]);

  const createShopMutation = useMutation({
    mutationFn: async (values: ShopFormValues) => {
      const res = await apiRequest('POST', '/api/shop', values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop'] });
      toast({
        title: 'Shop created',
        description: 'Your shop profile has been created successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create shop: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  const updateShopMutation = useMutation({
    mutationFn: async (values: ShopFormValues) => {
      const res = await apiRequest('PUT', '/api/shop', values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop'] });
      toast({
        title: 'Shop updated',
        description: 'Your shop profile has been updated successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update shop: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: ShopFormValues) => {
    if (isEditing) {
      updateShopMutation.mutate(values);
    } else {
      createShopMutation.mutate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Shop Profile' : 'Create Shop Profile'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your shop name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter contact number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter email address" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter shop address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter shop description" 
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/banner.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border-t pt-4 mt-6">
              <h3 className="text-md font-semibold mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessHours.monday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 8:00 AM - 8:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.tuesday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuesday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 8:00 AM - 8:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.wednesday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wednesday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 8:00 AM - 8:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.thursday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thursday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 8:00 AM - 8:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.friday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 8:00 AM - 9:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.saturday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saturday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 9:00 AM - 9:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessHours.sunday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sunday</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 10:00 AM - 6:00 PM" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6 pt-4 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createShopMutation.isPending || updateShopMutation.isPending}
              >
                {createShopMutation.isPending || updateShopMutation.isPending
                  ? 'Saving...'
                  : isEditing ? 'Update Shop' : 'Create Shop'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
