/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateVisitor from "./hooks/useCreateVisitor";
import useUpdateVisitor from "./hooks/useUpdateVisitor";
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
    }),
    visitorImg:  z.any().optional(),
})

const defaultValues = {
  firstName: "",
  lastName: "",
  middleName: "",
  visitorImg: undefined,
  password: "",
  email: "",
  address: ""
}

export type VisitorFormValues = z.infer<typeof visitorSchemaSchema>;


interface VisitorContentFormProps {
  visitor?: Record<string, any>
  isUpdateMode?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  trigger?: React.ReactNode
}

const VisitorContentForm = ({ visitor = {}, onOpenChange, open }: VisitorContentFormProps) => {
  console.log(visitor)
  
  const { visitor_id, ...otherData } = visitor;
  const isEditingMode = Boolean(visitor_id);

  const { isAddingVisitor, addVisitorHandler } = useCreateVisitor();
  const { isModifyVisitor, updateVisitorHandler  }= useUpdateVisitor()

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchemaSchema),
    defaultValues: isEditingMode && visitor
      ? { ...otherData, }
      : defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditingMode && visitor
          ? { ...otherData  }
          : defaultValues
      );
    } else {
      form.reset(defaultValues); // Reset when closing
    }
  }, [open, isEditingMode, visitor, form]);

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

  const onSubmit: SubmitHandler<VisitorFormValues> = async (data: VisitorFormValues) => {
    try {
      console.log(data);

      const userData = {
        ...data,
        confirmPassword: data.password,
        userRole: "visitor",
        user_uid: otherData.user_uid,
        visitor_id: visitor_id
      };


      if (isEditingMode) {
        await updateVisitorHandler(userData)
      } else {
        await addVisitorHandler(userData);
      }

      form.reset(defaultValues); // Reset form after submission
      setSheetOpen(false);
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
    }
  };

  return (
    <Sheet onOpenChange={setSheetOpen} open={open}>
      <SheetContent className="p-0 flex flex-col h-full md:max-w-[40rem]">
        <header className="py-4 bg-overlay-bg border-b border-overlay-border px-6 flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium">
              {isEditingMode ? "Update Visitor" : "Adding Visitor"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEditingMode ? "Update visitor information" : "Fill in the details."}
            </p>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto">
          <VisitorForm form={form} isEditingMode={isEditingMode} />
        </div>
        <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
          <Button
            type="submit"
            disabled={isEditingMode ? isModifyVisitor : isAddingVisitor}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isEditingMode
              ? isModifyVisitor ? "Updating Visitor.. " : "Update Visitor" 
              : isAddingVisitor
                ? "Creating Visitor..."
                : "Create Visitor"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default VisitorContentForm;



