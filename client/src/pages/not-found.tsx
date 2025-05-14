import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/auth";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const authenticated = isAuthenticated();
  
  const goBack = () => {
    if (authenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">404 Page Not Found</h1>
            <p className="mt-4 text-gray-600">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button 
              onClick={goBack} 
              className="flex items-center gap-2"
            >
              {authenticated ? <Home className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {authenticated ? "Go to Dashboard" : "Back to Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
