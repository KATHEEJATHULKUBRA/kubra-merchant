import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getStatusColor(status: string): { bg: string, text: string } {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'paid':
    case 'active':
    case 'in stock':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'processing':
    case 'low':
    case 'low stock':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'pending':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'cancelled':
    case 'critical':
    case 'out of stock':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

export function generateRandomOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomNum}`;
}

export function generateRandomPaymentId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PMT-${year}-${randomNum}`;
}
