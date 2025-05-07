/* eslint-disable @typescript-eslint/no-explicit-any */
import CMS_KEYZ from "@/lib/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "./auth.service";

export default function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: loginUser,
    isPending
  } = useMutation({
    mutationFn: ({ email, password}: any) => {
      try {
        const userData = authService.loginHandler({ email, password })
        return userData;
      } catch(err: any) {
         // Handle specific credential errors here
         const errorMessage = err?.message || String(err);
        
         // Check for common authentication error patterns
         if (
           errorMessage.includes("Invalid login credentials") || 
           errorMessage.includes("Invalid email or password") ||
           errorMessage.includes("auth/invalid-credential") ||
           errorMessage.includes("password") ||
           errorMessage.toLowerCase().includes("credentials")
         ) {
           throw new Error("Invalid email or password. Please try again.");
         }
         
         // If rate limited
         if (
           errorMessage.includes("Too many requests") || 
           errorMessage.includes("rate limit")
         ) {
           throw new Error("Too many login attempts. Please try again later.");
         }
         
         // For other errors, pass through the message
         throw new Error(errorMessage);
      }
    },

    onSuccess: (user) => {
      // Check if the account status is pending or inactive
      if (user?.status === "pending") {
        // Show pending approval message
        toast.info(
          "Your account is still pending approval. You will receive an email once approved.",
          { duration: 6000 }
        );
        
        // Redirect to pending approval page
        navigate("/pending-approval", { replace: true });
        
        // Exit early - don't set the current user
        return;
      }
      
      // Check if the account is inactive
      if (user?.status === "inactive") {
        // Show inactive account message
        toast.error(
          "Your account has been deactivated. Please contact support for assistance.",
          { duration: 6000 }
        );
        
        // Redirect to inactive account page or login
        navigate("/pending-approval", { replace: true, state: { status: "inactive" } });
        
        // Exit early
        return;
      }
      
      // For Active users, continue with normal login flow
      // Save user data
      queryClient.setQueryData(
        [CMS_KEYZ.CURRENT_USER], user
      );

      // Handle role-based navigation for Active users
      if (user?.userRole === "admin" ) {
        navigate("/admin-dashboard", { replace: true });
      } else if (user?.userRole === "visitor" ) {
        navigate("/visitor/", { replace: true });
      } else if (user?.userRole === "staff" ) {
        navigate("/staff/", { replace: true });
      }else {
        // Handle unknown roles or status
        navigate("/", { replace: true });
      }

      toast.success(`You successfully logged in as ${user?.userRole}`);
    },
    
    onError: (error: Error) => {
       // Set user-friendly error message for display in UI
       const errorMessage = error?.message || "Login failed. Please try again.";
       
       // Show toast notification
       toast.error(errorMessage);
       
       // Log for debugging (consider removing in production)
       console.error("Login error:", error);
    }
  });

  return { loginUser, isPending };
}
