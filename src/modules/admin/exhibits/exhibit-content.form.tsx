/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";


const userSchema = z.object({
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
  userRole: z.string({
      required_error: "This field is required.",
    })
})

// const defaultValues = {
//   firstName: "",
//   lastName: "",
//   middleName: "",
//   userImg: undefined,
//   password: "",
//   email: "",
//   userRole: "",
// }

export type UserFormValues = z.infer<typeof userSchema>;


const UserContentForm = () => {
  // const form = useForm<UserFormValues>({
  //   resolver: zodResolver(userSchema),
  //   mode: "onTouched",
  //   defaultValues: defaultValues
  // });



  // const [isOpen, setIsOpen] = useState<boolean>(false);


  // const resetForm = () => {
  //   form.reset(defaultValues);
  // };

   
  // const onSubmit: SubmitHandler<UserFormValues | any> =  async (data: UserFormValues) => {
  //   try {
  //     const userData = {
  //       ...data,
  //     }


  //     console.log(userData)
  //     // await addPharmacyHandler(pharmacyData)
      
  //     resetForm();
  //     setIsOpen(false)
      
       

  //     console.log(form.getValues())
    
  //   } catch (err) {
  //     console.error(`[SubmittingError]: ${err}`)
  //   } 


  // }


  const navigate = useNavigate();
  
  
  return (
      <>
        <Button
              className="h-8 gap-1 bg-[#0B0400]"
              size="sm"
              variant={"gooeyLeft"}
              onClick={() => navigate("/exhibits_mgm/add_exhibit")}
              >
                <PlusCircleIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Exhibit
                </span>
         </Button>
      </>
      // <Sheet onOpenChange={setIsOpen} open={isOpen}>
      //     <SheetTrigger asChild>
      //       <Button
      //         className="h-8 gap-1 bg-[#0B0400]"
      //         size="sm"
      //         variant={"gooeyLeft"}
      //         onClick={() => setIsOpen(true)}
      //         >
      //           <PlusCircleIcon className="h-3.5 w-3.5" />
      //           <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
      //             Add User
      //           </span>
      //         </Button>
      //     </SheetTrigger>
      //     <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
      //         <header
      //           className={`py-4 bg-overlay-bg
      //         border-b border-overlay-border px-6 bg-overlay-bg border-b border-overlay-border flex-shrink-0`}
      //         >
      //           <div>
      //             <h3 className="text-lg font-medium">Adding User</h3>
      //             <p className="text-xs text-muted-foreground">
      //               Fill in the details.
      //             </p>
      //           </div>
      //         </header>
      //         <div className="flex-grow overflow-y-auto">
      //           <ExhibitForm form={form} />
      //         </div>

      //       <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
      //         <Button type="submit" onClick={() => {
              
      //           form.handleSubmit(onSubmit)
                
      //         }}>
      //           {/* {isAddingPharmacy ? "Creating Pharmacy..." : "Create Pharmacy"} */}
      //             Add User
      //         </Button>
      //       </SheetFooter>
      //     </SheetContent>
      //   </Sheet>
     
    )
}


export default UserContentForm


