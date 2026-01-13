'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
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
  RequestPasswordResetSchema,
  requestPasswordResetSchema,
  useRequestPasswordResetMutation,
} from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

const ForgotPWForm = () => {
  const router = useRouter();
  const t = useTranslations('auth');

  const forgotPWForm = useForm<RequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const requestPWMutate = useRequestPasswordResetMutation();

  const onSubmit = (data: RequestPasswordResetSchema) => {
    requestPWMutate.mutate(data, {
      onSuccess: () => {
        toast.success(t('api.auth.PASSWORD_RESET_REQUEST_SUCCESS'));
      },
      onError: (error) => {
        toast.error(
          t(`api.auth.${(error as any).detail?.code}`) ||
            (error as any).detail?.message ||
            t('forgotPassword.error')
        );
      },
    });
  };

  return (
    <Form {...forgotPWForm}>
      <form onSubmit={forgotPWForm.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('forgotPassword.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t('forgotPassword.description')}
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {/* Email Field */}
          <FormField
            control={forgotPWForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('forgotPassword.email')}</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {t('forgotPassword.submit')}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push(ROUTE.AUTH.LOGIN)}
          >
            {t('forgotPassword.backToLogin')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ForgotPWForm };
