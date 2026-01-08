# i18n Implementation Guide

This project uses [next-intl](https://next-intl-docs.vercel.app/) for internationalization (i18n).

## Supported Languages

- Vietnamese (vi) - Default
- English (en)

## How It Works

### Directory Structure

```
src/
├── i18n/
│   ├── request.ts       # Request configuration
│   └── routing.ts       # Routing configuration
├── app/
│   ├── [locale]/        # Locale-specific pages
│   │   ├── layout.tsx   # Layout with locale support
│   │   ├── page.tsx     # Home page
│   │   └── ...
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Redirect to default locale
messages/
├── en.json              # English translations
└── vi.json              # Vietnamese translations
```

### Configuration Files

1. **`src/i18n/routing.ts`** - Defines supported locales and creates navigation helpers
2. **`src/i18n/request.ts`** - Configures how messages are loaded
3. **`next.config.ts`** - Includes next-intl plugin
4. **`src/middleware.ts`** - Handles locale detection and routing

## Usage

### Using Translations in Components

#### Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

#### Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('home');
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
    </div>
  );
}
```

### Using Translations for Arrays

```tsx
// For arrays in translation files
const benefits = t.raw('benefits.list');
benefits.map((benefit: string) => <li key={benefit}>{benefit}</li>);
```

### Navigation with i18n

Always use the Link component from `@/i18n/routing` instead of `next/link`:

```tsx
import { Link } from '@/i18n/routing';

export function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
import { useRouter } from '@/i18n/routing';

export function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Language Switcher

Use the built-in `LanguageSwitcher` component:

```tsx
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Adding New Translations

1. **Add translations to message files:**

```json
// messages/en.json
{
  "myNewSection": {
    "title": "My Title",
    "description": "My Description"
  }
}

// messages/vi.json
{
  "myNewSection": {
    "title": "Tiêu đề của tôi",
    "description": "Mô tả của tôi"
  }
}
```

2. **Use in your component:**

```tsx
const t = useTranslations('myNewSection');
return <h1>{t('title')}</h1>;
```

## Adding New Languages

1. **Update `src/i18n/routing.ts`:**

```typescript
export const routing = defineRouting({
  locales: ['vi', 'en', 'fr'], // Add new locale
  defaultLocale: 'vi',
});
```

2. **Create new message file:**

```bash
touch messages/fr.json
```

3. **Add translations to the new file**

4. **Update the `LanguageSwitcher` component** to include the new language option

## URL Structure

- Vietnamese (default): `https://aeiouly.online/vi/...`
- English: `https://aeiouly.online/en/...`
- Root URL automatically redirects to Vietnamese

## Important Notes

- Always use the i18n Link component for internal navigation
- Translation keys are type-safe (will show TypeScript errors if keys don't exist)
- The middleware automatically detects the user's preferred language
- All routes are automatically prefixed with the locale (e.g., `/vi/profile`, `/en/profile`)

## Development

When adding new pages or features:
1. Extract all user-facing text into translation files
2. Use the `useTranslations` hook for client components
3. Use `getTranslations` for server components
4. Test with both languages before committing

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
