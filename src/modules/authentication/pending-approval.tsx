import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AccountStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"pending" | "inactive">("pending");

  useEffect(() => {
    // Get status from location state if available
    if (location.state?.status) {
      setStatus(location.state.status);
    }
  }, [location]);

  return (
    <div className="container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          {status === "pending" ? (
            // Pending approval content
            <>
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              
              <h1 className="text-2xl font-semibold tracking-tight">Account Pending Approval</h1>
              
              <p className="text-muted-foreground">
                Thank you for registering with Museo. Your account is currently pending approval by our administrators.
              </p>
              
              <div className="p-4 my-4 border rounded-md bg-blue-50 border-blue-100">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-2 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      You will receive an email once your account has been approved. This process typically takes 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Inactive account content
            <>
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-semibold tracking-tight">Account Inactive</h1>
              
              <p className="text-muted-foreground">
                Your account is currently inactive. This may be due to administrative action or account security.
              </p>
              
              <div className="p-4 my-4 border rounded-md bg-red-50 border-red-100">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800">
                      Please contact our support team for assistance with reactivating your account.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="flex flex-col w-full space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Login
            </Button>
            
            <Button
              variant="link"
              className="text-sm"
              onClick={() => navigate("/home")}
            >
              Back to Home Page
            </Button>
          </div>
        </div>
        
        <div className="pt-4 mt-6 text-center border-t text-sm text-muted-foreground">
          <p>
            If you have any questions about your account status, please contact{" "}
            <a href="mailto:support@museo.com" className="underline text-primary">
              support@museo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusPage;
