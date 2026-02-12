"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Types
type Day = "tue" | "wed" | "thu";
type Period = "am" | "pm";

interface DayTabsProps {
  onDayChange: (day: Day) => void;
  onPeriodChange: (period: Period) => void;
  defaultDay?: Day;
  defaultPeriod?: Period;
}

// Static day list
const days: { label: string; value: Day }[] = [
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
];

export const DayTabs: React.FC<DayTabsProps> = ({
  onDayChange,
  onPeriodChange,
  defaultDay = "tue",
  defaultPeriod = "pm",
}) => {
  const [day, setDay] = useState<Day>(defaultDay);
  const [period, setPeriod] = useState<Period>(defaultPeriod);

  // Sync with external props when they change
  useEffect(() => {
    setDay(defaultDay);
  }, [defaultDay]);

  useEffect(() => {
    setPeriod(defaultPeriod);
  }, [defaultPeriod]);

  const handleDayClick = (d: Day) => {
    setDay(d);
    onDayChange(d);
  };

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    onPeriodChange(p);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 justify-start">
      {/* AM/PM Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 rounded-md border-slate-300 bg-white text-gray-800 p-6 text-lg"
          >
            {period.toUpperCase()} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handlePeriodChange("am")}>
            AM
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePeriodChange("pm")}>
            PM
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Day Buttons */}
      <div className="flex flex-wrap gap-2">
        {days.map((d) => (
          <Button
            key={d.value}
            onClick={() => handleDayClick(d.value)}
            variant={d.value === day ? "default" : "secondary"}
            className={cn(
              "rounded-md p-6 text-lg border",
              d.value === day
                ? "bg-[var(--primary-color)] text-white"
                : "bg-slate-100 text-gray-800 hover:bg-white hover:text-[var(--primary-color)] hover:border"
            )}
          >
            {d.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
