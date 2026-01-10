'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import SettingHeader from '@/components/app/settings/SettingHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteAccountMutation } from '@/services/auth/delete-account.api';

import { ShieldAlert, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteAccountMutation = useDeleteAccountMutation();
  const t = useTranslations('Settings');

  const handleDeleteAccount = () => {
    if (!isValidConfirmation) {
      toast.error(t('invalidConfirmation'));
      return;
    }

    deleteAccountMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data?.message || t('accountDeletedSuccess'));
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      },
      onError: (error: any) => {
        const errorMessage = error?.detail || error?.message || t('accountDeleteError');
        toast.error(errorMessage);
      },
    });
  };

  const isValidConfirmation =
    confirmText.toLowerCase() === t('confirmDelete').toLowerCase().replace(/"/g, '');

  return (
    <div className="space-y-8">
      <SettingHeader
        title={t('deleteAccountTitle')}
        description={t('deleteAccountWarning')}
        icon={Trash2}
        className="text-destructive"
      />

      <div className="max-w-2xl space-y-4">
        {!showConfirm ? (
          <div className="space-y-4">
            <p className="text-foreground/80 text-base">{t('deleteAccountNote')}</p>
            <ul className="text-foreground/80 list-disc space-y-2 pl-4 text-sm font-medium">
              {t.raw('deleteAccountRisks').map((risk: string, index: number) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={() => setShowConfirm(true)}
                className="w-full sm:w-auto"
              >
                {t('understandRisks')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm">
                {t('confirmDelete')}{' '}
                <span className="bg-primary text-foreground rounded-sm px-2 py-1 font-bold">
                  {t('confirmDeleteText')}
                </span>{' '}
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
              <div className="flex">
                <ShieldAlert className="text-destructive mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-destructive font-medium">{t('confirmDeleteWarning')}</h3>
                  <p className="text-destructive/80 text-sm">{t('confirmDeleteDescription')}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={!isValidConfirmation || deleteAccountMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {t('confirmDeleteButton')}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleteAccountMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
