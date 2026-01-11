'use client';

import React, { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/contexts/AuthContext';

import { FileText, Lock, MessageCircle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

const SettingNav = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const t = useTranslations('Settings');

  const menu = useMemo(
    () => [
      {
        title: t('nav.menu.general.title'),
        href: '/settings',
        icon: Lock,
        description: t('nav.menu.general.description'),
        role: ['user', 'admin'],
      },
      {
        title: t('nav.menu.privacy.title'),
        href: '/settings/policy',
        icon: Lock,
        description: t('nav.menu.privacy.description'),
        role: ['user', 'admin'],
      },
      {
        title: t('nav.menu.terms.title'),
        href: '/settings/terms',
        icon: FileText,
        description: t('nav.menu.terms.description'),
        role: ['user', 'admin'],
      },
      {
        title: t('nav.menu.contact.title'),
        href: '/settings/contact',
        icon: MessageCircle,
        description: t('nav.menu.contact.description'),
        role: ['user', 'admin'],
      },
      {
        title: t('nav.menu.deleteAccount.title'),
        href: '/settings/delete-account',
        icon: Trash2,
        description: t('nav.menu.deleteAccount.description'),
        danger: true,
        role: 'user',
      },
    ],
    [t]
  );

  return (
    <div className="mx-auto w-full lg:max-w-md">
      <div className="overflow-hidden transition-all">
        <div className="border-b pb-4 sm:p-4">
          <h2 className="text-foreground text-xl font-semibold dark:text-white">
            {t('nav.title')}
          </h2>
          <p className="text-muted-foreground text-sm dark:text-gray-400">{t('nav.description')}</p>
        </div>

        <div className="flex flex-col gap-2 py-4 sm:p-2">
          {menu
            .filter((item) => {
              if (!user) return false;
              if (
                typeof item.role === 'string'
                  ? item.role === user.role
                  : item.role?.includes(user.role)
              )
                return true;
              return false;
            })
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <motion.div key={item.title} className="relative">
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-xl p-2 transition-all duration-200 ${
                      isActive
                        ? item.danger
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                          : 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary'
                        : 'text-foreground hover:bg-accent/50 dark:hover:bg-accent/30 dark:text-gray-300'
                    } ${item.danger && !isActive ? 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400' : ''}`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                        isActive
                          ? item.danger
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                            : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-muted/70 dark:bg-accent/50 dark:group-hover:bg-accent/70 dark:text-gray-400'
                      } ${item.danger && !isActive ? 'group-hover:bg-red-100 group-hover:text-red-500 dark:group-hover:bg-red-900/30 dark:group-hover:text-red-400' : ''}`}
                    >
                      <Icon className="size-5 transition-transform group-hover:scale-110" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate text-sm font-medium">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs dark:text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className={`absolute inset-0 -z-10 rounded-xl ring-1 ${
                          item.danger
                            ? 'bg-red-50 ring-red-200 dark:bg-red-950/50 dark:ring-red-900/50'
                            : 'bg-primary/5 ring-primary/20 dark:bg-primary/10 dark:ring-primary/30'
                        }`}
                        initial={false}
                        transition={{
                          type: 'spring',
                          bounce: 0.15,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
        </div>
        <Separator className="block sm:hidden" />
      </div>
    </div>
  );
};

export default SettingNav;
