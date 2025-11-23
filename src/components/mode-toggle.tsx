'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(theme === 'dark' ? 'light' : 'dark'));
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="size-10 sm:size-12" />;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative size-10 overflow-hidden rounded-full sm:size-12 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-5"
      aria-label="Toggle theme"
    >
      <Sun
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'
        }`}
      />
    </Button>
  );
}
