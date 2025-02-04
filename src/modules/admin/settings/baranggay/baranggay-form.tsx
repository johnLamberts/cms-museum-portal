 
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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMunicipalities from "../municipalities/hooks/useMunicipality";
import IMunicipal from "../municipalities/municipal.interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaranggayForm = ({ form }: any) => {
  const navigate = useNavigate();

  const { setFocus, formState } = form;
  const { errors } = formState;

  const { data: municipalitiesData, isLoading, error  } = useMunicipalities();

  const [municipalities, setMunicipalities] = useState<IMunicipal[]>([])

  useEffect(() => {
    if (municipalitiesData && municipalitiesData.data && Array.isArray(municipalitiesData.data.municipality)) {
      setMunicipalities(municipalitiesData.data.municipality)
    }
  }, [municipalitiesData])

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value)
    form.setValue("municipal_id", value)
  }


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
                        <CardTitle>Baranggay Detail</CardTitle>
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
                              name="baranggay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Baranggay <span className="text-red-600">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />


                        <FormField
                          control={form.control}
                          name="municipal_id"
                          render={({ field }) => {

                            return (
                              <FormItem>
                                <FormLabel>Municipal <span className="text-red-600">*</span></FormLabel>
                                <Select 
                                  onValueChange={handleSelectChange}
                                  value={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Set a specific location to barangay">
                                        {field.value ? 
                                          municipalities.find(m => m.municipal_id?.toString() === field.value)?.municipal || "Unknown Location" 
                                          : ""}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isLoading ? (
                                      <SelectItem value="loading">Loading locations...</SelectItem>
                                    ) : error ? (
                                      <SelectItem value="error">Error loading locations</SelectItem>
                                    ) : municipalities.length > 0 ? (
                                      municipalities.map((municipal: IMunicipal) => (
                                        <SelectItem key={municipal.municipal_id} value={municipal.municipal_id || ""}>
                                          {municipal.municipal || "Unnamed Location"}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-locations">No locations available</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              
                              </FormItem>
                            )
                          }}
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
export default BaranggayForm;
