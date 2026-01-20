'use client';

import * as React from 'react';
import { Us, Vn } from 'react-flags-select';

import { useLocale } from 'next-intl';
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
  { flag: <Vn />, code: 'vi', label: 'Tiếng Việt' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
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
        <Button variant="outline" className="gap-2 bg-transparent dark:bg-transparent">
          <Languages />
          {locale}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span>{lang.flag}</span>
            <span className="text-left">{lang.label}</span>
            {locale === lang.code ? <Check className="ml-auto h-4 w-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
