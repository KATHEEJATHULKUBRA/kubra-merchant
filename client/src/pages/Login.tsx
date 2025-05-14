import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'wouter';
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
import { Checkbox } from '@/components/ui/checkbox';
import KubraLogo from '@/assets/KubraLogo';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "merchant@kubra.com",
      password: "Kubra123",
      rememberMe: false,
    },
  });
  
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await login(credentials);
    },
    onSuccess: () => {
      toast({
        title: 'Login successful',
        description: 'Welcome back to Kubra Market!',
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: (error as Error).message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg slide-in">
        <div className="text-center">
          <KubraLogo size="lg" className="mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-neutral-800 font-poppins">Sign in to your account</h2>
          <p className="mt-2 text-sm text-neutral-600">Access your merchant dashboard</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter your password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        id="remember_me" 
                      />
                    </FormControl>
                    <FormLabel htmlFor="remember_me" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <Link href="#">
                <a className="text-sm font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link href="/signup">
              <a className="font-medium text-primary hover:text-primary-dark">Sign up</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
