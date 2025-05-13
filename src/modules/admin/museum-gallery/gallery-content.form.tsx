/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import GalleryForm from "./gallery-form";
import useCreateArtifacts from "./hooks/useCreateUser";
import useUpdateArtifacts from "./hooks/useUpdateUser";

const artifactSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must not be longer than 1000 characters.",
    }),
  period: z
    .string()
    .optional(),
  category: z.string({
    required_error: "Category is required.",
  }),
  artifactImg: z.any().optional(),
  location: z.any(),
  featured: z.boolean().default(false).optional(),
})

const defaultValues = {
  title: "",
  description: "",
  period: "",
  artifactImg: undefined,
  category: "",
  location: "",
  featured: false,
}

export type ArtifactFormValues = z.infer<typeof artifactSchema>;

interface GalleryContentFormProps {
  artifact?: Record<string, any>
  isUpdateMode?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  trigger?: React.ReactNode
}

const GalleryContentForm = ({ artifact = {}, onOpenChange, open }: GalleryContentFormProps) => {
  const { artifact_id, ...otherData } = artifact;
  const isEditingMode = Boolean(artifact_id);

  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactSchema),
    defaultValues: isEditingMode && artifact
      ? { ...otherData }
      : defaultValues,
  });

  const { isAddingArtifact, addArtifactHandler } = useCreateArtifacts();
  const { isModifyingArtifact, updateArtifactHandler } = useUpdateArtifacts();

  useEffect(() => {
    if (open) {
      form.reset(
        isEditingMode && artifact
          ? { ...otherData }
          : defaultValues
      );
    } else {
      form.reset(defaultValues); // Reset when closing
    }
  }, [open, isEditingMode, artifact, form]);

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

  const onSubmit: SubmitHandler<ArtifactFormValues | any> = async (data: ArtifactFormValues) => {
    try {
      const { title, description, period, category,  artifactImg, featured } = data;
      const artifactData = {
        title,
        description,
        period,
        category,
        artifactImg,
        featured: featured || false
      }

      if (isEditingMode) {

        console.log(artifactData)
        await updateArtifactHandler({
          ...artifactData,
          artifact_id,
        });
      } else {
        await addArtifactHandler(artifactData);
      }

      form.reset(defaultValues); // Reset form after submission
      setSheetOpen(false);
    
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`)
    } 
  }
  
  return (
    <Sheet onOpenChange={setSheetOpen} open={open}>
      <SheetContent className="p-0 flex flex-col h-full md:max-w-[40rem]">
        <header className="py-4 bg-overlay-bg border-b border-overlay-border px-6 flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium">
              {isEditingMode ? "Update Artifact" : "Add New Artifact"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEditingMode ? "Update artifact information" : "Fill in the artifact details."}
            </p>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto">
          <GalleryForm form={form} isEditingMode={isEditingMode} artifact={otherData} />
        </div>
        <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
          <Button
            type="submit"
            disabled={isEditingMode ? isModifyingArtifact : isAddingArtifact}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isEditingMode
              ? isModifyingArtifact
                ? "Updating Artifact..."
                : "Update Artifact"
              : isAddingArtifact
              ? "Creating Artifact..."
              : "Create Artifact"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default GalleryContentForm
