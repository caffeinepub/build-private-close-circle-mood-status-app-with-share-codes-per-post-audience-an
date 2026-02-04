import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import IconActionButton from '@/components/common/IconActionButton';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconActionButton
      icon={theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    />
  );
}
