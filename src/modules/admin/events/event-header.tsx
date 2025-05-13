import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface EventHeaderFormProps {
  editor?: Editor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

 
const EventmHeaderForm: React.FC<EventHeaderFormProps> = ({  form }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register,  setValue, watch } = form;

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
            <Label htmlFor="eventDate">Date</Label>
            <Input
              id="eventDate"
              type="date"
              {...register("eventDate")}
              />
          </div>

          <div className="mb-4">
            <Label htmlFor="eventTime">Time {" "}<span className="text-gray-400 text-xs">ex. 1:00 PM to 5:00 PM</span></Label>
            <Input
              id="eventTime"
              type="text"
              {...register("eventTime")}
              />
          </div>

          <div className="mb-4">
              <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue  placeholder="Select a verified status for event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventmHeaderForm;
