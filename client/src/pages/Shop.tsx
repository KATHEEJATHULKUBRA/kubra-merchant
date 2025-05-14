import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ShopProfile from '@/components/shop/ShopProfile';
import ShopForm from '@/components/shop/ShopForm';

export default function Shop() {
  const [shopFormOpen, setShopFormOpen] = useState(false);
  
  const handleEditShop = () => {
    setShopFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setShopFormOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 font-poppins">Shop Profile</h1>
          <p className="text-neutral-600">Manage your shop details</p>
        </div>
        
        {/* Shop Profile */}
        <ShopProfile onEdit={handleEditShop} />
        
        {/* Shop Form Dialog */}
        <ShopForm
          isOpen={shopFormOpen}
          onClose={handleCloseForm}
        />
      </div>
    </DashboardLayout>
  );
}
