// DateContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface DateContextProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

export const DateContext = createContext<DateContextProps>({
  selectedDate: null,
  setSelectedDate: () => {},
});

export const DateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
console.log("Hiiiiiiiiiiiiiiii",selectedDate);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
