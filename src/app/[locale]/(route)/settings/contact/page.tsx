import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import SettingHeader from '@/components/app/settings/SettingHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ } from '@/constants/faq';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('setting');

  return {
    title: t('contactPage.title'),
    description: t('contactPage.description'),
  };
}

export default function ContactPage() {
  const t = useTranslations('setting');

  return (
    <div className="space-y-4">
      <SettingHeader
        title={t('contactPage.title')}
        description={t('contactPage.description')}
        icon={MessageCircle}
      />

      <div className="grid grid-cols-1 gap-4">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">{t('contactPage.contactInfo')}</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{t('contactPage.email')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contactPage.supportEmail')}</p>
                  <p className="text-muted-foreground text-sm">{t('contactPage.infoEmail')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{t('contactPage.phone')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contactPage.phoneNumber')}</p>
                  <p className="text-muted-foreground text-sm">{t('contactPage.businessHours')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{t('contactPage.address')}</h3>
                  <p className="text-muted-foreground text-sm">{t('contactPage.fullAddress')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border">
            <h2 className="px-4 pt-4 text-xl font-semibold">{t('contactPage.faq')}</h2>
            <Accordion type="single" collapsible>
              {FAQ.map((item, index) => (
                <AccordionItem key={index} value={item.question}>
                  <AccordionTrigger className="px-4">{item.question}</AccordionTrigger>
                  <AccordionContent className="px-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
