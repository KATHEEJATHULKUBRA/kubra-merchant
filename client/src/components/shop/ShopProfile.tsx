import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopProfileProps {
  onEdit: () => void;
}

export default function ShopProfile({ onEdit }: ShopProfileProps) {
  const { data: shop, isLoading } = useQuery({
    queryKey: ['/api/shop'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative h-48 md:h-64 rounded-lg shadow-sm overflow-hidden mb-6">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-56" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3 mt-1" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="mb-4">No Shop Found</CardTitle>
        <p className="text-neutral-600 mb-4">You haven't set up your shop profile yet.</p>
        <Button onClick={onEdit}>Create Shop Profile</Button>
      </Card>
    );
  }

  // Shop data exists, display it
  return (
    <div className="space-y-6">
      {/* Shop Banner */}
      <div className="relative h-48 md:h-64 rounded-lg shadow-sm overflow-hidden mb-6 slide-in">
        {shop.banner ? (
          <img src={shop.banner} alt={`${shop.name} Banner`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-secondary-light flex items-center justify-center">
            <span className="text-lg text-neutral-500">No Banner Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-neutral-900/10"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="text-white text-2xl font-bold font-poppins">{shop.name}</h2>
          <p className="text-white text-sm mt-1">{shop.description?.split('.')[0]}</p>
        </div>
        <Button 
          className="absolute bottom-4 right-4 bg-white text-primary p-2 rounded-full shadow-md hover:bg-neutral-100 transition-colors"
          size="icon"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </Button>
      </div>
      
      {/* Shop Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Info */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200 p-6 slide-in">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 font-poppins">Shop Information</h3>
            <Button variant="ghost" className="text-primary hover:text-primary-dark" onClick={onEdit}>
              <Pencil className="mr-1" size={16} />
              Edit
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Shop Name</p>
                <p className="font-medium">{shop.name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Contact Number</p>
                <p className="font-medium">{shop.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Email Address</p>
              <p className="font-medium">{shop.email || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Shop Address</p>
              <p className="font-medium">{shop.address || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-1">Shop Description</p>
              <p>{shop.description || 'No description provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Business Hours */}
        <div className="col-span-1 bg-white rounded-lg shadow-sm border border-neutral-200 p-6 slide-in">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 font-poppins">Business Hours</h3>
            <Button variant="ghost" className="text-primary hover:text-primary-dark" onClick={onEdit}>
              <Pencil className="mr-1" size={16} />
              Edit
            </Button>
          </div>
          
          <div className="space-y-3">
            {shop.businessHours ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Monday</p>
                  <p>{shop.businessHours.monday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Tuesday</p>
                  <p>{shop.businessHours.tuesday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Wednesday</p>
                  <p>{shop.businessHours.wednesday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Thursday</p>
                  <p>{shop.businessHours.thursday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Friday</p>
                  <p>{shop.businessHours.friday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Saturday</p>
                  <p>{shop.businessHours.saturday || 'Closed'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Sunday</p>
                  <p>{shop.businessHours.sunday || 'Closed'}</p>
                </div>
              </>
            ) : (
              <p className="text-neutral-500 text-center py-4">No business hours provided</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Shop Photos */}
      <Card className="p-6 slide-in">
        <div className="flex justify-between items-center mb-6">
          <CardTitle className="text-lg font-semibold text-neutral-800">Shop Photos</CardTitle>
          <Button variant="outline" size="sm" className="text-primary">
            <span className="mr-1">+</span> Add Photos
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-32 rounded-lg overflow-hidden group bg-neutral-100 flex items-center justify-center text-neutral-400">
            No photos added yet
          </div>
        </div>
      </Card>
    </div>
  );
}
