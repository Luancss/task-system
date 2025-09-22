import { useState, useEffect } from "react";

interface UseDatePickerProps {
  initialDate?: Date;
}

export function useDatePicker({ initialDate }: UseDatePickerProps = {}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const reset = () => {
    setSelectedDate(undefined);
  };

  return {
    selectedDate,
    setSelectedDate,
    reset,
  };
}
