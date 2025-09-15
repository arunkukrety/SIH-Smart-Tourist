"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  iconLeft?: React.ReactNode;
  keywords?: string[];
};

interface FilterableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  inputPlaceholder?: string;
  disabled?: boolean;
}

export function FilterableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  triggerClassName,
  contentClassName,
  inputPlaceholder = "Type to filter...",
  disabled,
}: FilterableSelectProps) {
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 100);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = React.useMemo(() => {
    if (!debounced) return options;
    return options.filter((opt) => {
      const hay = `${opt.label} ${opt.value} ${(opt.keywords || []).join(" ")}`.toLowerCase();
      return hay.includes(debounced);
    });
  }, [options, debounced]);

  return (
    <div className={cn("w-full", className)}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn("h-11 w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("max-h-72 w-[var(--radix-select-trigger-width)]", contentClassName)}>
          <div className="p-2 sticky top-0 z-10 bg-popover border-b">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={inputPlaceholder}
              className="h-9"
            />
          </div>
          <div className="py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
            ) : (
              filtered.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="gap-2">
                  {opt.iconLeft}
                  <span>{opt.label}</span>
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

export type { Option as FilterableOption };


