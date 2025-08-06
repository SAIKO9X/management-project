// frontend/src/components/shared/DateTimePickerField.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "../ui/calendar";

const setTimeToDate = (date, timeString) => {
  if (!date || !timeString) return date;
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours || 0);
  newDate.setMinutes(minutes || 0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const DateTimePickerField = ({ control, name, label, initialValue }) => {
  const [timeValue, setTimeValue] = useState(
    initialValue && initialValue instanceof Date
      ? format(initialValue, "HH:mm")
      : "12:00"
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Label>{label}</Label>
          <div className="flex gap-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                {/* Mova FormControl para envolver o Button diretamente */}
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-1/2 justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    // As props de 'field' (incluindo onClick/onChange) são passadas via FormControl
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: ptBR })
                    ) : (
                      <span>Escolha uma data</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    const combinedDate = setTimeToDate(date, timeValue);
                    field.onChange(combinedDate);
                    setIsPopoverOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="time"
                value={timeValue}
                onChange={(e) => {
                  setTimeValue(e.target.value);
                  const currentDate = field.value || new Date();
                  const combinedDate = setTimeToDate(
                    currentDate,
                    e.target.value
                  );
                  field.onChange(combinedDate);
                }}
                className="pl-10 w-32"
                disabled={!field.value && !timeValue}
              />
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
