'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

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
import { ROUTE } from '@/configs/route';
import { cn } from '@/lib/utils';
import {
  ConfirmPasswordResetSchema,
  confirmPasswordResetSchema,
  useConfirmPasswordResetMutation,
} from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

const PasswordResetForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('auth');

  const passwordResetForm = useForm<ConfirmPasswordResetSchema>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: {
      token: (searchParams.get('token') as string) || '',
      new_password: '',
    },
  });

  const confirmPWResetMutate = useConfirmPasswordResetMutation();

  const onSubmit = (data: ConfirmPasswordResetSchema) => {
    confirmPWResetMutate.mutate(data, {
      onSuccess: (response) => {
        toast.success(t(`api.auth.${response.code}`));
        router.push(ROUTE.AUTH.LOGIN);
      },
      onError: (error) => {
        toast.error(
          t(`api.auth.${(error as any).detail?.code}`) ||
            (error as any).detail?.message ||
            t('resetPassword.error')
        );
      },
    });
  };

  return (
    <Form {...passwordResetForm}>
      <form onSubmit={passwordResetForm.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('resetPassword.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t('resetPassword.description')}
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {/* Password Field */}
          <FormField
            control={passwordResetForm.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('resetPassword.newPassword')}</FormLabel>
                <FormControl>
                  <Input placeholder="New Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {t('resetPassword.submit')}
          </Button>
          <div className="grid">
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => router.push('/forgot-password')}
            >
              {t('resetPassword.backToForgotPassword')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              {t('resetPassword.backToLogin')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export { PasswordResetForm };
