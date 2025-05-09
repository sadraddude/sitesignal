'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string; // Controlled component: current value in Input
  onChange: (value: string) => void; // Controlled component: update value from Input or selection
  placeholder?: string; // Placeholder for the Input field
  searchPlaceholder?: string; // Placeholder for the CommandInput inside popover
  notFoundMessage?: string;
  className?: string; // ClassName for the wrapper div
  inputId?: string; // Optional ID for the input field
}

export function Combobox({ 
  options,
  value,
  onChange,
  placeholder = "Type keywords or select...",
  searchPlaceholder = "Search options...",
  notFoundMessage = "No option found.",
  className,
  inputId
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Add console log for debugging
  React.useEffect(() => {
    console.log('[Combobox] Open state:', open);
  }, [open]);

  // Handle selection from the list
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue) // Update parent state with the selected value
    setOpen(false) // Close the popover
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          {/* Main Input Field - Removed onFocus handler */}
          <Input
            id={inputId}
            type="text"
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="pr-10"
            // onFocus={() => setOpen(true)} // Temporarily removed
          />
          {/* Popover Trigger Button */}
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
              aria-label="Select option"
              onClick={() => setOpen((prev) => !prev)} // Ensure this toggles state
            >
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>

        {/* Popover Content - Removed onOpenAutoFocus */}
        <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0 mt-1"
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            // onOpenAutoFocus={(e) => e.preventDefault()} // Temporarily removed
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} /> 
            <CommandList>
              <CommandEmpty>{notFoundMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.toLowerCase() === option.value.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 