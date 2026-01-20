'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import SettingHeader from '@/components/app/settings/SettingHeader';
import ThemeCustomizer from '@/components/app/settings/ThemeCustomizer';
import { LanguageSwitcher } from '@/components/language-swicther';
import { ModeToggle } from '@/components/mode-toggle';
import { PasswordStrengthMeter } from '@/components/shared/PasswordStrengthMeter';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangePasswordSchema, changePasswordSchema } from '@/services/auth/forgot-password.api';
import { useChangePasswordMutation } from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckCircle, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

const SettingPage = () => {
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const { mutate: changePassword, isPending } = useChangePasswordMutation();
  const t = useTranslations('setting');

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success(t('passwordChangedSuccess'));
        form.reset();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <SettingHeader title={t('title')} icon={Lock} description={t('description')} />

        <Label className="text-lg font-semibold">{t('interface')}</Label>
        <div className="rounded-xl border">
          <div className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <Label className="font-medium text-gray-500">{t('themeToggle')}</Label>
                <p className="mt-1 font-medium">{t('themeToggleDescription')}</p>
              </div>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <Label className="font-medium text-gray-500">{t('languageSwitcher')}</Label>
                <p className="mt-1 font-medium">{t('languageSwitcherDescription')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <ThemeCustomizer />
      </div>

      {/* Change Password Section */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">{t('security')}</Label>
        <div className="rounded-xl border p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{t('changePassword')}</h3>
            <p className="text-muted-foreground text-sm">{t('changePasswordDescription')}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Current Password Field */}
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground flex items-center gap-2 text-sm font-medium">
                      <Lock size={16} className="text-muted-foreground" />
                      {t('currentPassword')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('currentPasswordPlaceholder')}
                        {...field}
                        disabled={isPending}
                        className="border-border focus:border-primary h-10 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm font-medium">
                      {t('newPassword')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isShowNewPassword ? 'text' : 'password'}
                          placeholder={t('newPasswordPlaceholder')}
                          {...field}
                          disabled={isPending}
                          className="border-border focus:border-primary h-10 rounded-lg"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setIsShowNewPassword((prev) => !prev)}
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {isShowNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                    <PasswordStrengthMeter
                      passwordFieldName="new_password"
                      control={form.control}
                    />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
                {isPending ? t('updating') : t('updatePassword')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
