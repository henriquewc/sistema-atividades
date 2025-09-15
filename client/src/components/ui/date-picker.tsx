import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DatePickerWithRangeProps {
  dateRange: {from: Date | undefined, to: Date | undefined};
  onDateRangeChange: (range: {from: Date | undefined, to: Date | undefined}) => void;
}

export function DatePickerWithRange({ dateRange, onDateRangeChange }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
              </>
            ) : (
              format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
            )
          ) : (
            <span>Selecione o período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={{ from: dateRange?.from, to: dateRange?.to }}
          onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}