import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesCardProps {
  title: string;
  subtitle: string;
  endpoint: string;
  comparisonText: string;
  isPositive: boolean;
  changePercentage: number;
}

export default function SalesCard({ 
  title, 
  subtitle, 
  endpoint,
  comparisonText,
  isPositive,
  changePercentage
}: SalesCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: [endpoint],
  });
  
  // Sample data for chart
  const chartData = [
    { name: 'Mon', amount: 1200 },
    { name: 'Tue', amount: 1500 },
    { name: 'Wed', amount: 1000 },
    { name: 'Thu', amount: 1600 },
    { name: 'Fri', amount: 1800 },
    { name: 'Sat', amount: 2400 },
    { name: 'Sun', amount: 1400 },
  ];

  return (
    <Card className="shadow-sm border border-neutral-200 slide-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-neutral-800">{title}</CardTitle>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-4">
          <div>
            <p className="text-3xl font-bold text-primary">
              {isLoading ? '...' : formatCurrency(data?.amount || 0)}
            </p>
            <p className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {changePercentage}% {comparisonText}
            </p>
          </div>
        </div>
        
        <div className="mt-6 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                hide={true}
                domain={['auto', 'auto']} 
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
