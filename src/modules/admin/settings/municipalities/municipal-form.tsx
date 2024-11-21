 
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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MunicipalForm = ({ form }: any) => {
  const navigate = useNavigate();

  const { setFocus, formState } = form;
  const { errors } = formState;


  useEffect(() => {
     // If there are errors, focus on the first field that has an error
     if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0]; // Get the first error key
      setFocus(firstErrorKey); // Automatically focus on the first error field
    }

  }, [])

  
  return (
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <Form {...form}>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-0">
                      <CardHeader>
                        <CardTitle>Municipal Detail</CardTitle>
                        <CardDescription>
                          Basic details you might include when adding a user such as
                          name, and other information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <FormField
                              control={form.control}
                              name="municipal"
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
                        </div>
                      </CardContent>
                    </Card>
                  
                  </div>
              
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                  <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </form>
           </Form>
          </div>
        </main>
  );
};
export default MunicipalForm;
