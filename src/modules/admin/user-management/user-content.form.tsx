/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateUser from "./hooks/useCreateUser";
import useUpdatePasswordUser from "./hooks/useUpdatePasswordUser";
import useUpdateUser from "./hooks/useUpdateUser";
import UserForm from "./user-form";


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
    userImg:  z.any().optional(),
  password: z
    .any().optional(),
  userRole: z.string({
      required_error: "This field is required.",
    }),
    userLocation: z.string({
      required_error: "This field is required.",
    })  
})

const defaultValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  userImg: undefined,
  password: "",
  email: "",
  userRole: "",
  userLocation: "",
}

export type UserFormValues = z.infer<typeof userSchema>;

interface UserContentFormProps {
  user?: Record<string, any>
  isUpdateMode?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  trigger?: React.ReactNode
  mode?: "editUser" | "changePassword"
}

const UserContentForm = ({ user = {}, onOpenChange, open, mode }: UserContentFormProps) => {
  const { user_id, ...otherData } = user;
  const isEditingMode = Boolean(user_id);

  const form = useForm<UserFormValues>({
     resolver: zodResolver(userSchema),
     defaultValues: isEditingMode && user
       ? { ...otherData, userLocation: user.municipal}
       : defaultValues,
   });




  const { isAddingUser, addUserHandler } = useCreateUser()
  const { isModifyingUser, updateUserHandler } = useUpdateUser()

  const { isModifyingUserPassword, updateUserPasswordHandler } = useUpdatePasswordUser();


 useEffect(() => {
     if (open) {
       form.reset(
         isEditingMode && user
           ? { ...otherData  }
           : defaultValues
       );
     } else {
       form.reset(defaultValues); // Reset when closing
     }
   }, [open, isEditingMode, user, form]);
 
   const setSheetOpen = useCallback(
     (value: boolean) => {
       if (onOpenChange) {
         onOpenChange(value);
       }
       if (!value) {
         form.reset(defaultValues);
         document.body.style.pointerEvents = "auto"; // Extra safety
       }
     },
     [onOpenChange, form]
   );
 



   
  const onSubmit: SubmitHandler<UserFormValues | any> =  async (data: UserFormValues) => {
   
    try {
      const { firstName, lastName, middleName, userRole, userLocation, userImg, password, email } = data;
      const userData = {
        firstName,
        lastName,middleName,email,password,userImg,userRole, municipal_id: userLocation,
        confirmPassword: data.password,
      }

      if (isEditingMode) {

        if(mode === "editUser") {

          await updateUserHandler({
            firstName,
            lastName,middleName,email,password,userImg,userRole, municipal_id: userLocation, user_id, user_uid: user.user_uid
          })

        } else {
          
          await updateUserPasswordHandler({
            password: userData.password, user_id
          })
          
        }

      } else {

        await addUserHandler(userData);
      
      }

      form.reset(defaultValues); // Reset form after submission
      setSheetOpen(false);
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 

  }
  
  return (
      <Sheet onOpenChange={setSheetOpen} open={open}>
          {/* <SheetTrigger asChild>
            <Button
            className="h-8 gap-1 bg-[#0B0400]"
            size="sm"
            variant={"gooeyLeft"}
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add User
              </span>
            </Button>
          </SheetTrigger> */}
          <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
            <header className="py-4 bg-overlay-bg border-b border-overlay-border px-6 flex-shrink-0">
              <div>
                <h3 className="text-lg font-medium">
                  {isEditingMode ? "Update User" : "Adding User"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEditingMode ? "Update User information" : "Fill in the details."}
                </p>
              </div>
             </header>
              <div className="flex-grow overflow-y-auto">
                <UserForm form={form} isEditingMode={isEditingMode} mode={mode} user={otherData} />
              </div>
            <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
            <Button
              type="submit"
              disabled={isEditingMode ? (mode === "editUser" ? isModifyingUser : isModifyingUserPassword) : isAddingUser}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isEditingMode
                ? mode === "changePassword"
                  ? isModifyingUserPassword
                    ? "Updating Password..."
                    : "Update Password"
                  : isModifyingUser
                  ? "Updating User..."
                  : "Update User"
                : isAddingUser
                ? "Creating User..."
                : "Create User"}
            </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
  )
}


export default UserContentForm


