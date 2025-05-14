import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden bg-neutral-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile menu toggle */}
      <Button
        variant="default"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-white shadow-lg"
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-16 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
