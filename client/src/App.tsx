import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Shop from "@/pages/Shop";
import Rental from "@/pages/Rental";
import Profile from "@/pages/Profile";
import { useEffect, useState } from "react";
import { isAuthenticated } from "./lib/auth";
import { useLocation } from "wouter";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated and redirect accordingly
    const authCheck = async () => {
      const authenticated = isAuthenticated();
      
      // If on auth pages but already authenticated, redirect to dashboard
      if (authenticated && (location === "/login" || location === "/signup" || location === "/")) {
        setLocation("/dashboard");
      }

      // If on protected pages but not authenticated, redirect to login
      const isProtectedRoute = 
        location.startsWith("/dashboard") || 
        location.startsWith("/products") || 
        location.startsWith("/orders") || 
        location.startsWith("/shop") || 
        location.startsWith("/rental") ||
        location.startsWith("/profile");
      
      if (!authenticated && isProtectedRoute) {
        setLocation("/login");
      }
      
      setIsLoading(false);
    };
    
    authCheck();
  }, [location, setLocation]);
  
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <TooltipProvider>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/orders" component={Orders} />
        <Route path="/shop" component={Shop} />
        <Route path="/rental" component={Rental} />
        <Route path="/profile" component={Profile} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
