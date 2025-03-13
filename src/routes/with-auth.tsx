/* eslint-disable @typescript-eslint/no-explicit-any */
import useCurrentUser from "@/modules/authentication/useCurrentUser";
import { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This is a wrapper component that checks auth
// This is a wrapper component that checks auth
export function withAuth<P extends object>(
  Component: ComponentType<P>, 
  allowedRoles: string[] = []
) {
  return function AuthenticatedComponent(props: P) {
    const { isLoading, user } = useCurrentUser();
    const navigate = useNavigate();

    console.log(user)

    useEffect(() => {
      // Only redirect after we've checked auth status
      if (!isLoading) {
        const isAuthorized = user && (allowedRoles.length === 0 || allowedRoles.includes((user as any)?.userRole || ""));
        if (!isAuthorized) {
          navigate('/login', { replace: true });
        }
      }
    }, [isLoading, user, navigate]);

    // Show loading while checking auth
    if (isLoading) {
      return <div>Loading...</div>; // Replace with proper loading component
    }

    // Only render the component if user is authenticated
    const isAuthorized = user && (allowedRoles.length === 0 || allowedRoles.includes((user as any)?.userRole || ""));
    return isAuthorized ? <Component {...props} /> : null;
  };
}
