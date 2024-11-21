/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import generatePassword from "@/lib/generaPassword";
import { UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VisitorForm = ({ form }: any) => {
  const navigate = useNavigate();
  const { setFocus, setValue, formState } = form;
  const { errors } = formState;

  const [imagePreview, setImagePreview] = useState<string | null>(null); // To store the image preview URL

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  };

  useEffect(() => {
     // If there are errors, focus on the first field that has an error
     if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0]; // Get the first error key
      setFocus(firstErrorKey); // Automatically focus on the first error field
    }

    setValue("password", generatePassword());
  }, [])

  
  return (
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <Form {...form}>
              <form className="space-y-8">
                <div className="grid gap-4 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-0">
                      <CardHeader>
                        <CardTitle>Visitor Details</CardTitle>
                        <CardDescription>
                          Basic details you might include when adding a user such as
                          name, and other information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            {/* <Label htmlFor="firstName">First Name</Label>
                            <Input
                              className="w-full"
                              defaultValue="Gamer Gear Pro Controller"
                              id="firstName"
                              type="text"
                            /> */}
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>
                          <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Middle Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                      <Input placeholder="Dela Cruz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                          </div>
                          <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                      <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                          </div>
                        </div>

                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Address <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                      <Input placeholder="Dela Cruz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                          </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-07-chunk-2">
                      <CardHeader>
                        <CardTitle>User Authentication</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                          <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                      <Input placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid gap-3">
                              <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Password <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                      <Input placeholder="shadcn" type="password" disabled {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card
                      className="overflow-hidden"
                      x-chunk="dashboard-07-chunk-4"
                    >
                      <CardHeader>
                        <CardTitle>Visitor Image</CardTitle>
                        <CardDescription>
                          Dropoff your user image here, or you can just disregard this section
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                      <FormField
                        control={form.control}
                        name="userImg"
                        render={({ field: { value, onChange, ...field }}) => (
                          <FormItem className="flex flex-col items-start  space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl className="">
                                <div className="flex flex-col w-full justify-center items-center">
                                  {imagePreview && (
                                    <img
                                      alt="Pharmacy preview"
                                      className="aspect-square w-full rounded-md object-cover"
                                      src={imagePreview} // Display the image preview
                                    />)}
                                    {/* <div className="grid auto-rows-max items-center gap-4 lg:col-span-2 lg:gap-8">
                                        <UploadIcon className="h-4 w-4 text-muted-foreground" />


                                    </div> */}

                                    <div className="relative flex-1 md:grow-0 my-2">
                                      <UploadIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        className="w-full h-8 rounded-lg bg-background pl-8 md:w-[150px] lg:w-[276px]"
                                        placeholder="Upload pharmacy image..."
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={(event) => {
                                          const file = event.target.files?.[0]
                                          if (file) {
                                            onChange(file)
                                            handleFileChange(event)
                                          }
                                        }}
                                        {...field}
                                      />
                                    </div>
                                  </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                  <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button size="sm">Save Product</Button>
                </div>
              </form>
           </Form>
          </div>
        </main>
  );
};
export default VisitorForm;
