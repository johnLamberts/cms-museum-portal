/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserFormValues } from "./user-content.form"

interface UserContentFormProps {
  user?: Record<string, any>
  isUpdateMode?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const userSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });



const ChangePassword = ({ user = {}, onOpenChange, open }: UserContentFormProps) => {
  const { user_id } = user;
  const isEditingMode = Boolean(user_id);

    const form = useForm<UserFormValues>({
       resolver: zodResolver(userSchema),
     });
  
     
  const setSheetOpen = useCallback(
       (value: boolean) => {
         if (onOpenChange) {
           onOpenChange(value);
         }
         if (!value) {
           document.body.style.pointerEvents = "auto"; // Extra safety
         }
       },
       [onOpenChange, form]
     );
   
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" value="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Username
        </Label>
        <Input id="username" value="@peduarte" className="col-span-3" />
      </div>
  </div>
  )
}

export default ChangePassword
