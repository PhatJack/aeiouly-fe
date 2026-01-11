'use client';

import * as React from 'react';
import { Us, Vi } from 'react-flags-select';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Check, Languages } from 'lucide-react';

type Language = {
  flag: React.ReactNode;
  code: string;
  label: string;
};

const LANGUAGES: Language[] = [
  { flag: <Us />, code: 'en', label: 'English' },
  { flag: <Vi />, code: 'vi', label: 'Tiếng Việt' },
];

export function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();

  const switchLanguage = (nextLocale: string) => {
    if (locale === nextLocale) return;

    // Set next-intl cookie
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/`;

    // Re-render current route
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Languages />
          {locale}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className="flex items-center justify-between"
          >
            <span>
              {lang.flag} {lang.label}
            </span>
            {lang.code === locale && <Check className="text-primary h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
