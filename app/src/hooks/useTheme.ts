import { useState, useEffect } from 'react';

export type Theme = 'system' | 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme-preference');
    return (saved as Theme) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
      } else if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    
    applyTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  };

  return { theme, handleThemeChange };
}
