import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginSubmit = (payload: Record<string, any>) => {
    console.log(payload);
  };

  return (
    <div className="container relative h-screen flex sm:grid-cols-1 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
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
        <Button
          onClick={() => navigate("/admin-dashboard")}
          variant={"expandIcon"}
          iconPlacement="right"
          Icon={ArrowRightIcon}
          className="bg-[#0B0400]"
        >
          Go to Admin UI
        </Button>
      </div>
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r">
        {/* <div className="h-screen w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex  items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />
          <h2 className="text-foreground text-3xl uppercase font-bold tracking-tighter md:text-4xl/tight">
            Kapejuan Coffee Shop
          </h2>
          <h2 className="text-foreground text-sm opacity-50 uppercase font-bold w-[80%] text-center">
            Enter your email below to login to your account and enjoy your
            favorite coffee
          </h2>
        </div> */}
        <img src="/mock/login.jpg" className="h-screen w-screen md:none" alt="" />
       
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to create your account
            </p>
          </div>
          {/* <UserAuthForm /> */}
          <>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    {...form.register("email")}
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    {...form.register("password")}
                  />
                </div>
                <Button variant={"gooeyRight"} className="bg-[#0B0400]">Sign In</Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" type="button">
              GitHub
            </Button>
          </>
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

export default LoginPage
