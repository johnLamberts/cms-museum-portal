/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateMunicipal from "./hooks/useCreateMunicipal";
import MunicipalForm from "./municipal-form";


const municipalSchema = z.object({
  municipal: z
    .string()
    .min(2, {
      message: "Municipal Name must be at least 2 characters.",
    })
})

const defaultValues = {
  municipal: "",
}

export type MunicipalFormValues = z.infer<typeof municipalSchema>;


const MunicipalContentForm = () => {
  const form = useForm<MunicipalFormValues>({
    resolver: zodResolver(municipalSchema),
    mode: "onTouched",
    defaultValues: defaultValues
  });

  const { isAddingMunicipal, addMunicipalHandler } = useCreateMunicipal();



  const [isOpen, setIsOpen] = useState<boolean>(false);


  const resetForm = () => {
    form.reset(defaultValues);
  };

   
  const onSubmit: SubmitHandler<MunicipalFormValues | any> =  async (data: MunicipalFormValues) => {
    try {
      const municipalData = {
        ...data,
      }


      console.log(municipalData)
      await addMunicipalHandler(municipalData)
      
      resetForm();
      setIsOpen(false)
      
       

      console.log(form.getValues())
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 


  }
  
  return (
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
          <SheetTrigger asChild>
            <Button
            className="h-8 gap-1 bg-[#0B0400]"
            size="sm"
            variant={"gooeyLeft"}
            onClick={() => setIsOpen(true)}
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Municipal
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
              <header
                className={`py-4 bg-overlay-bg
              border-b border-overlay-border px-6 bg-overlay-bg border-b border-overlay-border flex-shrink-0`}
              >
                <div>
                  <h3 className="text-lg font-medium">Adding Municipal</h3>
                  <p className="text-xs text-muted-foreground">
                    Fill in the details.
                  </p>
                </div>
              </header>
              <div className="flex-grow overflow-y-auto">
                <MunicipalForm form={form} />
              </div>

            <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
              <Button type="submit" disabled={isAddingMunicipal} onClick={form.handleSubmit(onSubmit)} >
                {isAddingMunicipal ? "Creating Municipal..." : "Create Municipal"}
                  {/* Add Municipal */}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
  )
}


export default MunicipalContentForm


