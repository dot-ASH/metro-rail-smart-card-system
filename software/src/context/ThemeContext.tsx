import React, {createContext, useState, ReactNode} from 'react';

interface ThemeContextProps {
  darkMode: boolean;
  toggleOffDarkMode: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextProps>({
  darkMode: true,
  // darkMode: false,
  toggleOffDarkMode: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  // const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleOffDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <ThemeContext.Provider value={{darkMode, toggleOffDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
