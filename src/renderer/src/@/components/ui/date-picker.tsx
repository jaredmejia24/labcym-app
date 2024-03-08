import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@renderer/@/components/ui/button';
import { Calendar } from '@renderer/@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/@/components/ui/popover';
import { cn } from '@renderer/lib/utils';

import { es } from 'date-fns/locale';

import { format } from 'date-fns';

type DatePickerProps = {
  date: Date | undefined;
  format?: string;
  onChangeDate?: (date: Date | undefined) => void;
  toDate?: Date;
};

export function DatePicker(props: DatePickerProps) {
  const { date, onChangeDate } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-semibold text-primary',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, props.format || 'PPP', { locale: es })
          ) : (
            <span>Seleccione una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          fromYear={new Date().getFullYear() - 100}
          toDate={props.toDate}
          mode="single"
          selected={date}
          onSelect={onChangeDate}
          initialFocus
          //className="w-[500px]"
        />
      </PopoverContent>
    </Popover>
  );
}
