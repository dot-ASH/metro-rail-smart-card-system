import React, {createContext, useState, ReactNode, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('darkMode', value);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('darkMode');
      if (value !== null) {
        value === 'true' ? setDarkMode(true) : setDarkMode(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleOffDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
    storeData(String(!darkMode));
  };

  return (
    <ThemeContext.Provider value={{darkMode, toggleOffDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
