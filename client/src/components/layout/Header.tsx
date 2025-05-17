import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Search, Menu, User } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { cn, getInitials } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    staleTime: 300000, // 5 minutes
  });

  return (
    <header className="bg-white shadow-sm z-10 p-4">
      <div className="flex justify-between items-center">
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="text-neutral-600" />
          </Button>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-4">
          {/* Search */}
          <div className="relative max-w-xs w-full hidden md:block">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-neutral-600" />
                <Badge className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold translate-x-1/3 -translate-y-1/3">
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-primary text-xs">
                  Mark all as read
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-auto">
                <div className="p-2 hover:bg-neutral-100 rounded-md">
                  <div className="font-medium text-sm">New Order: #ORD-2023-1854</div>
                  <div className="text-xs text-neutral-500">From Emma Wilson - Just now</div>
                </div>
                <div className="p-2 hover:bg-neutral-100 rounded-md">
                  <div className="font-medium text-sm">Order Updated: #ORD-2023-1853</div>
                  <div className="text-xs text-neutral-500">Status changed to Processing - 1 hour ago</div>
                </div>
                <div className="p-2 hover:bg-neutral-100 rounded-md">
                  <div className="font-medium text-sm">Low Stock Alert</div>
                  <div className="text-xs text-neutral-500">Organic Apples (5 kg remaining) - 3 hours ago</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-200">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full focus:ring-primary"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pink-700 text-white">
                    {user?.name ? getInitials(user.name) : 'M'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <a className="w-full flex cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <a className="w-full flex cursor-pointer">Settings</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onSelect={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/login';
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
