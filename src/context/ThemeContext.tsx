import React, { useContext, createContext } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { createCustomTheme } from 'src/theme/create-theme';

import useThemeMode from '../hooks/use-theme-mode';

type ThemeContextProps = {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mode, toggleTheme } = useThemeMode();

    // Atualiza o tema dinamicamente
    const theme = createCustomTheme({ mode });

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

// Hook para acessar o contexto
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext deve ser usado dentro de ThemeProviderWrapper');
    }
    return context;
};
