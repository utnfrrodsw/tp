import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WeeklyCalendar = ({ selectedDate, onDateSelect }: WeeklyCalendarProps) => {
  // Siempre mostrar la semana del selectedDate, sin navegación
  const currentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center mb-6">
        <Calendar className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Calendario Semanal
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          return (
            <Button
              key={index}
              variant={isSelected ? "default" : "ghost"}
              className={`flex flex-col items-center p-3 h-auto ${
                isSelected 
                  ? "bg-gradient-primary text-primary-foreground shadow-lg" 
                  : isToday 
                    ? "bg-secondary border-2 border-primary/30" 
                    : "hover:bg-secondary"
              }`}
              onClick={() => onDateSelect(day)}
            >
              <span className="text-base font-medium">
                {format(day, "EEEE", { locale: es })}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default WeeklyCalendar;