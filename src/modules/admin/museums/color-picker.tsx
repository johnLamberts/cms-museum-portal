import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";

const colorOptions = [
  { name: "Classic", value: "#F9F6EE" },
  { name: "Modern", value: "#FFFFFF" },
  { name: "Vibrant", value: "#FFD700" },
  { name: "Elegant", value: "#2C3E50" },
  { name: "Natural", value: "#8FBC8F" },
];

type ColorPickerProps = {
  onColorChange: (color: string) => void;
};

export function ColorPicker({ onColorChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <Select onValueChange={handleColorChange} value={selectedColor}>
      <SelectTrigger className="w-48">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
            aria-label={`Selected color: ${selectedColor}`}
          />
          <span>Select a theme</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {colorOptions.map((color) => (
          <SelectItem key={color.name} value={color.value}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
              />
              <span>{color.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
