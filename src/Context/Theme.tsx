
import{ createContext, useContext, useState, type ReactNode } from 'react';
import type { panierProps } from '../Constantes';

// Définition du type du contexte
type ThemeType = {
  isDark: boolean;
  toggleTheme: () => void;
  panier: panierProps[] 
  setPanier: React.Dispatch<React.SetStateAction<panierProps[] >>;
 
};

// Création du contexte avec un type optionnel
const Theme = createContext<ThemeType | undefined>(undefined);

// Hook personnalisé avec typage
export const useTheme = (): ThemeType => {
  const context = useContext(Theme);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};

// Typage des props du provider
type ThemeProviderProps = {
  children: ReactNode;
};

// Provider avec typage
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const toggleTheme = () => setIsDark(prev => !prev);
 const [panier,setPanier]= useState<panierProps[]>([])

  return (
    <Theme.Provider value={{ isDark, toggleTheme,panier,setPanier}}>
      {children}
    </Theme.Provider>
  );
};
