import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../hooks/useTheme';

export function ThemeSelect() {
  const { theme, handleThemeChange } = useTheme();

  return (
    <div className="theme-select-container">
      {theme === 'system' ? <Monitor size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
      <select 
        className="theme-select" 
        value={theme} 
        onChange={(e) => handleThemeChange(e.target.value as Theme)}
        aria-label="Select theme"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
