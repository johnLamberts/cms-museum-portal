import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <div className="flex items-center justify-center mb-6">
          <ExclamationTriangleIcon className="text-red-500 w-16 h-16" />
        </div>
        )}

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-center text-gray-600 mb-6">
            We're sorry, but it seems like we've encountered an unexpected error. Our team has been notified and is working on fixing it.
          </p>

        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}
