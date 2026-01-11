import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import SettingHeader from '@/components/app/settings/SettingHeader';

import { FileText } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Settings');

  return {
    title: t('termsPage.title'),
    description: t('termsPage.description'),
  };
}

export default function TermsPage() {
  const t = useTranslations('Settings');

  return (
    <div className="space-y-4">
      <SettingHeader
        title={t('termsPage.title')}
        description={t('termsPage.effectiveDate')}
        icon={FileText}
      />

      <div className="space-y-4">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('termsPage.sections.introduction.title')}</h2>
          <p className="text-foreground/80">{t('termsPage.sections.introduction.content')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            {t('termsPage.sections.accountRegistration.title')}
          </h2>
          <p className="text-foreground/80">
            {t('termsPage.sections.accountRegistration.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            {t('termsPage.sections.intellectualProperty.title')}
          </h2>
          <p className="text-foreground/80">
            {t('termsPage.sections.intellectualProperty.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            {t('termsPage.sections.liabilityLimitation.title')}
          </h2>
          <p className="text-foreground/80">
            {t('termsPage.sections.liabilityLimitation.content')}
          </p>
          <ul className="text-foreground/80 list-disc space-y-2 pl-6">
            {t
              .raw('termsPage.sections.liabilityLimitation.list')
              .map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('termsPage.sections.termsChanges.title')}</h2>
          <p className="text-foreground/80">{t('termsPage.sections.termsChanges.content')}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t('termsPage.sections.contact.title')}</h2>
          <p className="text-foreground/80">{t('termsPage.sections.contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
