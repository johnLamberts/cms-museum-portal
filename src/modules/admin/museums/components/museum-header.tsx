/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ColorPicker } from "../color-picker";

interface MuseumHeaderFormProps {
  editor?: Editor;
   
  form: UseFormReturn<any>;
}

 
const MuseumHeaderForm: React.FC<MuseumHeaderFormProps> = ({ form }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, watch, setValue } = form;
  const coverPhoto = watch("coverPhoto");

    //  const { data: baranggay, isLoading, error } = useBaranggay();
    
    
    //    const memobaranggay = useMemo(() => {
    //       return baranggay?.data?.exhibition || [];
    //     }, [baranggay]);
        

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
              {...register("title", { required: "This field should not be emptied" })}
              className="text-4xl w-full font-bold bg-transparent border-none text-center mb-4"
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

          {/* <div className="mb">
             <FormField
                                        control={form.control}
                                        name="museumType"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Exhibition Type <span className="text-red-600">*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                              <FormControl>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Set a specific exhibition to exhibits">
                                                    {field.value
                                                      ? memobaranggay.find((m: any) => m.exhibition_id?.toString() === field.value)
                                                          ?.municipal || "Select exhibition"
                                                      : "Select exhibition"}
                                                  </SelectValue>
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                {isLoading ? (
                                                  <SelectItem value="loading">Loading locations...</SelectItem>
                                                ) : error ? (
                                                  <SelectItem value="error">Error loading locations</SelectItem>
                                                ) : memobaranggay.length > 0 ? (
                                                  memobaranggay.map((municipal: IExhibition) => (
                                                    <SelectItem
                                                      key={municipal.exhibition_id}
                                                      value={municipal.exhibition_id?.toString() || ""}
                                                    >
                                                      {municipal.exhibition_type || "Unnamed Exhibition"}
                                                    </SelectItem>
                                                  ))
                                                ) : (
                                                  <SelectItem value="no-locations">No locations available</SelectItem>
                                                )}
                                              </SelectContent>
                                            </Select>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
          </div> */}

          <div className="mb-4">
            <Label htmlFor="museumFee">Fee</Label>
            <Input
              id="museumFee"
              {...register("fee", { required: "This field should not be emptied" })}
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

          <div className="mb-4">
            <Label htmlFor="exhibitExclusiveDate">Exlusive Date</Label>
            <Input
              id="exhibitExclusiveDate"
              {...register("exhibitExclusiveDate")}
              placeholder="Format: March 14 - March 15, 2025"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="expectedTime">Expected Time</Label>
            <Input
              id="expectedTime"
              {...register("expectedTime")}
              placeholder="Format: 8:00 AM - 12:00 PM or 1:00 PM - 5:00 PM"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="curalator">Curalator</Label>
            <Input
              id="curalator"
              {...register("curalator", { required: "This field should not be emptied" } )}
              placeholder="Who will be handling the exhibits? Eg. Jericho Rosales and the Team"
            />
          </div>

          <div>
            <Label>Color Theme</Label>
            <ColorPicker
              onColorChange={(color) => setValue("colorTheme", color)}
            />
          </div>

          <span className="pt-4 text-gray-600 text-xs">NOTE: Other details can be categorized below, such as Programme, Headlines Details, and other important matters.</span>
        </div>
      )}
    </div>
  );
};

export default MuseumHeaderForm;
