/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useRegisterVisitor from "./useRegister";

// Define the validation schema using Zod
const registerSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character" }
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Extract the inferred type from the schema
type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  
  // Get the register mutation from our custom hook
  const { isAddingVisitor, registerVisitorHandler } = useRegisterVisitor();

  // Initialize form with Zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      
      // Call the registration API through our custom hook
      await registerVisitorHandler({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
        // Add any other required fields for your API
        userRole: 'visitor',
      });
      
      // Show success message
      setSuccess("Registration submitted successfully! Your account is pending approval. You will receive an email once approved.");
      
      // Reset the form
      reset();
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      // Error handling is done in the useRegisterVisitor hook
      // It will display toasts for errors
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <div className="flex space-x-2 absolute right-2 top-2">
        <Button
          onClick={() => navigate("/home")}
          variant={"expandIcon"}
          iconPlacement="left"
          Icon={ArrowLeftIcon}
          className="bg-[#0B0400]"
        >
          Back home
        </Button>
      </div>
      
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r">
        <img src="/mock/login.jpg" className="h-screen w-screen md:none" alt="Registration background" />
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
            <p className="text-sm text-muted-foreground">
              Fill all the necessary details to create your Museo Account
            </p>
          </div>
          
          {/* Success message */}
          {success && (
            <Alert className="bg-green-50 border-green-500 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  type="text"
                  disabled={isAddingVisitor}
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  type="text"
                  disabled={isAddingVisitor}
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  disabled={isAddingVisitor}
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  disabled={isAddingVisitor}
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  disabled={isAddingVisitor}
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <Button 
                disabled={isAddingVisitor} 
                type="submit"
                variant={"gooeyRight"} 
                className="bg-[#0B0400] mt-2"
              >
                {isAddingVisitor ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : "Create account"}
              </Button>
            </div>
          </form>
          
          <div className="text-center">
            <p className="text-sm">Already have an account?</p>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate("/login")}
              className="mt-2 w-full"
              disabled={isAddingVisitor}
            >
              Sign in
            </Button>
          </div>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
