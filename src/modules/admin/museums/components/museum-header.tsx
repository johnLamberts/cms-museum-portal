import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ColorPicker } from "../color-picker";

interface MuseumHeaderFormProps {
  editor: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MuseumHeaderForm: React.FC<MuseumHeaderFormProps> = ({ editor, form }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, watch, setValue } = form;
  const coverPhoto = watch("coverPhoto");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setValue("coverPhoto", reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Dynamic Cover Photo Section */}
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${coverPhoto || "/placeholder.svg"})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <Input
              {...register("title")}
              className="text-4xl font-bold bg-transparent border-none text-center mb-4"
              placeholder="Enter Museum Title"
            />
          </div>
        </div>
      </div>

      {/* Expandable Header Options */}
      <div className="">
        <Button
          className="absolute  bottom-4 right-4"
          onClick={() => setIsExpanded(!isExpanded)}
          >
          {isExpanded ? "Collapse" : "Expand"} Header Options
        </Button>
      </div>

      {/* Expanded Form Options */}
      {isExpanded && (
        <div className="bg-background p-4 shadow-lg ">
          <div className="mb-4">
            <Label htmlFor="coverPhotoUpload">Upload Cover Photo</Label>
            <Input
              id="coverPhotoUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="museumFee">Fee</Label>
            <Input
              id="museumFee"
              {...register("fee")}
              placeholder="Enter museum fee"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="museumAddress">Address</Label>
            <Input
              id="museumAddress"
              {...register("address")}
              placeholder="Enter address"
            />
          </div>
          <div>
            <Label>Color Theme</Label>
            <ColorPicker
              onColorChange={(color) => setValue("colorTheme", color)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MuseumHeaderForm;
