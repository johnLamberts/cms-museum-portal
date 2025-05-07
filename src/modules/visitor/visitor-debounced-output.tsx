import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface DebouncedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
  className?: string;
}

const DebouncedSearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  debounceTime = 500,
  className = ""
}: DebouncedSearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Update local input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Debounce the onChange handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, debounceTime);
    
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, value, onChange, debounceTime]);
  
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`pl-10 h-12 w-full border-gray-300 focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
      {inputValue && (
        <button 
          onClick={() => {
            setInputValue('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default DebouncedSearchInput;
