import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';
import KubraLogo from '@/assets/KubraLogo';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  ShoppingBag, 
  FileText, 
  Store, 
  Calendar, 
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
    { path: '/products', label: 'Products', icon: <ShoppingBag size={20} /> },
    { path: '/orders', label: 'Orders', icon: <FileText size={20} /> },
    { path: '/shop', label: 'Shop', icon: <Store size={20} /> },
    { path: '/rental', label: 'Rental', icon: <Calendar size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "w-64 h-full bg-white shadow-md fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-neutral-200">
            <KubraLogo className="mx-auto" />
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 bg-white">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}
                    className={cn(
                      "flex items-center p-2 text-base font-normal rounded-lg group transition-all",
                      location === item.path
                        ? "text-neutral-900 bg-neutral-100"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                    onClick={onClose}
                  >
                    <span 
                      className={cn(
                        "mr-3",
                        location === item.path
                          ? "text-primary"
                          : "text-neutral-500"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-neutral-200">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center p-2 text-base font-normal text-neutral-600 rounded-lg hover:bg-neutral-100 group transition-all"
            >
              <span className="mr-3 text-neutral-500">
                <LogOut size={20} />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
