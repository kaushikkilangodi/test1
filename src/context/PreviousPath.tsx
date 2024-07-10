import { createContext, useState, useContext, ReactNode } from 'react';

interface PreviousContextProps {
  from: string | null;
  setFrom: (value: string) => void;
}

const PreviousContext = createContext<PreviousContextProps>({
  from: null,
  setFrom: () => {},
});

export const usePreviousPath = () => useContext(PreviousContext);

export const PreviousProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [from, setFrom] = useState<string | null>(null);

  return (
    <PreviousContext.Provider value={{ from, setFrom }}>
      {children}
    </PreviousContext.Provider>
  );
};
