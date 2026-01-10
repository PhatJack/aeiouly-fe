import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import SettingHeader from '@/components/app/settings/SettingHeader';

import { Lock } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Settings');

  return {
    title: t('policyPage.title'),
    description: t('policyPage.description'),
  };
}

export default function PolicyPage() {
  const t = useTranslations('Settings');

  return (
    <div className="space-y-4">
      <SettingHeader
        title={t('policyPage.title')}
        description={t('policyPage.lastUpdated')}
        icon={Lock}
      />

      <div className="space-y-4">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('policyPage.sections.infoCollection.title')}</h2>
          <p className="text-foreground/80">{t('policyPage.sections.infoCollection.content')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('policyPage.sections.infoUsage.title')}</h2>
          <p className="text-foreground/80">{t('policyPage.sections.infoUsage.content')}</p>
          <ul className="text-foreground/80 list-disc space-y-2 pl-6">
            {t.raw('policyPage.sections.infoUsage.list').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('policyPage.sections.infoSecurity.title')}</h2>
          <p className="text-foreground/80">{t('policyPage.sections.infoSecurity.content')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('policyPage.sections.contact.title')}</h2>
          <p className="text-foreground/80">{t('policyPage.sections.contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
