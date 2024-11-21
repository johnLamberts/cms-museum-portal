/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateVisitor from "./hooks/useCreateVisitor";
import VisitorForm from "./visitor-form";


const visitorSchemaSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First Name must be at least 2 characters.",
    })
    .max(30, {
      message: "First Name must not be longer than 30 characters.",
    }),
    lastName: z
    .string()
    .min(2, {
      message: "Last Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Last Name must not be longer than 30 characters.",
    }),
    middleName: z
    .string()
    .optional(),
    
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  password: z
    .string({
      required_error: "This field is required.",
    })
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
 address: z
    .string({
      required_error: "This field is required.",
    })
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
})

const defaultValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  userImg: undefined,
  password: "",
  email: "",
  address: ""
}

export type VisitorFormValues = z.infer<typeof visitorSchemaSchema>;


const VisitorContentForm = () => {
  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchemaSchema),
    mode: "onTouched",
    defaultValues: defaultValues
  });

  const { isAddingVisitor, addVisitorHandler } = useCreateVisitor();

  const [isOpen, setIsOpen] = useState<boolean>(false);


  const resetForm = () => {
    form.reset(defaultValues);
  };

   
  const onSubmit: SubmitHandler<VisitorFormValues | any> =  async (data: VisitorFormValues) => {
    try {
      const userData = {
        ...data,
        confirmPassword: data.password,
        userRole: "visitor"
      }


      console.log(userData)
      await addVisitorHandler(userData)
      
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
                Add Visitor
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
              <header
                className={`py-4 bg-overlay-bg
              border-b border-overlay-border px-6 bg-overlay-bg border-b border-overlay-border flex-shrink-0`}
              >
                <div>
                  <h3 className="text-lg font-medium">Adding Visitor</h3>
                  <p className="text-xs text-muted-foreground">
                    Fill in the details.
                  </p>
                </div>
              </header>
              <div className="flex-grow overflow-y-auto">
                <VisitorForm form={form} />
              </div>

            <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
              <Button type="submit" disabled={isAddingVisitor} onClick={form.handleSubmit(onSubmit)} >
                {isAddingVisitor ? "Creating Visitor..." : "Create Visitor"}
                  {/* Add Visitor */}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
  )
}


export default VisitorContentForm


