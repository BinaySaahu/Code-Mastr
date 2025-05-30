import React, { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";



export default function FancyMultiSelect({selected, setSelected, TOPICS}) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState();
  const [inputValue, setInputValue] = useState("");

  console.log("Selected->",selected)
  console.log("TOPICS->", TOPICS)

  const handleUnselect = useCallback((framework) => {
    setSelected((prev) => prev.filter((s) => s.topic !== framework.topic));
  }, []);

  const handleKeyDown = useCallback((e) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => prev.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = TOPICS.filter(
    (framework) => !selected.some((s) => s.topic === framework.topic)
  );

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((framework, idx) => (
            <Badge key={idx} variant="secondary">
              {framework.topic}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleUnselect(framework)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select TOPICS..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && selectables.length > 0 && (
        <div className="relative mt-2">
          <CommandList>
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((framework, idx) => (
                  <CommandItem
                    key={idx}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, framework]);
                    }}
                    className="cursor-pointer"
                  >
                    {framework.topic}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
