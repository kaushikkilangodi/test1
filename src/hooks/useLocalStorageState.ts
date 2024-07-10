import { useState } from 'react';
import { useEffect } from 'react';

export function useLocalStorageState<T>(initialState: T, key: string, mutate: boolean = false){
  // NOTE: lazy initialization is possible only by passing call back function to the useState hooks
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue && !mutate) {
      return JSON.parse(storedValue);
    }

    return initialState;
  });

  // * Dependencies (key: is for initial function call. value: is when value changes)
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value]
  );

  return [value, setValue];
}
