'use client';

import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Clock, Construction, LifeBuoy, RefreshCw } from 'lucide-react';

type MaintenancePageProps = {
  title?: string;
  message?: string;
  expectedBackAt?: string;
  statusHref?: string;
  supportEmail?: string;
};

const MaintenancePage = ({
  title,
  message,
  expectedBackAt,
  statusHref,
  supportEmail,
}: MaintenancePageProps) => {
  const t = useTranslations('maintenance');

  const resolvedTitle = title ?? t('title');
  const resolvedMessage = message ?? t('message');

  return (
    <div className="bg-background fixed inset-0 z-100 flex size-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="from-primary/20 absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl" />
        <div className="from-muted/60 absolute right-[-10%] -bottom-48 size-[520px] rounded-full bg-gradient-to-tr to-transparent blur-3xl" />
      </div>

      <Card className="relative w-full max-w-xl">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-card flex size-11 items-center justify-center rounded-xl border">
                <Construction className="size-5" />
              </div>
              <div className="space-y-1">
                <Badge variant="warning">{t('badge')}</Badge>
                <CardTitle className="text-xl sm:text-2xl">{resolvedTitle}</CardTitle>
              </div>
            </div>

            <div className="text-muted-foreground hidden items-center gap-2 sm:flex">
              <span className="text-xs">503</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs">{t('serviceUnavailable')}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">{resolvedMessage}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {expectedBackAt ? (
            <div className="bg-muted/30 flex items-center gap-2 rounded-lg border px-3 py-2">
              <Clock className="text-muted-foreground size-4" />
              <p className="text-sm">
                {t('expectedBack')} <span className="font-medium">{expectedBackAt}</span>
              </p>
            </div>
          ) : null}

          <div className="bg-card rounded-lg border">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                <Construction className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{t('whatYouCanDoTitle')}</p>
                <p className="text-muted-foreground text-xs">{t('whatYouCanDoSubtitle')}</p>
              </div>
            </div>
            <Separator />
            <ul className="text-muted-foreground space-y-2 px-3 py-3 text-sm">
              <li className="flex gap-2">
                <span className="bg-primary/70 mt-1 size-1.5 shrink-0 rounded-full" />
                {t('actions.refresh')}
              </li>
              <li className="flex gap-2">
                <span className="bg-primary/70 mt-1 size-1.5 shrink-0 rounded-full" />
                {t('actions.checkStatus')}
              </li>
              <li className="flex gap-2">
                <span className="bg-primary/70 mt-1 size-1.5 shrink-0 rounded-full" />
                {t('actions.contactSupport')}
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <a href="." aria-label="Reload the page">
                <RefreshCw />
                {t('buttons.reload')}
              </a>
            </Button>

            {statusHref ? (
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href={statusHref}>
                  <LifeBuoy />
                  {t('buttons.status')}
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {supportEmail ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={`mailto:${supportEmail}`}>{t('buttons.contactSupport')}</a>
              </Button>
            ) : null}

            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/">{t('buttons.goHome')}</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaintenancePage;
